#!/bin/bash

echo "Deploying to Render..."

# Build the project
npm run build

# Run tests
npm test

# If tests pass, deploy
if [ $? -eq 0 ]; then
    git push render main
    echo "Deployment successful!"
else
    echo "Tests failed, deployment aborted"
    exit 1
fi 