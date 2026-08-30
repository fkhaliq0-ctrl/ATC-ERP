# Step 1: Copy logo to icons folder
copy E:\ATC-ERP\frontend\public\logo.jpeg E:\ATC-ERP\frontend\public\icons\icon-512x512.png

# Step 2: Create all icon sizes
cd E:\ATC-ERP\frontend\public\icons
copy icon-512x512.png icon-72x72.png
copy icon-512x512.png icon-96x96.png
copy icon-512x512.png icon-128x128.png
copy icon-512x512.png icon-144x144.png
copy icon-512x512.png icon-152x152.png
copy icon-512x512.png icon-192x192.png
copy icon-512x512.png icon-384x384.png

# Step 3: Create manifest.json
@"
{
  "name": "Zebaish Caterers - Agent",
  "short_name": "Zebaish",
  "description": "Send inquiries to customers for Zebaish Caterers",
  "start_url": "/agent/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#1e1e2f",
  "background_color": "#1e1e2f",
  "categories": ["business", "productivity"],
  "icons": [
    { "src": "/icons/icon-72x72.png", "sizes": "72x72", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-96x96.png", "sizes": "96x96", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-128x128.png", "sizes": "128x128", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-144x144.png", "sizes": "144x144", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-152x152.png", "sizes": "152x152", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-384x384.png", "sizes": "384x384", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
"@ | Out-File -FilePath E:\ATC-ERP\frontend\public\manifest.json -Encoding utf8

# Step 4: Update index.html
@"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/icons/icon-72x72.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#1e1e2f" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Zebaish" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="application-name" content="Zebaish" />
    <meta name="description" content="Zebaish Caterers - Agent Inquiry System" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    <title>Zebaish - Agent</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"@ | Out-File -FilePath E:\ATC-ERP\frontend\index.html -Encoding utf8

Write-Host "✅ All PWA files created successfully!" -ForegroundColor Green
