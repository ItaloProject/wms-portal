import sharp from 'sharp';
import { existsSync, renameSync, unlinkSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');
const source = join(publicDir, 'logo-wms-source.png');
const output = join(publicDir, 'logo-wms.png');
const tmp = join(publicDir, 'logo-wms.png.tmp');

if (!existsSync(source)) {
  throw new Error('Arquivo public/logo-wms-source.png não encontrado.');
}

const { data, info } = await sharp(source)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height } = info;
const pixels = new Uint8Array(data);
const visited = new Uint8Array(width * height);
const queue = [];

const idx = (x, y) => (y * width + x) * 4;
const pos = (x, y) => y * width + x;

function matchesBackground(x, y) {
  const i = idx(x, y);
  const r = pixels[i];
  const g = pixels[i + 1];
  const b = pixels[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max - min;
  const bright = (r + g + b) / 3;

  // Branco / cinza claro / halo externo
  if (bright > 80 && sat < 58) return true;
  // Fundo cinza escuro texturizado do arquivo original
  if (bright >= 26 && bright <= 150 && sat < 42) return true;
  // Preto neutro
  if (bright < 26 && sat < 36) return true;

  return false;
}

function seedEdge(x, y) {
  const p = pos(x, y);
  if (visited[p] || !matchesBackground(x, y)) return;
  visited[p] = 1;
  queue.push([x, y]);
}

for (let x = 0; x < width; x++) {
  seedEdge(x, 0);
  seedEdge(x, height - 1);
}
for (let y = 0; y < height; y++) {
  seedEdge(0, y);
  seedEdge(width - 1, y);
}

while (queue.length) {
  const [x, y] = queue.pop();
  const i = idx(x, y);
  pixels[i + 3] = 0;

  for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
    if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
    const np = pos(nx, ny);
    if (visited[np]) continue;
    if (!matchesBackground(nx, ny)) continue;
    visited[np] = 1;
    queue.push([nx, ny]);
  }
}

// Remove franja clara semi-transparente colada nas bordas do recorte
for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    const i = idx(x, y);
    if (pixels[i + 3] === 0) continue;

    let transparentNeighbors = 0;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (pixels[idx(nx, ny) + 3] === 0) transparentNeighbors++;
    }

    if (transparentNeighbors === 0) continue;

    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    const bright = (r + g + b) / 3;

    if (bright > 95 && sat < 55) {
      pixels[i + 3] = transparentNeighbors >= 3 ? 0 : Math.min(pixels[i + 3], 48);
    } else if (bright >= 26 && bright <= 150 && sat < 42 && transparentNeighbors >= 2) {
      pixels[i + 3] = Math.min(pixels[i + 3], 64);
    }
  }
}

// De-matting: remove contaminação branca de pixels semi-transparentes nas bordas.
// Pixels que foram compostos sobre fundo branco (C = original*A + 255*(1-A))
// ficam "lavados". Revertemos: original = (C - 255*(1-A)) / A
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = idx(x, y);
    const a = pixels[i + 3];
    if (a === 0 || a === 255) continue; // ignora totalmente transparente/opaco

    const af = a / 255;
    for (let c = 0; c < 3; c++) {
      // Reverte composição sobre branco
      const original = (pixels[i + c] - 255 * (1 - af)) / af;
      pixels[i + c] = Math.max(0, Math.min(255, Math.round(original)));
    }
  }
}

await sharp(Buffer.from(pixels), { raw: { width, height, channels: 4 } })
  .trim({ threshold: 8 })
  .png({ compressionLevel: 9 })
  .toFile(tmp);

try { unlinkSync(output); } catch { /* ok */ }
renameSync(tmp, output);

const { data: outData, info: outInfo } = await sharp(output)
  .raw()
  .toBuffer({ resolveWithObject: true });

let transparent = 0;
let opaque = 0;
for (let i = 3; i < outData.length; i += 4) {
  if (outData[i] < 10) transparent++;
  else opaque++;
}

console.log(`Logo com fundo transparente → public/logo-wms.png (${outInfo.width}x${outInfo.height}, ${transparent} px transparentes, ${opaque} opacos)`);
