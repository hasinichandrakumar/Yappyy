#!/bin/bash

# Replit-Cursor Sync Script
# This script helps sync your local Cursor development with your Replit workspace

echo "🔄 Replit-Cursor Sync Tool"
echo "=========================="

# Configuration
REPLIT_HOST="0c7fe059-a7da-4a46-a7cc-18655fec2a24@0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev"
REPLIT_PORT="22"
SSH_KEY="~/.ssh/replit"
LOCAL_DIR="."
REMOTE_DIR="/home/runner/workspace"

# Function to sync from local to Replit
sync_to_replit() {
    echo "📤 Syncing local changes to Replit..."
    rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' \
        -e "ssh -i $SSH_KEY -p $REPLIT_PORT" \
        "$LOCAL_DIR/" "$REPLIT_HOST:$REMOTE_DIR/"
    echo "✅ Sync to Replit completed!"
}

# Function to sync from Replit to local
sync_from_replit() {
    echo "📥 Syncing changes from Replit to local..."
    rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' \
        -e "ssh -i $SSH_KEY -p $REPLIT_PORT" \
        "$REPLIT_HOST:$REMOTE_DIR/" "$LOCAL_DIR/"
    echo "✅ Sync from Replit completed!"
}

# Function to watch for changes and auto-sync
watch_and_sync() {
    echo "👀 Watching for changes and auto-syncing..."
    echo "Press Ctrl+C to stop watching"
    
    # Use inotifywait if available, otherwise use fswatch
    if command -v inotifywait &> /dev/null; then
        inotifywait -m -r -e modify,create,delete,move "$LOCAL_DIR" --exclude 'node_modules|.git|dist' | while read path action file; do
            echo "🔄 Change detected: $action $path$file"
            sync_to_replit
        done
    elif command -v fswatch &> /dev/null; then
        fswatch -o "$LOCAL_DIR" --exclude 'node_modules|.git|dist' | while read f; do
            echo "🔄 Change detected, syncing..."
            sync_to_replit
        done
    else
        echo "❌ No file watcher found. Install inotify-tools or fswatch for auto-sync."
        echo "Manual sync commands:"
        echo "  ./sync-replit.sh to-replit    # Sync local → Replit"
        echo "  ./sync-replit.sh from-replit  # Sync Replit → local"
    fi
}

# Main script logic
case "$1" in
    "to-replit")
        sync_to_replit
        ;;
    "from-replit")
        sync_from_replit
        ;;
    "watch")
        watch_and_sync
        ;;
    *)
        echo "Usage: $0 {to-replit|from-replit|watch}"
        echo ""
        echo "Commands:"
        echo "  to-replit    - Sync local changes to Replit"
        echo "  from-replit  - Sync Replit changes to local"
        echo "  watch        - Watch for changes and auto-sync"
        echo ""
        echo "Example:"
        echo "  ./sync-replit.sh to-replit"
        echo "  ./sync-replit.sh watch"
        ;;
esac 