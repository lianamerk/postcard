import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

/**
 * Optimize all postcard images:
 * 1. Convert to WebP (smaller file sizes, better compression)
 * 2. Create optimized PNG/JPG versions (compressed)
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

async function optimizeImage(
  sourcePath: string,
  webpPath: string,
  optimizedPath: string
): Promise<void> {
  try {
    const ext = path.extname(sourcePath).toLowerCase();
    const isPNG = ext === '.png';
    
    // Create directories if needed
    [webpPath, optimizedPath].forEach(filePath => {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Skip if all outputs exist and are newer than source
    const sourceStat = fs.statSync(sourcePath);
    const allExist = [webpPath, optimizedPath].every(p => {
      if (!fs.existsSync(p)) return false;
      return fs.statSync(p).mtime >= sourceStat.mtime;
    });
    if (allExist) {
      return;
    }

    // Load image - preserve original orientation exactly as it is
    // Sharp by default auto-rotates based on EXIF, but we want to keep images as-is
    // Use .withMetadata() to preserve EXIF, OR disable auto-orientation
    const image = sharp(sourcePath, { failOnError: false });
    const metadata = await image.metadata();
    
    // Disable auto-orientation by using .rotate() with no arguments
    // This tells sharp to NOT auto-rotate based on EXIF orientation
    // The image will be saved exactly as the pixel data appears, preserving original orientation

    // 1. Generate WebP version (best compression, modern format)
    if (!fs.existsSync(webpPath) || fs.statSync(webpPath).mtime < sourceStat.mtime) {
      await image
        .clone()
        .rotate() // Disable auto-orientation - keep original pixel orientation
        .webp({ quality: 85, effort: 6 })
        .toFile(webpPath);
      console.log(`✓ WebP: ${path.basename(webpPath)}`);
    }

    // 2. Generate optimized original format (for fallback)
    if (!fs.existsSync(optimizedPath) || fs.statSync(optimizedPath).mtime < sourceStat.mtime) {
      if (isPNG) {
        await image
          .clone()
          .rotate() // Disable auto-orientation
          .png({ compressionLevel: 9, quality: 90 })
          .toFile(optimizedPath);
      } else {
        await image
          .clone()
          .rotate() // Disable auto-orientation
          .jpeg({ quality: 85, mozjpeg: true })
          .toFile(optimizedPath);
      }
      console.log(`✓ Optimized: ${path.basename(optimizedPath)}`);
    }
  } catch (error) {
    console.error(`Error optimizing ${sourcePath}:`, error);
  }
}

async function processCategory(categoryFolder: string): Promise<void> {
  const categoryPath = path.join(rootDir, 'public', categoryFolder);
  
  if (!fs.existsSync(categoryPath)) {
    console.log(`Skipping ${categoryFolder} - folder not found in public/`);
    return;
  }

  const files = fs.readdirSync(categoryPath);
  // Process all images (including _001, _002 variants)
  const imageFiles = files.filter(file => 
    /\.(png|jpg|jpeg)$/i.test(file)
  );

  console.log(`\nProcessing ${categoryFolder} (${imageFiles.length} images)...`);

  const promises = imageFiles.map(async (imageFile) => {
    const sourcePath = path.join(categoryPath, imageFile);
    const baseName = path.basename(imageFile, path.extname(imageFile));
    
    // Create optimized versions in subdirectories
    const webpPath = path.join(categoryPath, 'webp', `${baseName}.webp`);
    const optimizedPath = path.join(categoryPath, 'optimized', imageFile);

    await optimizeImage(sourcePath, webpPath, optimizedPath);
  });

  await Promise.all(promises);
}

async function main() {
  console.log('Starting image optimization...\n');
  console.log('This will:');
  console.log('  1. Convert images to WebP (smaller file sizes)');
  console.log('  2. Create optimized PNG/JPG versions (compressed)\n');

  const publicDir = path.join(rootDir, 'public');
  const categories = findCategoryFolders(publicDir);
  
  if (categories.length === 0) {
    console.log('No category folders found in public/ directory.');
    return;
  }

  for (const category of categories) {
    await processCategory(category);
  }

  console.log('\n✓ Image optimization complete!');
  console.log('\nNext steps:');
  console.log('  1. Update components to use WebP with fallback');
  console.log('  2. Consider setting up a CDN (Cloudflare recommended)');
}

main().catch(console.error);
