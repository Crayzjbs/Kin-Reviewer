# Cloudflare Pages Deployment Guide

## Build Configuration for Cloudflare Pages Dashboard

When setting up your project in Cloudflare Pages, use these exact settings:

### Framework preset
**Next.js**

### Build settings
- **Build command:** `npm run pages:build`
- **Build output directory:** `.open-next/worker`

### Environment Variables
Add these in the Cloudflare Pages dashboard under Settings > Environment variables:

| Variable Name | Value |
|--------------|-------|
| `SUPABASE_URL` | `https://xepmvjvqbpbenupyepme.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcG12anZxYnBiZW51cHllcG1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MzM4OTksImV4cCI6MjA4ODUwOTg5OX0.LjBVaXIwl9DW7zqjufA_OodgglF8AfY9DBN3VcW1VJE` |

### Root directory
Leave as default: `/`

---

## How It Works

1. **Build Phase:** `npm run pages:build` runs OpenNext to build your Next.js app for Cloudflare Workers
2. **Output:** OpenNext generates a worker script in `.open-next/worker`
3. **Deploy:** Cloudflare Pages automatically deploys the worker

---

## Local Development

```bash
# Run Next.js dev server
npm run dev

# Build and preview with Cloudflare Workers locally
npm run preview
```

---

## Manual Deployment

```bash
# Build and deploy to Cloudflare
npm run deploy
```

---

## Troubleshooting

### Build fails with "Missing entry-point"
- Make sure build command is `npm run pages:build` (not `npm run build`)
- Verify `wrangler.jsonc` exists in project root

### TypeScript errors during build
- Check that `open-next.config.ts` is excluded in `tsconfig.json`

### Environment variables not working
- Ensure variables are set in Cloudflare Pages dashboard
- Variable names must match exactly (case-sensitive)

---

## Files Created for Deployment

- `wrangler.jsonc` - Cloudflare Workers configuration
- `open-next.config.ts` - OpenNext adapter configuration
- `.dev.vars` - Local environment variables (gitignored)
- `public/_headers` - Security headers
- `.npmrc` - npm configuration for peer dependencies

---

## Important Notes

✅ **Do NOT** commit `.dev.vars` to git (already in .gitignore)  
✅ **Do** set environment variables in Cloudflare Pages dashboard  
✅ **Use** `npm run pages:build` as the build command in Cloudflare  
✅ **Set** build output to `.open-next/worker`

Your app will be live at: `https://kin-reviewer.pages.dev`
