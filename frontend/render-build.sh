#!/bin/bash
echo "=== Starting custom build ==="
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la

echo "Deleting old build cache..."
rm -rf node_modules/.vite
rm -rf dist

echo "Installing dependencies..."
npm install || { echo "? npm install failed!"; exit 1; }

echo "Building app..."
npm run build || { echo "? npm run build failed!"; exit 1; }

echo "=== Build complete, checking dist ==="
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    echo "? Files found in dist:"
    ls -la dist/
else
    echo "? ERROR: dist folder is empty or missing!"
    echo "Checking if there's a build output in another location..."
    find . -name "index.html" -type f 2>/dev/null | head -10
    exit 1
fi

echo "=== Copying files to expected location ==="
mkdir -p /opt/render/project/src/frontend/dist
cp -r dist/* /opt/render/project/src/frontend/dist/
echo "=== Copy complete ==="
ls -la /opt/render/project/src/frontend/dist/