# Google OAuth Setup Instructions

## Quick Setup for Development

1. **Go to Google Cloud Console:**
   - Visit https://console.cloud.google.com
   - Select your project or create a new one

2. **Configure OAuth Consent Screen:**
   - Go to APIs & Services > OAuth consent screen
   - Choose "External" user type
   - Fill in required fields (App name, User support email, Developer email)

3. **Create OAuth Credentials:**
   - Go to APIs & Services > Credentials
   - Click "+ CREATE CREDENTIALS" > OAuth 2.0 Client IDs
   - Application type: Web application
   - Name: "Yappyy Development"

4. **Add Authorized Redirect URIs:**
   ```
   http://localhost:5000/api/auth/google/callback
   ```

5. **Copy Credentials to Replit Secrets:**
   - Copy Client ID to `GOOGLE_OAUTH_CLIENT_ID` secret
   - Copy Client Secret to `GOOGLE_OAUTH_CLIENT_SECRET` secret

## Current Status
✅ OAuth implementation fixed
✅ Redirect URI handling corrected  
✅ Token exchange improved
⚠️ Need to add callback URL to Google Cloud Console

## Test OAuth
Visit: http://localhost:5000/api/auth/google