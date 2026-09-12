const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, '../public/images/cards');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// In media_1789169618279.png (1024 x 647):
// Let's locate the 3 circular images in row 1:
// Card 1 center ~ x=185, y=595? Let's check where the cards are in image 1.
// In image 1:
// "Ask BIS-SmartAssist..." search bar is in the middle.
// The cards start below search bar.
// Height is 647.
// Card 1 circle is visible.
