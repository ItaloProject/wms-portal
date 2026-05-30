/**
 * Remoção de fundo da logo WMS.
 * Estratégia: flood-fill conservador a partir das bordas,
 * seguido de suavização de borda + de-matting (remove branco residual
 * dos pixels semi-transparentes gerados pelo anti-aliasing sobre fundo branco).
 */
import sharp from 'sharp';
import { existsSync, renameSync, unlinkSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');
const source = join(publicDir, 'logo-wms-source.png');
const output = join(publicDir, 'logo-wms.png');
const tmp   = join(publicDir, 'logo-wms.png.tmp');

if (!existsSync(source)) throw new Error('Arquivo logo-wms-source.png não encontrado.');

const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const pixels  = new Uint8Array(data);
const visited = new Uint8Array(width * height);
const queue   = [];

const idx = (x, y) => (y * width + x) * 4;
const pos = (x, y) =>  y * width + x;

/**
 * Decide se um pixel é fundo removível.
 * Conservador: só remove branco/cinza claro/sombra clara.
 * NÃO remove azuis escuros, verdes, nem cinza muito escuro.
 */
function isBackground(x, y) {
  const i = idx(x, y);
  const r = pixels[i], g = pixels[i+1], b = pixels[i+2];
  const lo  = Math.min(r, g, b);
  const hi  = Math.max(r, g, b);
  const sat = hi - lo;                      // saturação 0-255
  const lum = (r + g + b) / 3;             // luminosidade média

  if (lum > 235 && sat < 25)  return true; // branco puro
  if (lum > 200 && sat < 40)  return true; // quase-branco
  if (lum > 130 && sat < 18)  return true; // cinza claro (sombra sobre branco)
  // lum <= 130 com saturação baixa = pode ser escuro do logo -> não remover
  return false;
}

// Semeia a fila a partir de todas as bordas
function seedEdge(x, y) {
  const p = pos(x, y);
  if (visited[p] || !isBackground(x, y)) return;
  visited[p] = 1;
  queue.push(x, y);   // push dois inteiros separados (mais rápido que [x,y])
}

for (let x = 0; x < width;  x++) { seedEdge(x, 0); seedEdge(x, height-1); }
for (let y = 0; y < height; y++) { seedEdge(0, y); seedEdge(width-1, y);  }

// Flood-fill iterativo (sem recursão para evitar stack overflow)
let qi = 0;
while (qi < queue.length) {
  const x = queue[qi++];
  const y = queue[qi++];
  pixels[idx(x, y) + 3] = 0; // torna transparente

  for (const [nx, ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]) {
    if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
    const np = pos(nx, ny);
    if (visited[np]) continue;
    if (!isBackground(nx, ny)) continue;
    visited[np] = 1;
    queue.push(nx, ny);
  }
}

// ─── Passe 1: suaviza franja branca nas bordas do recorte ───────────────────
// Pixels opacos adjacentes a pixels transparentes que ainda sejam
// quase-brancos (possivelmente anti-aliasing sobre branco) têm alpha reduzido.
for (let y = 1; y < height-1; y++) {
  for (let x = 1; x < width-1; x++) {
    const i = idx(x, y);
    if (pixels[i+3] === 0) continue;   // já transparente

    let tNeighbors = 0;
    for (const [nx, ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]) {
      if (pixels[idx(nx, ny)+3] === 0) tNeighbors++;
    }
    if (tNeighbors === 0) continue;

    const r = pixels[i], g = pixels[i+1], b = pixels[i+2];
    const sat = Math.max(r,g,b) - Math.min(r,g,b);
    const lum = (r+g+b)/3;

    // Franja muito clara (quase branco): atenua fort
    if (lum > 200 && sat < 45) {
      pixels[i+3] = tNeighbors >= 3 ? 0 : Math.min(pixels[i+3], 50);
    }
    // Cinza claro leve: atenua suave
    else if (lum > 140 && sat < 22 && tNeighbors >= 2) {
      pixels[i+3] = Math.min(pixels[i+3], 80);
    }
  }
}

// ─── Passe 2: de-matting ────────────────────────────────────────────────────
// Pixels semi-transparentes tiveram suas cores "lavadas" pelo fundo branco
// (anti-aliasing). Revertemos: C_orig = (C_comp - 255*(1-a)) / a
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = idx(x, y);
    const a = pixels[i+3];
    if (a === 0 || a === 255) continue;  // totalmente transp. ou opaco → pula

    const af = a / 255;
    for (let c = 0; c < 3; c++) {
      const orig = (pixels[i+c] - 255*(1-af)) / af;
      pixels[i+c] = Math.max(0, Math.min(255, Math.round(orig)));
    }
  }
}

// ─── Salva resultado ────────────────────────────────────────────────────────
await sharp(Buffer.from(pixels), { raw: { width, height, channels: 4 } })
  .trim({ threshold: 5 })
  .png({ compressionLevel: 9 })
  .toFile(tmp);

try { unlinkSync(output); } catch { /* ok */ }
renameSync(tmp, output);

// Relatório
const { data: out, info: oi } = await sharp(output).raw().toBuffer({ resolveWithObject: true });
let transp = 0, opaque = 0;
for (let i = 3; i < out.length; i += 4) { out[i] < 10 ? transp++ : opaque++; }

console.log(`✓ logo-wms.png → ${oi.width}×${oi.height}  |  transp: ${transp}  opaco: ${opaque}`);
