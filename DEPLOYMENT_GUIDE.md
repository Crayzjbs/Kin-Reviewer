# Deployment Guide: Cloudflare Pages + Supabase

This guide will help you deploy your CCNA Anki app to **Cloudflare Pages** with **Supabase** as the database.

## Why Cloudflare + Supabase?

✅ **100% Free** for your use case  
✅ **Fast global CDN** - Cloudflare's edge network  
✅ **Unlimited bandwidth** on Cloudflare Pages  
✅ **PostgreSQL database** with Supabase  
✅ **Real-time capabilities** (for future features)  
✅ **No credit card required**

---

## Step 1: Set Up Supabase (5 minutes)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub (free, no credit card)
4. Click **"New Project"**
5. Fill in:
   - **Name**: `exam-anki` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
6. Click **"Create new project"** (takes ~2 minutes)

### 1.2 Run Database Schema

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy the entire contents of `supabase-setup.sql` from your project
4. Paste it into the SQL editor
5. Click **"Run"** (bottom right)
6. You should see "Success. No rows returned"

### 1.3 Get Your Credentials

1. In Supabase dashboard, click **"Settings"** (gear icon)
2. Click **"API"** in the left menu
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## Step 2: Configure Your App (2 minutes)

### 2.1 Create Environment File

1. In your project root, create a file named `.env.local`
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace with your actual values from Step 1.3

### 2.2 Test Locally

```bash
npm run dev
```

Open http://localhost:3000 and try importing questions. They should now save to Supabase!

---

## Step 3: Deploy to Cloudflare Pages (3 minutes)

### 3.1 Push to GitHub

1. Create a new GitHub repository
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/exam-anki.git
git push -u origin main
```

### 3.2 Deploy on Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign up/login (free, no credit card needed)
3. Click **"Pages"** in the left sidebar
4. Click **"Create a project"**
5. Click **"Connect to Git"**
6. Authorize Cloudflare to access your GitHub
7. Select your `exam-anki` repository
8. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
9. Click **"Environment variables (advanced)"**
10. Add your Supabase credentials:
    - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
11. Click **"Save and Deploy"**

### 3.3 Wait for Deployment

- First deployment takes ~2-3 minutes
- You'll get a URL like: `https://exam-anki.pages.dev`
- Every push to `main` branch auto-deploys!

---

## Step 4: Import Your Questions

1. Go to your deployed app: `https://your-app.pages.dev`
2. Click **"Import"**
3. Enter a topic name (e.g., "CCNA 200-301")
4. Paste your 561 questions JSON
5. Click **"Import Questions"**
6. Questions are now in Supabase - **everyone can access them!**

---

## Features After Deployment

### ✅ What Works

- **Shared question database** - All users see the same 561 questions
- **Individual progress** - Each user's review cards are separate
- **Auto-save** - Everything saves to Supabase automatically
- **Global CDN** - Fast loading worldwide
- **HTTPS** - Secure by default
- **Custom domain** - Add your own domain (optional)

### 🔒 Security Notes

- Questions are **public** (anyone can read)
- Review cards are **user-specific** (using browser fingerprint)
- For true multi-user auth, you can add Supabase Auth later

---

## Costs

| Service | Free Tier | Your Usage | Cost |
|---------|-----------|------------|------|
| **Cloudflare Pages** | Unlimited bandwidth, 500 builds/month | ~10 builds/month | **$0** |
| **Supabase** | 500MB database, 50K users | ~5MB for 561 questions | **$0** |
| **Total** | | | **$0/month** |

---

## Updating Your App

### To deploy changes:

```bash
git add .
git commit -m "Your changes"
git push
```

Cloudflare automatically rebuilds and deploys!

---

## Custom Domain (Optional)

1. In Cloudflare Pages, click your project
2. Go to **"Custom domains"**
3. Click **"Set up a custom domain"**
4. Follow the DNS setup instructions
5. Your app will be at `https://yourdomain.com`

---

## Troubleshooting

### Questions not saving?

- Check Supabase credentials in Cloudflare environment variables
- Check browser console for errors
- Verify SQL schema was run successfully

### Build failing?

- Check build logs in Cloudflare dashboard
- Ensure all dependencies are in `package.json`
- Try building locally first: `npm run build`

### Slow loading?

- Cloudflare Pages uses global CDN - should be fast
- Check Supabase region matches your users
- Enable caching in Supabase settings

---

## Next Steps

### Optional Enhancements:

1. **Add Authentication** - Use Supabase Auth for user accounts
2. **Add Analytics** - Track usage with Cloudflare Analytics
3. **Add More Questions** - Import additional question sets
4. **Custom Branding** - Add your logo and colors
5. **Mobile App** - Wrap in Capacitor for iOS/Android

---

## Support

- **Cloudflare Docs**: https://developers.cloudflare.com/pages
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## Summary

You now have a **free, globally-distributed CCNA study app** that:
- Costs $0/month
- Handles unlimited users
- Auto-saves progress
- Loads fast worldwide
- Requires no server maintenance

**Your app is live at**: `https://your-app.pages.dev` 🎉
