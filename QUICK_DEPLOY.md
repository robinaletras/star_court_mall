# 🚀 Quick Deploy to Vercel

Your code is on GitHub: **https://github.com/robinaletras/star_court_mall**

## Deploy Now (2 minutes):

1. **Click this link**: https://vercel.com/new?import-url=https://github.com/robinaletras/star_court_mall

2. **Sign in** with GitHub (if not already)

3. **Configure Project**:
   - Project Name: `star-court-mall` (or leave default)
   - Framework: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables** (Click "Environment Variables" section):
   
   Copy these from your `.env.local` file:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_value_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value_here
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value_here
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_value_here
   ```

5. **Click "Deploy"**

6. **Wait ~2 minutes** for build to complete

7. **Your app will be live!** 🎉
   - You'll get a URL like: `https://star-court-mall.vercel.app`
   - Future pushes to GitHub will auto-deploy

## Need Help?

- Vercel will auto-detect Next.js settings
- All your code is already on GitHub
- Just add the environment variables and click Deploy!

