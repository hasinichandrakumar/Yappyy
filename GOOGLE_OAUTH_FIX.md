# Google OAuth Configuration Fix

## Problem
The Google OAuth is failing with "redirect_uri_mismatch" because the callback URL is not registered in the Google Cloud Console.

## Solution Steps

### 1. Your Current Callback URL
Your application is currently running on this Replit domain. You need to register this EXACT callback URL in Google Cloud Console:

**Callback URL to register:**
```
https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev/oauth2callback
```

Copy this exact URL - it must match exactly in Google Cloud Console.

### 2. Update Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one if you don't have one)
3. Navigate to "APIs & Services" → "Credentials"
4. Find your OAuth 2.0 Client ID or create a new one
5. Click "Edit" on your OAuth client
6. In "Authorized redirect URIs", add your callback URL(s):
   - Add your current Replit domain callback URL
   - If you plan to use a custom domain, add that too
   - Format: `https://[domain]/oauth2callback`

### 3. Set Environment Variables
Make sure you have these environment variables set in your Replit project:
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `SESSION_SECRET`: A secure random string for session encryption

### 4. Test the OAuth Flow
1. Restart your application
2. Try signing in with Google
3. The OAuth flow should now work correctly

## Current Configuration
The application is configured to:
- Dynamically detect the current domain
- Use the appropriate callback URL for each request
- Handle both development and production environments
- Provide detailed error logging for troubleshooting

## Troubleshooting
If you still get errors:
1. Check the console logs for the exact callback URL being used
2. Verify the callback URL is correctly registered in Google Cloud Console
3. Ensure there are no typos in the URLs
4. Make sure the Google Cloud project is properly configured