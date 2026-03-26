#!/bin/bash

echo "======================================"
echo "🚀 Starting Deployment Process..."
echo "======================================"

echo "▶ 1. Resetting local changes and Pulling from Git..."
git fetch origin
git reset --hard origin/main
git clean -fd

echo "▶ 2. Installing Node.js dependencies..."
npm install

echo "▶ 3. Building the Vite/React frontend..."
npm run build

echo "▶ 4. Restarting the PM2 backend server..."
pm2 restart pjpt-server

echo "======================================"
echo "✅ Deployment finished successfully!"
echo "======================================"
