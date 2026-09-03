const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// ============================================
// LOGGING TO DEBUG THE 404 ERROR
// ============================================

console.log('=== SERVER STARTUP DEBUG ===');
console.log(`Current directory: ${__dirname}`);

const distPath = path.join(__dirname, 'dist');
console.log(`Looking for dist at: ${distPath}`);

// Check if dist folder exists
const distExists = fs.existsSync(distPath);
console.log(`Does dist exist? ${distExists}`);

if (distExists) {
  try {
    const files = fs.readdirSync(distPath);
    console.log(`Files in dist (${files.length}): ${files.join(', ')}`);
    
    // Check for index.html
    const indexPath = path.join(distPath, 'index.html');
    const indexExists = fs.existsSync(indexPath);
    console.log(`Does index.html exist? ${indexExists}`);
  } catch (err) {
    console.log(`Error reading dist: ${err.message}`);
  }
} else {
  console.log('❌ dist folder NOT FOUND!');
  console.log('Checking parent directory contents...');
  
  try {
    const parentFiles = fs.readdirSync(__dirname);
    console.log(`Files in parent (${__dirname}): ${parentFiles.join(', ')}`);
  } catch (err) {
    console.log(`Error reading parent: ${err.message}`);
  }
}

// ============================================
// SERVE STATIC FILES
// ============================================

app.use(express.static(distPath, {
  maxAge: '1h',
  setHeaders: (res, filePath) => {
    // No-cache for HTML to always get fresh version
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (filePath.endsWith('.ico')) {
      res.setHeader('Content-Type', 'image/x-icon');
    } else if (filePath.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff2');
    } else if (filePath.endsWith('.woff')) {
      res.setHeader('Content-Type', 'font/woff');
    } else if (filePath.endsWith('.ttf')) {
      res.setHeader('Content-Type', 'font/ttf');
    }
  }
}));

// ============================================
// CATCH-ALL ROUTE
// ============================================

app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log(`Serving: ${req.url} -> ${indexPath}`);
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.log(`❌ index.html NOT FOUND at ${indexPath}`);
    res.status(404).send(`index.html not found. Checked: ${indexPath}`);
  }
});

// ============================================
// START SERVER
// ============================================

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`=== SERVER RUNNING on port ${port} ===`);
  console.log(`Serving from: ${distPath}`);
});