# Postcard Gallery

An interactive photo gallery for displaying a collection of postcards, organized by categories.

## Features

- **Category-based organization**: Browse postcards by category folders
- **Interactive hover effect**: Hover over a postcard to see the back
- **Responsive design**: Works on desktop and mobile devices
- **Static site**: Fully static site deployable to GitHub Pages

## Setup

1. Install dependencies:
```bash
npm install
```

2. Generate metadata from your category folders:
```bash
npm run generate-metadata
```

3. Copy category folders to public directory:
```bash
npm run copy-images
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

- `cat1/`, `cat2/`, etc. - Category folders containing postcard images
- `src/pages/` - Astro pages (homepage and category pages)
- `src/components/` - Reusable components (Sidebar, CategoryGallery, PostcardThumbnail)
- `src/scripts/` - Build scripts (metadata generation, image copying)
- `src/data/metadata.json` - Generated metadata (do not edit manually)
- `public/` - Static assets (category folders are copied here during build)

## Image Naming Convention

- Front of postcard: `filename.png` (or `.jpg`, `.jpeg`, `.webp`)
- Back of postcard: `filename_001.png` (or `.jpg`, `.jpeg`, `.webp`)

The metadata generator automatically pairs front and back images based on this naming pattern.

## Building for Production

```bash
npm run build
```

The `prebuild` script will automatically:
1. Generate metadata from category folders
2. Copy category folders to public directory
3. Build the static site

## Deployment to GitHub Pages

1. Update `astro.config.mjs` with your GitHub username:
```javascript
site: 'https://YOUR_USERNAME.github.io',
base: '/postcard', // or '/' if repo name is username.github.io
```

2. Enable GitHub Pages in your repository settings (Settings > Pages)
   - Source: GitHub Actions

3. Push to the `main` or `master` branch - the GitHub Actions workflow will automatically build and deploy.

## Adding New Postcards

1. Add images to the appropriate category folder
2. Follow the naming convention (front: `name.png`, back: `name_001.png`)
3. Run `npm run generate-metadata` to update the metadata
4. Run `npm run copy-images` to copy images to public (or just run `npm run build`)

## Development

- Development server: `npm run dev`
- Preview production build: `npm run preview`
- Generate metadata only: `npm run generate-metadata`
- Copy images only: `npm run copy-images`
