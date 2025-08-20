# 🚨 Replit Secrets Override Issue

## The Problem
The server is still using old Google OAuth credentials because **Replit Secrets are overriding** the environment variables we set.

## 🔧 **IMMEDIATE FIX - Update Replit Secrets**

### Step 1: Open Replit Secrets
1. In your Replit workspace, look for the **🔒 Secrets** tab (usually in the left sidebar)
2. Or go to **Tools → Secrets**

### Step 2: Update These Secrets
Find and update these environment variables:

**GOOGLE_CLIENT_ID**
```
372720245891-dtpkbj63rl2hju5vo2uorldivgurg6fh.apps.googleusercontent.com
```

**GOOGLE_CLIENT_SECRET**  
```
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
```

### Step 3: Remove Old Secrets (if they exist)
If you see these old values, delete them:
- ❌ `865530799156-v77qutagl1q2q7i7g...` (old client ID)
- ❌ `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` (old secret)

### Step 4: Restart
After updating secrets:
1. **Stop** the current server (click Stop button in Replit)
2. **Start** it again (click Run button)

## 🎯 **Alternative: Force Environment Variables**

If you can't access Replit Secrets, I've created a startup script that forces the correct credentials:

```bash
./start-with-correct-env.sh
```

This script will:
- Kill any existing server processes
- Set the correct Google OAuth credentials  
- Start the server with the right environment

## ✅ **How to Verify It's Fixed**

When the server starts, you should see in the logs:
```
🔧 Google OAuth Setup - Client ID: 372720245891-dtpkbj63rl2hju5vo2uorldivgurg6fh...
```

Instead of the old:
```
🔧 Google OAuth Setup - Client ID: 865530799156-v77qutagl1q2q7i7g...
```

## 🚀 **Then Test OAuth**
Once you see the correct Client ID in the logs:
1. Go to your app
2. Click "Sign in with Google"  
3. Should work now with correct credentials + callback URL!

---

**The root cause**: Replit Secrets take precedence over shell environment variables, so we need to update the secrets directly in Replit's interface.
