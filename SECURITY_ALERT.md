# 🔒 Security Alert: Exposed API Key

## What Happened
The Firebase API key was exposed in the `setup-firebase.sh` file in the Git repository.

## Action Taken
✅ Removed the exposed API key from the file
✅ Replaced it with a placeholder

## ⚠️ CRITICAL: Regenerate Your Firebase API Key

The exposed key needs to be **regenerated** in Firebase Console:

### Steps to Regenerate:

1. **Go to Firebase Console:**
   https://console.firebase.google.com/project/star-court-mall/settings/general

2. **Scroll down to "Your apps" section**

3. **Click on your Web app (or create a new one)**

4. **In the config, you'll see the API key** - but we need to restrict/regenerate it

5. **To regenerate:**
   - Go to **Google Cloud Console**: https://console.cloud.google.com/apis/credentials?project=star-court-mall
   - Find the API key (starts with `AIza...`)
   - Click on it
   - Click **"Restrict key"** and set appropriate restrictions (HTTP referrers)
   - OR click **"Regenerate key"** to create a new one
   - **Copy the new key**

6. **Update your environment:**
   - Update `.env.local` with the new API key
   - Update Vercel environment variables with the new API key
   - Update any other deployment environments

## Note About Git History

The old key still exists in Git history. If this is a concern:
- Consider using `git filter-branch` or BFG Repo-Cleaner to remove it from history
- Or create a new Firebase project and migrate data

## Going Forward

✅ `.env.local` is already in `.gitignore` - it will NOT be committed
✅ `setup-firebase.sh` now uses placeholders instead of real keys
✅ Always use environment variables, never hardcode secrets

