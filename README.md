# Postcard Gallery

An interactive photo gallery for displaying a collection of postcards, organized by categories.

## Features

- **Category-based organization**: Browse postcards by category folders
- **Interactive hover effect**: Hover over a postcard to see the back
- **Responsive design**: Works on desktop and mobile devices
- **Image optimization**: Automatic WebP conversion and compression for faster loading
- **Progressive loading**: Images load as you scroll for better performance
- **Static site**: Fully static site deployable to GitHub Pages

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your postcard images to `public/` directory:
   - Create category folders in `public/` (e.g., `public/Paris/`, `public/France/`)
   - Add your postcard images to those folders

3. Generate metadata and optimize images:
```bash
npm run generate-metadata
npm run optimize-images
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

- `public/{category}/` - Category folders containing postcard images (e.g., `public/Paris/`)
  - Original images: `filename.png`
  - Optimized versions: `optimized/filename.png` (compressed)
  - WebP versions: `webp/filename.webp` (smallest, modern format)
  - Thumbnails: `thumbs/filename.webp` (for initial load)
- `src/pages/` - Astro pages (homepage and category pages)
- `src/components/` - Reusable components (Sidebar, CategoryGallery, PostcardThumbnail)
- `src/scripts/` - Build scripts (metadata generation, image optimization)
- `src/data/metadata.json` - Generated metadata (do not edit manually)

## Image Naming Convention

- **Front of postcard**: `filename.png` (e.g., `pc2026-01-14_182605.png`)
- **Back of postcard**: `filename_001.png` (e.g., `pc2026-01-14_182605_001.png`)
- **Hold-to-light hover**: `filename_002.png` (e.g., `pc2026-01-14_182605_002.png`)

The metadata generator automatically pairs front and back images based on this naming pattern. Files with `_001` or `_002` suffixes are excluded from being front images.

## Adding New Categories

1. Create a folder in `public/`:
   ```bash
   mkdir public/New_Category
   ```

2. Add your postcard images to that folder

3. Run the build scripts:
   ```bash
   npm run generate-metadata
   npm run optimize-images
   ```

4. The new category will automatically appear in the gallery!

## Building for Production

```bash
npm run build
```

The `prebuild` script will automatically:
1. Generate metadata from `public/` category folders
2. Optimize images (create WebP, compressed PNG, thumbnails)
3. Build the static site

## Image Optimization

Images are automatically optimized during build:
- **WebP format**: 70-80% smaller than PNG (served to modern browsers)
- **Optimized PNG/JPG**: Compressed versions for fallback
- **Thumbnails**: Small WebP versions for faster initial loads

The website automatically serves the best format each browser supports.

## Deployment to GitHub Pages

1. Update `astro.config.mjs` with your domain:
```javascript
site: 'https://yourdomain.com',
base: '/', // or '/postcard' if using subdirectory
```

2. Enable GitHub Pages in your repository settings (Settings > Pages)
   - Source: GitHub Actions

3. Push to the `main` branch - the GitHub Actions workflow will automatically build and deploy.

## Notes

- All images must be in `public/` directory
- Root category folders (if they exist) are not tracked in git
- Original images are preserved in `public/` - optimized versions are generated automatically
- The site uses progressive loading: first 10 images (5 for Hold-to-light) load immediately, rest load as you scroll

## Development

- Development server: `npm run dev`
- Preview production build: `npm run preview`
- Generate metadata only: `npm run generate-metadata`
- Optimize images only: `npm run optimize-images`
