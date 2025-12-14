#!/bin/bash

# Script to verify Firebase services are enabled

echo "🔍 Checking Firebase services status..."
echo ""

# Check Firestore
echo "📊 Checking Firestore Database..."
firebase firestore:databases:list 2>&1 | grep -q "default" && echo "✅ Firestore is ENABLED" || echo "❌ Firestore is NOT enabled"

echo ""

# Check if we can deploy rules (indicates Firestore is enabled)
echo "🔐 Checking Authentication..."
echo "   (Note: Authentication status can only be verified in the console)"
echo "   Visit: https://console.firebase.google.com/project/star-court-mall/authentication"
echo ""

# Try to check Firestore rules deployment
echo "📋 Testing Firestore rules compilation..."
firebase deploy --only firestore:rules --dry-run > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Firestore rules compile successfully"
    echo ""
    echo "🚀 Ready to deploy rules! Run:"
    echo "   firebase deploy --only firestore:rules"
else
    echo "⚠️  Firestore rules need attention"
fi

