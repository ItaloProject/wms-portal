import sharp from 'sharp';
import { readdirSync } from 'fs';
import { join, basename, extname } from 'path';

const dir = 'public';
const files = readdirSync(dir).filter(f =>
  /\.(jpg|jpeg)$/i.test(f) // fotos — logo fica em PNG (necessário para CSS mask)
);

for (const file of files) {
  const out = join(dir, basename(file, extname(file)) + '.webp');
  await sharp(join(dir, file))
    .webp({ quality: 82, effort: 6 })
    .toFile(out);
  console.log(`✓ ${file} → ${basename(out)}`);
}

console.log(`\nConcluído: ${files.length} imagens convertidas.`);
