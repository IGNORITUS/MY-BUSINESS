const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const convertSvgToWebP = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log(`Converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
  }
};

const processDirectory = async (dir) => {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const inputPath = path.join(dir, file);
    const stat = fs.statSync(inputPath);
    
    if (stat.isDirectory()) {
      await processDirectory(inputPath);
    } else if (file.endsWith('.svg')) {
      const outputPath = inputPath.replace('.svg', '.webp');
      await convertSvgToWebP(inputPath, outputPath);
    }
  }
};

const main = async () => {
  const publicDir = path.join(__dirname, '../public');
  const imagesDir = path.join(publicDir, 'images');
  
  if (fs.existsSync(imagesDir)) {
    await processDirectory(imagesDir);
  }
};

main().catch(console.error); 