#!/bin/bash

echo "======================================"
echo "🚀 Starting Deployment Process..."
echo "======================================"

echo "▶ 1. Pulling latest changes from Git..."
git pull origin main

echo "▶ 2. Installing Node.js dependencies..."
npm install

echo "▶ 3. Building the Vite/React frontend..."
npm run build

echo "▶ 4. Restarting the PM2 backend server..."
pm2 restart pjpt-server

echo "======================================"
echo "✅ Deployment finished successfully!"
echo "======================================"
