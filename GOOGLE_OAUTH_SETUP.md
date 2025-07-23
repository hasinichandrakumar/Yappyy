# 🚨 Google OAuth Setup Instructions

## Current Error: "redirect_uri_mismatch"

The Google sign-in is failing because the redirect URI is not configured in your Google Cloud Console.

## Required Configuration

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### Step 2: Navigate to Credentials
- Click on "APIs & Services" → "Credentials"
- Find your OAuth 2.0 Client ID and click "Edit"

### Step 3: Add These EXACT URLs

**Authorized JavaScript Origins:**
```
https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev
```

**Authorized Redirect URIs:**
```
https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev/api/auth/google/callback
```

### Step 4: Save and Wait
- Click "Save"
- Wait 5-10 minutes for Google's servers to propagate the changes

## Temporary Solution

While you're setting up Google OAuth, you can use the **"Demo Access"** button to test the application with a demo account.

## Verification

After adding the redirect URIs:
1. Wait 5-10 minutes
2. Try the "Sign in with Google" button again
3. You should be redirected to Google's consent screen
4. After authorization, you'll be redirected back to the dashboard

## Troubleshooting

- Double-check for typos in the URLs
- Ensure you're using HTTPS (not HTTP)
- Make sure there are no trailing slashes
- Wait the full propagation time (5-10 minutes)

## Current Domain
Your current Replit domain is: `0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev`

If this domain changes when you restart Replit, you'll need to update the Google Cloud Console again.