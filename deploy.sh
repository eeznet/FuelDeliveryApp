#!/bin/bash

echo "Starting deployment process..."

# Ensure we're on the main branch
git checkout main

# Add all changes
git add .

# Commit with timestamp
git commit -m "Deploy update: $(date)"

# Push to main
git push origin main

echo "Deployment push complete. Check Render dashboard for build status." 