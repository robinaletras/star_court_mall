#!/bin/bash

# Firebase Configuration for Star Court Mall
# This script creates the .env.local file with your Firebase config

cat > .env.local << 'EOF'
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=star-court-mall.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=star-court-mall
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=star-court-mall.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=416911984118
NEXT_PUBLIC_FIREBASE_APP_ID=1:416911984118:web:f18ba6c7c263608b7b73d7
EOF

echo "⚠️  IMPORTANT: Replace YOUR_API_KEY_HERE with your actual Firebase API Key"
echo "   Get it from: https://console.firebase.google.com/project/star-court-mall/settings/general"
echo ""

echo "✅ Created .env.local file with Firebase configuration"
echo ""
echo "Next steps:"
echo "1. Enable Firestore Database:"
echo "   Visit: https://console.firebase.google.com/project/star-court-mall/firestore"
echo "   Click 'Create database' and choose 'Start in production mode'"
echo ""
echo "2. Enable Authentication:"
echo "   Visit: https://console.firebase.google.com/project/star-court-mall/authentication"
echo "   Click 'Get started' and enable 'Email/Password'"
echo ""
echo "3. Deploy Firestore rules:"
echo "   Run: firebase deploy --only firestore:rules"
echo ""
echo "4. Start the app:"
echo "   Run: npm run dev"

