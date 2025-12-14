# Firebase Setup Checklist for Star Court Mall

## Required Services (All available on Spark/Free plan ✅)

Your app needs **2 Firebase services**:

### 1. ✅ Firestore Database
**Status:** ENABLED ✅
**Purpose:** Store users, matches, bets, transactions, withdrawal requests, admin settings

**To enable:**
- Visit: https://console.firebase.google.com/project/star-court-mall/firestore
- Click "Create database"
- Choose "Start in production mode" (we'll deploy security rules after)
- Select location: **us-central1** (recommended) or your preferred region
- Click "Enable"

**Collections needed:**
- `users` - User accounts with balance, role, etc.
- `matches` - Fortnite matches
- `objectives` - Betting objectives for matches
- `bets` - User bets
- `transactions` - Deposit/withdrawal transactions
- `withdrawalRequests` - Withdrawal requests
- `adminSettings` - Admin configuration (Bitcoin address, etc.)

### 2. ✅ Authentication (Email/Password)
**Status:** ENABLED ✅
**Purpose:** User login and signup

**To enable:**
- Visit: https://console.firebase.google.com/project/star-court-mall/authentication
- Click "Get started" (if not already enabled)
- Go to "Sign-in method" tab
- Click "Email/Password"
- Enable it and click "Save"

## Deployment Steps

### Step 1: Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

**Status:** ✅ **DEPLOYED** - Security rules are now active in production!

### Step 2: Verify Environment Variables
Check that `.env.local` contains:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Spark Plan Limits (Free Tier)

✅ **What you get:**
- Firestore: 1 GB storage, 50K reads/day, 20K writes/day, 20K deletes/day
- Authentication: Unlimited users
- Hosting: 10 GB storage, 360 MB/day transfer

✅ **Your app should work fine within these limits** for development and small-scale use.

## Quick Verification Commands

```bash
# Check Firebase project
firebase projects:list

# Check current project
firebase use

# Test deploy rules (dry run)
firebase deploy --only firestore:rules --dry-run

# Deploy rules
firebase deploy --only firestore:rules
```

## Next Steps After Setup

1. **Deploy Firestore Rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Start the app:**
   ```bash
   npm run dev
   ```

3. **Create admin user:**
   - Sign up at http://localhost:3000/login
   - Go to Firebase Console → Firestore → `users` collection
   - Find your user document
   - Add field: `role` = `"admin"` (string)

4. **Configure Bitcoin address:**
   - Login as admin
   - Go to `/fortnite-betting/admin`
   - Settings tab → Enter Bitcoin deposit address

## Current Project Info

- **Project ID:** `star-court-mall`
- **Project Number:** `416911984118`
- **Console:** https://console.firebase.google.com/project/star-court-mall/overview
- **App ID:** `1:416911984118:web:f18ba6c7c263608b7b73d7`

