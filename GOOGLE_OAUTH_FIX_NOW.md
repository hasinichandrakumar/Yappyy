# URGENT: Fix Google OAuth Sign-In

## Current Issue
The Google OAuth sign-in is failing with "Unauthorized" error. This happens when the callback URL doesn't match what's configured in Google Cloud Console.

## Your Current Replit Domain
```
https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev
```

## Required Actions

### 1. Go to Google Cloud Console
1. Open https://console.cloud.google.com/
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Find your OAuth 2.0 Client ID (starting with `372720245891-dtpkbj63rl2hju5vo...`)
5. Click on it to edit

### 2. Add These Authorized Redirect URIs
Add ALL of these URLs to the "Authorized redirect URIs" section:

```
https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev/auth/google/callback
https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev/api/auth/google/callback
https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev/oauth2callback
```

### 3. Add Authorized JavaScript Origins
Also add this to "Authorized JavaScript origins":
```
https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev
```

### 4. Save Changes
Click "Save" at the bottom of the page.

### 5. Wait & Test
- Wait 1-2 minutes for changes to propagate
- Try signing in again

## Alternative: Create New OAuth Credentials
If updating doesn't work, you can create new OAuth credentials:

1. In Google Cloud Console → APIs & Services → Credentials
2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
3. Choose "Web application"
4. Add the URLs above
5. Copy the new Client ID and Client Secret
6. Update them in Replit Secrets:
   - GOOGLE_CLIENT_ID = [new client id]
   - GOOGLE_CLIENT_SECRET = [new client secret]

## Testing
After updating, test the OAuth flow:
1. Go to your app
2. Click "Sign in with Google"
3. It should now work!

## Note
Every time your Replit domain changes, you'll need to update these URLs in Google Cloud Console.