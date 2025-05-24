#!/bin/bash
# tests/heroku.test.sh

echo "Testing Heroku deployment..."

# Check if app is running
curl -s -o /dev/null -w "%{http_code}" https://github-profile-viewer-production.up.railway.app | grep 200 || {
    echo "App not running"
    exit 1
}

# Test health endpoint
curl -s https://github-profile-viewer-production.up.railway.app/health | grep '"status":"OK"' || {
    echo "Health endpoint failed"
    exit 1
}

# Verify environment variables
heroku config:get GITHUB_API_TOKEN || {
    echo "GITHUB_API_TOKEN not set"
    exit 1
}

# Check logs
heroku logs --tail --num 10 | grep "GitHub Profile Viewer running" || {
    echo "Server logs not found"
    exit 1
}

echo "Heroku tests passed!"
