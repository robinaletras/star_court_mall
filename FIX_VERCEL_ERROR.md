# 🔧 Fix Vercel Client-Side Error

## Problem
The error "Application error: a client-side exception has occurred" is caused by **missing Firebase environment variables** in Vercel.

## Solution

### Step 1: Add Environment Variables in Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project: **star-court-mall** (or starcourtmall)
3. Go to **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)
5. Add these 6 variables one by one:

   Click **"Add New"** and enter:
   
   **Variable 1:**
   - Key: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Value: (copy from your `.env.local` file)
   - Environment: Production, Preview, Development (select all)
   - Click **"Save"**

   **Variable 2:**
   - Key: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - Value: (copy from your `.env.local` file)
   - Environment: Production, Preview, Development (select all)
   - Click **"Save"**

   **Variable 3:**
   - Key: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - Value: (copy from your `.env.local` file)
   - Environment: Production, Preview, Development (select all)
   - Click **"Save"**

   **Variable 4:**
   - Key: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - Value: (copy from your `.env.local` file)
   - Environment: Production, Preview, Development (select all)
   - Click **"Save"**

   **Variable 5:**
   - Key: `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - Value: (copy from your `.env.local` file)
   - Environment: Production, Preview, Development (select all)
   - Click **"Save"**

   **Variable 6:**
   - Key: `NEXT_PUBLIC_FIREBASE_APP_ID`
   - Value: (copy from your `.env.local` file)
   - Environment: Production, Preview, Development (select all)
   - Click **"Save"**

### Step 2: Redeploy

After adding all variables:

1. Go to **Deployments** tab (top menu)
2. Click the **"..."** (three dots) on the latest deployment
3. Click **"Redeploy"**
4. Make sure **"Use existing Build Cache"** is UNCHECKED (to rebuild with new env vars)
5. Click **"Redeploy"**

### Step 3: Wait and Test

- Wait ~2 minutes for rebuild
- Visit your site: https://starcourtmall.vercel.app/
- The error should be gone!

## To Get Your Environment Variable Values

Run this locally:
```bash
cat .env.local
```

Copy each value for the corresponding variable name.

## Quick Checklist

- [ ] All 6 environment variables added in Vercel
- [ ] All variables set for Production, Preview, and Development
- [ ] Redeployed with new environment variables
- [ ] Site is working without errors

