import os
from PIL import Image

source_icon_path = os.path.join("public", "icons", "Z Icon.png")
res_dir = os.path.join("android", "app", "src", "main", "res")

if not os.path.exists(source_icon_path):
    print(f"Error: Source icon not found at {source_icon_path}")
    exit(1)

img = Image.open(source_icon_path).convert("RGBA")

# Mipmap configurations: (folder_name, launcher_size, foreground_size)
configs = [
    ("mipmap-mdpi", 48, 108),
    ("mipmap-hdpi", 72, 162),
    ("mipmap-xhdpi", 96, 216),
    ("mipmap-xxhdpi", 144, 324),
    ("mipmap-xxxhdpi", 192, 432),
]

for folder, launcher_sz, fg_sz in configs:
    target_folder = os.path.join(res_dir, folder)
    os.makedirs(target_folder, exist_ok=True)
    
    # 1. ic_launcher.png
    launcher_img = img.resize((launcher_sz, launcher_sz), Image.Resampling.LANCZOS)
    launcher_img.save(os.path.join(target_folder, "ic_launcher.png"), "PNG")
    
    # 2. ic_launcher_round.png
    launcher_img.save(os.path.join(target_folder, "ic_launcher_round.png"), "PNG")
    
    # 3. ic_launcher_foreground.png
    fg_img = img.resize((fg_sz, fg_sz), Image.Resampling.LANCZOS)
    fg_img.save(os.path.join(target_folder, "ic_launcher_foreground.png"), "PNG")
    
    print(f"Updated {folder} icons successfully.")

print("All Android launcher icons updated with Z Icon!")
