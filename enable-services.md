# Firebase Services Setup

I've created your Firebase project and configured the app. You need to enable two services manually:

## Quick Setup Links

### 1. Enable Firestore Database
**Click here:** https://console.firebase.google.com/project/star-court-mall/firestore

Steps:
1. Click "Create database"
2. Select "Start in production mode" 
3. Choose location: **us-central1** (or your preferred region)
4. Click "Enable"

### 2. Enable Authentication
**Click here:** https://console.firebase.google.com/project/star-court-mall/authentication

Steps:
1. Click "Get started"
2. Go to "Sign-in method" tab
3. Click on "Email/Password"
4. Enable it and click "Save"

### 3. Deploy Firestore Rules

After enabling Firestore, run:
```bash
firebase deploy --only firestore:rules
```

## What's Already Done ✅

- ✅ Firebase project created: `star-court-mall`
- ✅ Web app created and configured
- ✅ `.env.local` file created with all config values
- ✅ Firestore security rules written
- ✅ Firebase project files initialized (`.firebaserc`, `firebase.json`)

## After Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Create your admin account:
   - Go to http://localhost:3000/login
   - Sign up with email/password
   - Go to Firebase Console → Firestore
   - Find your user document
   - Add field: `role` = `"admin"` (string)

3. Configure Bitcoin address:
   - Login as admin
   - Go to Admin Panel → Settings
   - Enter your Bitcoin deposit address

## Your Firebase Project

- **Project ID:** star-court-mall
- **Console:** https://console.firebase.google.com/project/star-court-mall/overview
- **App ID:** 1:416911984118:web:f18ba6c7c263608b7b73d7

