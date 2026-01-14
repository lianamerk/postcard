import * as fs from 'fs';
import * as path from 'path';

function copyCategoryFolders(rootDir: string) {
  const publicDir = path.join(rootDir, 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  // Exclude known non-category folders
  const excludeFolders = ['node_modules', '.git', 'dist', '.astro', 'public', 'src', '.github', '260113'];
  const categoryFolders = entries.filter(
    entry => {
      if (!entry.isDirectory()) return false;
      // Exclude hidden folders (starting with .) and known system folders
      if (entry.name.startsWith('.')) return false;
      if (excludeFolders.includes(entry.name)) return false;
      return true;
    }
  );

  for (const folder of categoryFolders) {
    const sourcePath = path.join(rootDir, folder.name);
    const destPath = path.join(publicDir, folder.name);

    // Remove existing destination if it exists
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true });
    }

    // Copy the folder
    fs.cpSync(sourcePath, destPath, { recursive: true });
    console.log(`Copied ${folder.name} to public/`);
  }
}

const rootDir = process.cwd();
copyCategoryFolders(rootDir);
console.log('Image copy complete');
