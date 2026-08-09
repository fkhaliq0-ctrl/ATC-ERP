import os
import re

# Ensure public directory exists
os.makedirs("public", exist_ok=True)

# Generate SVG Logo (Choice A style: Dark Blue, Globe & A motif)
svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="110" fill="url(#bg)" />
  <circle cx="200" cy="190" r="90" fill="none" stroke="#64748b" stroke-width="8" opacity="0.4"/>
  <ellipse cx="200" cy="190" rx="90" ry="35" fill="none" stroke="#64748b" stroke-width="6" opacity="0.4"/>
  <line x1="200" y1="100" x2="200" y2="280" stroke="#64748b" stroke-width="6" opacity="0.4"/>
  <path d="M 170 290 L 260 110 L 320 290" fill="none" stroke="url(#accent)" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 205 230 L 370 170 C 420 150 440 220 360 250" fill="none" stroke="url(#accent)" stroke-width="20" stroke-linecap="round"/>
  <text x="256" y="380" font-family="Arial, sans-serif" font-weight="900" font-size="64" fill="#ffffff" text-anchor="middle" letter-spacing="4">ATC</text>
  <text x="256" y="440" font-family="Arial, sans-serif" font-weight="700" font-size="40" fill="#94a3b8" text-anchor="middle" letter-spacing="6">ERP</text>
</svg>"""

with open("public/logo.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

# Update index.html
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

tag = '<link rel="icon" type="image/svg+xml" href="/logo.svg" />'
if "logo.svg" not in html:
    html = re.sub(r'(<head[^>]*>)', r'\1\n  ' + tag, html, flags=re.IGNORECASE)
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html)

print("Successfully created public/logo.svg and updated index.html!")
