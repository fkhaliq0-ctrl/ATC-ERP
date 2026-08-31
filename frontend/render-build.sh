#!/bin/bash
echo "=== Starting custom build ==="
echo "Deleting old build cache..."
rm -rf node_modules/.vite
rm -rf dist
echo "Installing dependencies..."
npm install
echo "Building app..."
npm run build
echo "=== Build complete ==="
ls -la dist/