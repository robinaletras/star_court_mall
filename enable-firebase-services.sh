#!/bin/bash

# Script to open Firebase Console pages for enabling services
# Make sure you're signed in to your Google account first!

echo "🔧 Opening Firebase Console pages..."
echo ""
echo "Please make sure you're signed in to your Google account in your browser."
echo ""

# Open Firestore page
echo "📊 Opening Firestore Database page..."
open "https://console.firebase.google.com/project/star-court-mall/firestore"

sleep 2

# Open Authentication page  
echo "🔐 Opening Authentication page..."
open "https://console.firebase.google.com/project/star-court-mall/authentication"

echo ""
echo "✅ Both pages should now be open in your browser."
echo ""
echo "📋 Follow these steps:"
echo ""
echo "1. FIRESTORE DATABASE:"
echo "   - Click 'Create database' button"
echo "   - Select 'Start in production mode'"
echo "   - Choose location: us-central1 (or your preferred region)"
echo "   - Click 'Enable'"
echo ""
echo "2. AUTHENTICATION:"
echo "   - Click 'Get started' button (if shown)"
echo "   - Go to 'Sign-in method' tab"
echo "   - Click 'Email/Password'"
echo "   - Toggle 'Enable' switch"
echo "   - Click 'Save'"
echo ""
echo "3. After both are enabled, run:"
echo "   firebase deploy --only firestore:rules"

