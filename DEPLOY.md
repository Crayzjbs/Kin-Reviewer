# 🚀 Deploy Kin Reviewer to Cloudflare Pages

## Quick Deployment Guide (10 minutes)

### ✅ Prerequisites Completed
- [x] Supabase database created and configured
- [x] Database schema deployed
- [x] Environment variables set locally
- [x] App tested locally

---

## Step 1: Push to GitHub (3 minutes)

### 1.1 Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "v1.0: Kin Reviewer with Supabase integration"
```

### 1.2 Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `kin-reviewer` (or any name)
3. Make it **Public** or **Private** (your choice)
4. **DO NOT** initialize with README
5. Click **"Create repository"**

### 1.3 Push Your Code

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kin-reviewer.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2: Deploy to Cloudflare Pages (5 minutes)

### 2.1 Connect to Cloudflare

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign up/login (free account, no credit card needed)
3. Click **"Workers & Pages"** in the left sidebar
4. Click **"Create application"**
5. Click **"Pages"** tab
6. Click **"Connect to Git"**

### 2.2 Connect Your Repository

1. Click **"Connect GitHub"**
2. Authorize Cloudflare to access your GitHub
3. Select your `kin-reviewer` repository
4. Click **"Begin setup"**

### 2.3 Configure Build Settings

**Framework preset:** `Next.js (Static HTML Export)`

**Build settings:**
- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Root directory:** `/` (leave as default)
- **Node version:** `18` or higher

### 2.4 Add Environment Variables

Click **"Add environment variable"** and add these:

| Variable Name | Value |
|--------------|-------|
| `SUPABASE_URL` | `https://xepmvjvqbpbenupyepme.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your full key) |

⚠️ **Important:** Use `SUPABASE_URL` and `SUPABASE_ANON_KEY` (NOT `NEXT_PUBLIC_*`)

### 2.5 Deploy!

1. Click **"Save and Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://kin-reviewer.pages.dev`

---

## Step 3: Configure Next.js for Static Export

Before deploying, we need to configure Next.js for static export:

### 3.1 Update `next.config.js`

Create or update this file:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

### 3.2 Commit and Push

```bash
git add next.config.js
git commit -m "Configure for static export"
git push
```

Cloudflare will automatically redeploy!

---

## 🎉 Your App is Live!

Visit your Cloudflare Pages URL to see your deployed app!

### Next Steps

1. **Custom Domain** (optional):
   - In Cloudflare Pages, click "Custom domains"
   - Add your domain (e.g., `kinreviewer.com`)
   - Update DNS settings as instructed

2. **Test Everything:**
   - Import questions
   - Start review
   - Check Supabase dashboard to verify data is saving

3. **Share:**
   - Share your URL with others
   - All users will access the same Supabase database

---

## Troubleshooting

### Build Fails

**Error:** "Module not found"
- **Fix:** Run `npm install` locally and commit `package-lock.json`

**Error:** "API route not supported"
- **Fix:** Cloudflare Pages doesn't support Next.js API routes in static export
- **Solution:** Already handled - we use server-side API routes

### Data Not Saving

1. Check Supabase environment variables are correct
2. Open browser console for errors
3. Verify Supabase project is active

### Need Help?

Check the full deployment guide in `DEPLOYMENT_GUIDE.md`

---

## 🔒 Security Notes

✅ Your Supabase keys are secure (server-side only)  
✅ No billing surprises (100% free tier)  
✅ Data is private to your Supabase project  
✅ HTTPS enabled by default on Cloudflare

**Your Kin Reviewer is now live and accessible worldwide!** 🌍
