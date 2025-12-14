# 📋 Step-by-Step: Adding Environment Variables in Vercel

## When Deploying a New Project:

### Step 1: After clicking "Import" repository
You'll see the "Configure Project" page with these sections:
- Project Name
- Framework Preset
- Root Directory
- Build and Output Settings
- **Environment Variables** ← Look for this section!

### Step 2: Find "Environment Variables" section
- Scroll down on the Configure Project page
- You'll see a section titled **"Environment Variables"**
- There's a button/link that says **"Add"** or shows an input field

### Step 3: Add each variable
1. Click **"Add"** or click in the input field
2. A form appears with:
   - **Key/Name field** (on the left)
   - **Value field** (on the right)
3. Enter the variable name in the **Key** field (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
4. Enter the value in the **Value** field (copy from your `.env.local`)
5. Click **"Add"** or **"Save"** to add that variable
6. Repeat for all 6 variables

### Step 4: Verify all variables are added
You should see a list showing all 6 variables before clicking "Deploy"

## If You've Already Deployed:

1. Go to your project dashboard on Vercel
2. Click on your project name
3. Go to **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)
5. Click **"Add New"** button
6. Enter Key and Value
7. Select environment (Production, Preview, Development)
8. Click **"Save"**
9. Redeploy your project after adding variables

## Quick Visual Guide:

```
┌─────────────────────────────────────┐
│  Configure Project                  │
├─────────────────────────────────────┤
│  Project Name: [star-court-mall]    │
│  Framework: Next.js                 │
│  Root Directory: ./                 │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Environment Variables         │ │
│  ├───────────────────────────────┤ │
│  │                               │ │
│  │ [Key]          [Value] [Add]  │ │
│  │                               │ │
│  │ NEXT_PUBLIC_...  xxxxx   [×]  │ │
│  │ NEXT_PUBLIC_...  yyyyy   [×]  │ │
│  │                               │ │
│  │ [+ Add Another]               │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Cancel]              [Deploy]    │
└─────────────────────────────────────┘
```

**Important:** Add all 6 variables BEFORE clicking "Deploy"!

