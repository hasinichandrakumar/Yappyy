#!/bin/bash

# Kill any existing server processes
pkill -f "tsx server/index.ts" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Set correct Google OAuth credentials
export GOOGLE_CLIENT_ID="372720245891-dtpkbj63rl2hju5vo2uorldivgurg6fh.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="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"

echo "🔧 Starting server with correct Google OAuth credentials:"
echo "   Client ID: $GOOGLE_CLIENT_ID"
echo "   Client Secret: ${GOOGLE_CLIENT_SECRET:0:20}..."

# Start the development server
npm run dev
