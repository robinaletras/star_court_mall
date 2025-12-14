# Quick Deployment Instructions

## 🚀 Deploy to Vercel (Easiest Method)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy via Vercel Website

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with GitHub
3. **Click "Add New Project"**
4. **Import your repository** (star_court_mall)
5. **Configure Project**:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
6. **Add Environment Variables** (Click "Environment Variables"):
   - `NEXT_PUBLIC_FIREBASE_API_KEY` = (your value)
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = (your value)
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = (your value)
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = (your value)
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = (your value)
   - `NEXT_PUBLIC_FIREBASE_APP_ID` = (your value)
7. **Click "Deploy"**

### Step 3: Wait for Deployment
- Vercel will build and deploy your app
- You'll get a URL like: `https://star-court-mall.vercel.app`
- Future pushes to main branch will auto-deploy

## 🔧 Alternative: Use Vercel CLI (If npm permissions are fixed)

```bash
# Fix npm permissions first (if needed)
sudo chown -R $(whoami) ~/.npm

# Then deploy
npx vercel --prod
```

## ✅ After Deployment

1. **Test your app** at the Vercel URL
2. **Set up custom domain** (optional) in Vercel dashboard
3. **Monitor deployments** in Vercel dashboard

Your app is now live! 🎉

