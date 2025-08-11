# 🔧 Google OAuth Sign-In Fix Required

## Issue
Google OAuth is configured for production domain `yappyy.com/auth/google/callback` but we're running on Replit development domain.

## Solution Options

### Option 1: Add Development Domain to Google Console (Recommended)
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 Client ID for this project
3. Click "Edit" (pencil icon)
4. In "Authorized redirect URIs", **ADD** (don't replace):
   ```
   https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev/auth/google/callback
   ```
5. Keep the existing `https://yappyy.com/auth/google/callback` 
6. Click "Save"
7. Wait 1-2 minutes for changes to propagate

### Option 2: Use Wildcard Pattern
Add this wildcard to support all Replit domains:
```
https://*.picard.replit.dev/auth/google/callback
```

### Option 3: Deploy to yappyy.com
Deploy the application to the production domain where OAuth is already configured.

## Current Configuration
- **Production callback**: `https://yappyy.com/auth/google/callback` ✅ (already configured)
- **Development callback needed**: `https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev/auth/google/callback` ❌ (needs to be added)

## Testing
After updating Google Cloud Console, try signing in again. The OAuth flow should work properly.