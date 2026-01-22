import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

/**
 * Generate thumbnails for all postcard images
 * Uses sharp (Node.js image processing library) - no external dependencies needed
 */

const rootDir = process.cwd();

function findCategoryFolders(rootDir: string): string[] {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  return entries
    .filter(entry => 
      entry.isDirectory() && 
      !['node_modules', '.git', 'dist', 'src', 'public', '.astro', '.github'].includes(entry.name) &&
      !entry.name.startsWith('.')
    )
    .map(entry => entry.name)
    .sort();
}

async function generateThumbnail(sourcePath: string, destPath: string, maxWidth: number = 300): Promise<void> {
  try {
    // Create thumbnail directory if it doesn't exist
    const thumbDir = path.dirname(destPath);
    if (!fs.existsSync(thumbDir)) {
      fs.mkdirSync(thumbDir, { recursive: true });
    }

    // Use sharp to create thumbnail
    await sharp(sourcePath)
      .resize(maxWidth, maxWidth, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(destPath);
    
    console.log(`Generated thumbnail: ${path.basename(destPath)}`);
  } catch (error) {
    console.error(`Error generating thumbnail for ${sourcePath}:`, error);
  }
}

async function processCategory(categoryFolder: string): Promise<void> {
  // Images are in public folder after copy-images script runs
  const categoryPath = path.join(rootDir, 'public', categoryFolder);
  const thumbPath = path.join(rootDir, 'public', categoryFolder, 'thumbs');
  
  if (!fs.existsSync(categoryPath)) {
    return;
  }

  const files = fs.readdirSync(categoryPath);
  const imageFiles = files.filter(file => 
    /\.(png|jpg|jpeg)$/i.test(file) && !file.includes('_001')
  );

  const promises = imageFiles.map(async (imageFile) => {
    const sourcePath = path.join(categoryPath, imageFile);
    const thumbName = `thumb_${path.basename(imageFile, path.extname(imageFile))}.jpg`;
    const destPath = path.join(thumbPath, thumbName);

    // Skip if thumbnail already exists and is newer than source
    if (fs.existsSync(destPath)) {
      const sourceStat = fs.statSync(sourcePath);
      const destStat = fs.statSync(destPath);
      if (destStat.mtime >= sourceStat.mtime) {
        return;
      }
    }

    await generateThumbnail(sourcePath, destPath);
  });

  await Promise.all(promises);
}

async function main() {
  console.log('Generating thumbnails...');
  const categories = findCategoryFolders(rootDir);

  for (const category of categories) {
    console.log(`Processing ${category}...`);
    await processCategory(category);
  }

  console.log('Thumbnail generation complete!');
}

main().catch(console.error);
