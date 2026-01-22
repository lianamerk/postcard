import * as fs from 'fs';
import * as path from 'path';

interface Postcard {
  id: string;
  front: string;
  back: string;
  name: string;
}

interface Category {
  name: string;
  folder: string;
  postcards: Postcard[];
}

interface Metadata {
  categories: Category[];
  totalPostcards: number;
  generatedAt: string;
}

function findCategoryFolders(rootDir: string): string[] {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  // Exclude known non-category folders
  const excludeFolders = ['node_modules', '.git', 'dist', '.astro', 'public', 'src', '.github', '260113'];
  return entries
    .filter(entry => {
      if (!entry.isDirectory()) return false;
      // Exclude hidden folders (starting with .) and known system folders
      if (entry.name.startsWith('.')) return false;
      if (excludeFolders.includes(entry.name)) return false;
      return true;
    })
    .map(entry => entry.name)
    .sort();
}

function findPostcardPairs(categoryPath: string): Postcard[] {
  const files = fs.readdirSync(categoryPath);
  const postcards: Postcard[] = [];

  // Group files by base name
  const fileMap = new Map<string, { front?: string; back?: string }>();

  for (const file of files) {
    if (!file.match(/\.(png|jpg|jpeg|webp)$/i)) continue;

    // Skip _001, _002, _003 etc. - these are not front images
    if (file.match(/_\d{3}\.(png|jpg|jpeg|webp)$/i)) {
      // This is a numbered variant (_001, _002, etc.)
      if (file.endsWith('_001.png') || file.endsWith('_001.jpg') || file.endsWith('_001.jpeg') || file.endsWith('_001.webp')) {
        // This is a back image (_001)
        const baseName = file.replace(/_001\.(png|jpg|jpeg|webp)$/i, '');
        if (!fileMap.has(baseName)) {
          fileMap.set(baseName, {});
        }
        fileMap.get(baseName)!.back = file;
      }
      // _002, _003 etc. are ignored (used for special effects like Hold-to-light hover)
    } else {
      // This is a front image (base name, no suffix)
      const ext = path.extname(file);
      const baseName = file.replace(ext, '');
      if (!fileMap.has(baseName)) {
        fileMap.set(baseName, {});
      }
      fileMap.get(baseName)!.front = file;
    }
  }

  // Create postcard entries
  for (const [baseName, images] of fileMap.entries()) {
    if (images.front) {
      // Clean the name: remove _001, _002 suffixes for display
      // The baseName might already have _002 if that's the front image
      let displayName = baseName;
      // Remove _001, _002, _003 etc. suffixes
      displayName = displayName.replace(/_\d{3}$/, '');
      
      const postcard: Postcard = {
        id: `${path.basename(categoryPath)}-${baseName}`,
        front: images.front,
        back: images.back || images.front, // Fallback to front if no back
        name: displayName,
      };
      postcards.push(postcard);
    }
  }

  return postcards.sort((a, b) => a.name.localeCompare(b.name));
}

function generateMetadata(rootDir: string): Metadata {
  const categoryFolders = findCategoryFolders(rootDir);
  const categories: Category[] = [];
  let totalPostcards = 0;

  for (const folder of categoryFolders) {
    const categoryPath = path.join(rootDir, folder);
    const postcards = findPostcardPairs(categoryPath);

    if (postcards.length > 0) {
      // Replace underscores with spaces in display name, but keep folder name as-is
      const displayName = folder.replace(/_/g, ' ');
      categories.push({
        name: displayName,
        folder: folder,
        postcards,
      });
      totalPostcards += postcards.length;
    }
  }

  return {
    categories,
    totalPostcards,
    generatedAt: new Date().toISOString(),
  };
}

// Main execution
const rootDir = process.cwd();
const metadata = generateMetadata(rootDir);
const outputPath = path.join(rootDir, 'src/data/metadata.json');

// Ensure data directory exists
const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
console.log(`Generated metadata for ${metadata.categories.length} categories with ${metadata.totalPostcards} postcards`);
console.log(`Metadata written to ${outputPath}`);
