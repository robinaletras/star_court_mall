# Star Court Mall - Stranger Things Theme Site

A retro 80s-themed web application inspired by the Star Court Mall from Stranger Things, featuring a Fortnite betting arena.

## Features

### Home Page
- Retro 80s aesthetic with neon colors and CRT effects
- Multiple app navigation (currently featuring Fortnite Betting)

### Fortnite Betting App
- **User Features:**
  - View available matches
  - Place bets on match objectives
  - Deposit funds via Bitcoin
  - Request withdrawals
  - Track account balance

- **Admin Features:**
  - Create and manage matches
  - Add betting objectives with custom parameters
  - Set odds (base 100:1 with customizable multipliers)
  - Manage deposits (approve/reject and credit accounts)
  - Manage withdrawal requests (approve/reject and process)
  - Configure Bitcoin deposit address
  - Set betting limits and default odds

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom 80s theme
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **State Management:** React Context API

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Firebase Setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Copy your Firebase configuration
   - Create a `.env.local` file with your Firebase credentials:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

3. **Firestore Security Rules**
   Set up appropriate security rules in Firebase Console. Example:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
       match /matches/{matchId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
       // Add more rules for other collections
     }
   }
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Create Admin User**
   - Sign up a user account
   - In Firebase Console, go to Firestore
   - Find the user document and set `role: 'admin'`

## Project Structure

```
/app
  /fortnite-betting
    /admin          # Admin panel
    /match/[id]     # Match detail page
    page.tsx        # Main betting page
  /login           # Authentication page
  page.tsx         # Home page
/components        # React components
/contexts          # React contexts (Auth)
/lib               # Utilities and Firebase config
/types             # TypeScript type definitions
```

## Key Features Explained

### Betting System
- Base odds: 100:1 (configurable)
- Odds calculation considers:
  - Item count
  - Elimination count
  - Difficulty multiplier
  - Custom parameters

### Deposit/Withdrawal Flow
1. **Deposit:**
   - User sends Bitcoin to admin-configured address
   - User notifies admin with transaction hash
   - Admin verifies and credits account

2. **Withdrawal:**
   - User requests withdrawal with Bitcoin address
   - Admin processes and sends Bitcoin
   - Admin records transaction hash
   - Request marked as completed

### Match Management
- Admin creates matches with Fortnite codes
- Admin adds objectives with custom parameters
- System calculates odds automatically
- Pot rollover if prize not claimed

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Vercel, Netlify, or your preferred hosting platform

3. Ensure environment variables are set in your hosting platform

## Future Enhancements

- Player application system
- Real-time match updates
- Automated Bitcoin transaction monitoring
- More betting apps
- Enhanced 80s animations and effects

## License

Private project - All rights reserved
