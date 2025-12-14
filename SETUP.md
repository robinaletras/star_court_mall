# Setup Guide - Star Court Mall

## Quick Start

### 1. Firebase Setup

1. Go to https://console.firebase.google.com
2. Create a new project (or use existing)
3. Enable **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in **production mode** (we'll add security rules)
   - Choose a location

4. Enable **Authentication**:
   - Go to Authentication
   - Click "Get started"
   - Enable "Email/Password" provider

5. Get your Firebase config:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click the web icon (`</>`)
   - Copy the config values

6. Create `.env.local` file in the project root:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 2. Firestore Security Rules

Go to Firestore Database → Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Admins can read all users
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Matches - everyone can read, only admins can write
    match /matches/{matchId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Objectives - everyone can read, only admins can write
    match /objectives/{objectiveId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Bets - users can read their own, create their own
    match /bets/{betId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Transactions - users can read their own, create their own
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Withdrawal requests - users can read their own, create their own
    match /withdrawalRequests/{requestId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Admin settings - only admins
    match /adminSettings/{settingsId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 3. Create Admin User

1. Run the app: `npm run dev`
2. Sign up a new account at `/login`
3. Go to Firebase Console → Firestore Database
4. Find the `users` collection
5. Find your user document (by email or UID)
6. Edit the document and add field: `role` = `"admin"` (string)

### 4. Configure Bitcoin Address

1. Login as admin
2. Go to `/fortnite-betting/admin`
3. Click "SETTINGS" tab
4. Enter your Bitcoin deposit address
5. Save settings

### 5. GitHub Connection

To connect to GitHub:

```bash
# If you haven't already, create a repo on GitHub
# Then run:

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Or if you prefer SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Running the App

```bash
# Install dependencies (if not done)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Admin Workflow

### Managing Deposits:
1. User sends Bitcoin to configured address
2. User submits deposit request with transaction hash
3. Admin goes to Admin Panel → Deposits
4. Admin verifies transaction
5. Admin enters amount and clicks "Approve & Credit"
6. User account is automatically credited

### Managing Withdrawals:
1. User requests withdrawal with Bitcoin address
2. Admin goes to Admin Panel → Withdrawals
3. Admin sends Bitcoin to user's address
4. Admin enters transaction hash and clicks "Approve & Send"
5. User account is automatically debited
6. Request marked as completed

### Creating Matches:
1. Admin goes to Admin Panel → Matches
2. Click "CREATE MATCH"
3. Fill in title, description, Fortnite code, max players
4. Click "MANAGE" on a match to add objectives
5. Add objectives with custom parameters
6. Set match status (upcoming → open → in-progress → completed)

## Notes

- All deposits/withdrawals are manual for security
- Bitcoin addresses are stored in admin settings
- User balances are tracked in Firestore
- Odds are calculated automatically based on objective parameters
- Pot rollover happens automatically if prize not claimed

