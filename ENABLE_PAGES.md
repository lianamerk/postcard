# Enable GitHub Pages

The deployment is failing because GitHub Pages needs to be enabled first. Follow these steps:

## Step 1: Enable GitHub Pages

1. Go to your repository: https://github.com/lianamerk/postcard
2. Click on **Settings** (top menu bar)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions** (NOT "Deploy from a branch")
5. Click **Save**

## Step 2: Re-run the Workflow

After enabling Pages:

1. Go to the **Actions** tab in your repository
2. Find the failed workflow run
3. Click on it, then click **Re-run all jobs** (or **Re-run failed jobs**)

Alternatively, you can trigger a new run by:
- Making a small change and pushing, OR
- Going to Actions → Your workflow → **Run workflow** button

## Important Notes

- The **Source** must be set to **GitHub Actions**, not "Deploy from a branch"
- It may take a few minutes for the first deployment to complete
- Your site will be available at: `https://lianamerk.github.io/postcard/`

Once Pages is enabled and the workflow completes successfully, your site will be live!
