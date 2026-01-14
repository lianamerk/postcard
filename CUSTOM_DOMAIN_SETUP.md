# Setting Up Custom Domain for GitHub Pages

## Step 1: Add Your Domain to the CNAME File

1. Edit `public/CNAME` and replace the placeholder with your actual domain
   - For example: `postcards.com` or `www.postcards.com`
   - **Important**: Use only ONE domain (either with or without www, not both)

2. The CNAME file will be automatically included in your build

## Step 2: Configure DNS Settings

Go to your domain registrar (where you bought the domain) and add DNS records:

### Option A: Using Apex Domain (e.g., postcards.com - no www)

Add these A records (all pointing to GitHub Pages IPs):
```
Type: A
Name: @ (or leave blank)
Value: 185.199.108.153
TTL: 3600 (or default)

Type: A
Name: @ (or leave blank)
Value: 185.199.109.153
TTL: 3600

Type: A
Name: @ (or leave blank)
Value: 185.199.110.153
TTL: 3600

Type: A
Name: @ (or leave blank)
Value: 185.199.111.153
TTL: 3600
```

### Option B: Using www Subdomain (e.g., www.postcards.com)

Add a CNAME record:
```
Type: CNAME
Name: www
Value: lianamerk.github.io
TTL: 3600 (or default)
```

### Option C: Using Both (Redirect www to apex)

1. Set up the apex domain (Option A) as your primary
2. Add a CNAME for www pointing to your apex domain
3. Or use your registrar's redirect feature

## Step 3: Update Astro Config

After you tell me your domain, I'll update `astro.config.mjs` to use it.

## Step 4: Configure in GitHub

1. Go to your repository: https://github.com/lianamerk/postcard
2. Click **Settings** → **Pages**
3. Under "Custom domain", enter your domain (e.g., `postcards.com`)
4. Check "Enforce HTTPS" (recommended)
5. Click **Save**

## Step 5: Wait for DNS Propagation

- DNS changes can take 24-48 hours to propagate
- You can check status at: https://www.whatsmydns.net/
- GitHub will show a green checkmark when DNS is configured correctly

## Step 6: Update Base Path (if needed)

If you're using a custom domain, you might want to remove the `/postcard` base path. Let me know and I'll update the config!

## Troubleshooting

- If the site doesn't load: Check DNS propagation status
- If you see a GitHub 404: Make sure the CNAME file is in `public/` and committed
- If HTTPS doesn't work: Wait for DNS to fully propagate, then enable "Enforce HTTPS"
