# 🚀 Cursor + Replit Setup Guide

## ✅ What's Already Working

Your Replit website is **LIVE** and accessible at:
```
https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev
```

- ✅ Development server running on port 5001
- ✅ SSH connection active
- ✅ Live editing capabilities
- ✅ Hot reload enabled

## 🎯 Three Ways to Edit Your Website

### 1. **Direct SSH Editing (Current Setup)**
You're already connected via SSH and can edit files directly:

```bash
# You're currently in: /home/runner/workspace
# Edit any file and see live changes
nano client/src/pages/home.tsx
# or use any editor you prefer
```

**Pros:** Instant changes, no setup required
**Cons:** Limited IDE features

### 2. **Local Cursor Development (Recommended)**

#### Step 1: Clone to Local Machine
```bash
# In your local Cursor terminal:
git clone <your-github-repo-url> yappyy-project
cd yappyy-project
npm install
```

#### Step 2: Set up Sync Script
Copy the `sync-replit.sh` script to your local machine and configure it.

#### Step 3: Start Development
```bash
npm run dev
# Your local server will run on http://localhost:5001
```

#### Step 4: Sync Changes
```bash
# Sync local changes to Replit
./sync-replit.sh to-replit

# Or watch for changes automatically
./sync-replit.sh watch
```

### 3. **Cursor Remote Development**
Use Cursor's remote development features to connect directly to Replit.

## 🔧 Quick Setup Commands

### For Local Development:
```bash
# 1. Clone your project locally
git clone <your-repo-url> yappyy-local
cd yappyy-local

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in Cursor
cursor .
```

### For Auto-Sync:
```bash
# 1. Copy sync script to local machine
# 2. Make it executable
chmod +x sync-replit.sh

# 3. Start watching for changes
./sync-replit.sh watch
```

## 📁 Project Structure

```
yappyy-project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes/           # API routes
│   └── ...
├── package.json
└── sync-replit.sh        # Sync script
```

## 🎨 Making Changes

### Edit the Home Page:
```bash
# File: client/src/pages/home.tsx
# This is your landing page - edit the hero section
```

### Edit the Dashboard:
```bash
# File: client/src/pages/dashboard.tsx
# Main dashboard for authenticated users
```

### Edit API Routes:
```bash
# File: server/routes/
# Backend API endpoints
```

## 🔄 Live Preview

Your changes are automatically reflected at:
- **Replit URL**: https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev
- **Local URL**: http://localhost:5001 (when running locally)

## 🚨 Troubleshooting

### Server Not Starting:
```bash
# Check if port is in use
lsof -i :5001

# Kill process if needed
kill -9 <PID>
```

### Sync Issues:
```bash
# Check SSH connection
ssh -i ~/.ssh/replit -p 22 0c7fe059-a7da-4a46-a7cc-18655fec2a24@0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev

# Test rsync
rsync -avz --dry-run -e "ssh -i ~/.ssh/replit -p 22" ./ 0c7fe059-a7da-4a46-a7cc-18655fec2a24@0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev:/home/runner/workspace/
```

## 🎉 Next Steps

1. **Choose your preferred method** (SSH, Local, or Remote)
2. **Start editing** your website files
3. **Use the sync script** to keep changes in sync
4. **Deploy changes** when ready

Your website is ready for development! 🚀 