# 🔧 Google OAuth Sign-In Fix Required

## Issue
Google OAuth sign-in is failing because the callback URL in your Google Cloud Console doesn't match the current Replit development URL.

## Current Callback URL Needed
```
https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev/auth/google/callback
```

## Quick Fix Steps

### Option 1: Update Google Cloud Console (Recommended)
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 Client ID for this project
3. Click "Edit" (pencil icon)
4. In "Authorized redirect URIs", add:
   ```
   https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev/auth/google/callback
   ```
5. Click "Save"
6. Wait 1-2 minutes for changes to propagate
7. Try signing in again

### Option 2: Use Wildcard (If Available)
If your Google OAuth app supports wildcards, you can add:
```
https://*.picard.replit.dev/auth/google/callback
```

## Testing
After updating Google Cloud Console:
1. Refresh the Yappyy app
2. Click "Sign in with Google" 
3. Select your Google account
4. You should be redirected to the dashboard successfully

## Note
The Replit development URL changes each time the container restarts, which is why this callback URL needs to be updated. For production deployment, we'll use a stable domain.

## Debug Info
- Current domain: `0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev`
- Required callback: `/auth/google/callback`
- Full callback URL: `https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev/auth/google/callback`