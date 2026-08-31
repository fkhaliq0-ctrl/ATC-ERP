#!/bin/bash
echo "=== Starting custom build ==="
echo "Deleting EVERYTHING (node_modules, .vite, dist)..."
rm -rf node_modules
rm -rf .vite
rm -rf dist
echo "Installing dependencies (fresh)..."
npm install
echo "Building app..."
npm run build
echo "=== Build complete, checking dist ==="
ls -la dist/
echo "=== Copying files to expected location ==="
mkdir -p /opt/render/project/src/frontend/dist
cp -r dist/* /opt/render/project/src/frontend/dist/
echo "=== Copy complete ==="
ls -la /opt/render/project/src/frontend/dist/