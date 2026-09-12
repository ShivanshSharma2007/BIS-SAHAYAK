const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/images/cards');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function processCards() {
  const f1 = 'C:/Users/SHIVANSH SHARMA/.gemini/antigravity-ide/brain/f9d384ff-c426-4da4-8c1a-6a90c68e12fd/.user_uploaded/media_1789169618279.png';
  const f2 = 'C:/Users/SHIVANSH SHARMA/.gemini/antigravity-ide/brain/f9d384ff-c426-4da4-8c1a-6a90c68e12fd/.user_uploaded/media_1789169826609.png';

  const specs = [
    { file: f1, cx: 182.5, cy: 388, r: 33.5, name: 'scanner.png' },
    { file: f1, cx: 503.5, cy: 385.5, r: 33.5, name: 'parser.png' },
    { file: f1, cx: 824.5, cy: 385.5, r: 33.5, name: 'fraud.png' },
    { file: f2, cx: 194.5, cy: 360.5, r: 33.5, name: 'labs.png' },
    { file: f2, cx: 514.5, cy: 360.5, r: 33.5, name: 'navigator.png' },
    { file: f2, cx: 829.0, cy: 360.0, r: 33.5, name: 'auditor.png' }
  ];

  const size = 160;
  // Circular mask
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white" />
    </svg>`
  );

  for (const s of specs) {
    const left = Math.round(s.cx - s.r);
    const top = Math.round(s.cy - s.r);
    const dim = Math.round(s.r * 2);

    const rawCrop = await sharp(s.file)
      .extract({ left, top, width: dim, height: dim })
      .resize(size, size, { kernel: 'lanczos3' })
      .toBuffer();

    await sharp(rawCrop)
      .composite([{
        input: circleMask,
        blend: 'dest-in'
      }])
      .png()
      .toFile(path.join(outDir, s.name));
    
    console.log('Saved', s.name, { left, top, dim });
  }
}

processCards().catch(console.error);
