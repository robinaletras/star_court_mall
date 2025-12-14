# Deployment Guide

Your app is built and ready to deploy! Here are your options:

## ✅ Build Status
- ✅ Build successful
- ✅ All TypeScript errors fixed
- ✅ Ready for deployment
- ✅ Deployment configuration files created

## Option 1: Deploy to Vercel (Recommended for Next.js)

**Vercel is the easiest and best option for Next.js apps with dynamic routes.**

### Via Vercel Website (Easiest):
1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import your repository
5. Vercel will auto-detect Next.js and deploy
6. **Important:** Add all environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
7. Click "Deploy"

### Via Vercel CLI:
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (first time will ask for configuration)
vercel

# Deploy to production
vercel --prod
```

## Option 2: Deploy to Firebase Hosting

**Note:** Firebase Hosting requires Firebase Functions for Next.js dynamic routes. This requires a Blaze (pay-as-you-go) plan.

### Setup Firebase Functions for Next.js:
```bash
# Install Firebase Functions dependencies
npm install firebase-functions firebase-admin

# Note: You'll need to set up a custom server with Firebase Functions
# This is more complex than Vercel deployment
```

### Deploy Firestore Rules Only:
```bash
# Deploy just the Firestore rules (works on free plan)
firebase deploy --only firestore:rules
```

**Recommendation:** Use Vercel for hosting and Firebase only for Firestore/Auth services.

## Option 3: Run Locally (For Testing)

Your app is ready to run locally:

```bash
npm run dev
```

Then visit: http://localhost:3000

## Current Build Output

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /fortnite-betting
├ ○ /fortnite-betting/admin
├ ƒ /fortnite-betting/match/[id]  (Dynamic route)
└ ○ /login
```

## Environment Variables

Make sure these are set in your deployment platform:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Quick Start (Local)

```bash
# Start the development server
npm run dev

# Visit http://localhost:3000
```

Your app will be available at http://localhost:3000

