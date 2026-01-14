# Deployment Instructions

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `postcard` (or any name you prefer)
3. Description: "Interactive postcard gallery"
4. Choose **Public** (required for free GitHub Pages)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Connect and Push

After creating the repo, GitHub will show you commands. Run these in your terminal:

```bash
git remote add origin https://github.com/lianamerk/postcard.git
git branch -M main
git push -u origin main
```

(Replace `postcard` with your actual repository name if different)

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **GitHub Actions** (not "Deploy from a branch")
4. The workflow will automatically deploy when you push to `main`

## Step 4: Update Base Path (if needed)

If your repository name is NOT `postcard`, update `astro.config.mjs`:

```javascript
base: '/your-repo-name',  // Change this to match your repo name
```

Or if you want it at the root of your GitHub Pages site (username.github.io), set:
```javascript
base: '/',
```

Then commit and push:
```bash
git add astro.config.mjs
git commit -m "Update base path"
git push
```

## First Deployment

After pushing, GitHub Actions will:
1. Generate metadata from your category folders
2. Copy images to public directory
3. Build the static site
4. Deploy to GitHub Pages

You can watch the progress in the **Actions** tab of your repository.

Your site will be available at:
- `https://lianamerk.github.io/postcard/` (if repo name is "postcard")
- Or `https://lianamerk.github.io/your-repo-name/`

## Adding More Postcards

1. Add images to your category folders (cat1, cat2, etc.)
2. Follow the naming convention: `filename.png` (front) and `filename_001.png` (back)
3. Commit and push:
   ```bash
   git add cat*/
   git commit -m "Add new postcards"
   git push
   ```
4. The GitHub Actions workflow will automatically rebuild and redeploy
