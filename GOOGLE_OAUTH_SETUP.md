# Google OAuth Setup Fix

## Current Issue
Google OAuth is failing because the Replit callback URL is not authorized in Google Cloud Console.

## Quick Fix

### Step 1: Verify yappyy.com Callback URL is Configured
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find and click on OAuth 2.0 Client ID: `372720245891-dtpkbj63rl2hju5vo2uorldivgurg6fh.apps.googleusercontent.com`
3. In the **Authorized redirect URIs** section, ensure this URL is present:
   ```
   https://yappyy.com/oauth2callback
   ```
4. If it's missing, click **"Add URI"** and add it
5. Click **Save**

**Note:** OAuth will always redirect to `https://yappyy.com/oauth2callback` regardless of whether users access via Replit domain or yappyy.com.

**Note:** OAuth will now use the same domain for both initiation and callback, preventing Client ID mismatches.

### Step 2: Test Authentication
1. After saving, wait 5-10 seconds for Google to propagate changes
2. Try signing in with Google again
3. You should be redirected to the dashboard after successful authentication

## Current Configuration Status
- ✅ Google Client ID: Configured
- ✅ Google Client Secret: Configured  
- ✅ OAuth Strategy: Properly configured
- ✅ Callback Route: `/oauth2callback` → redirects to `/dashboard`
- ✅ **Authorized Redirect URI: Using yappyy.com domain**

## Authorized URLs Already in Console
Based on your screenshot:
- ✅ `https://yappyy.com` (JavaScript origin)
- ✅ `https://yappyy.com/oauth2callback` (Redirect URI)
- ✅ **yappyy.com redirect URI: Already configured**

## After Adding the URL
The auth flow will work as follows:
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth
3. Google redirects back to `/oauth2callback` 
4. Server processes authentication
5. User redirected to `/dashboard`

## Notes
- The Replit domain changes when the container restarts, so you may need to update it occasionally
- For production, ensure `yappyy.com` URLs are properly configured
- Current session expires in 7 days