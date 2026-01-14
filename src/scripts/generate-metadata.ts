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

    if (file.endsWith('_001.png') || file.endsWith('_001.jpg') || file.endsWith('_001.jpeg') || file.endsWith('_001.webp')) {
      // This is a back image
      const baseName = file.replace(/_001\.(png|jpg|jpeg|webp)$/i, '');
      if (!fileMap.has(baseName)) {
        fileMap.set(baseName, {});
      }
      fileMap.get(baseName)!.back = file;
    } else {
      // This might be a front image
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
      const postcard: Postcard = {
        id: `${path.basename(categoryPath)}-${baseName}`,
        front: images.front,
        back: images.back || images.front, // Fallback to front if no back
        name: baseName,
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
      categories.push({
        name: folder,
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
