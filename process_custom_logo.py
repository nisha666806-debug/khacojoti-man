import os
from PIL import Image

src_img_path = r"C:\Users\HP\.gemini\antigravity\brain\bb8e6513-b4f7-4e1e-88c5-01072cd6403b\.user_uploaded\media_1793375385233_90c2a260.jpg"
public_dir = r"C:\Users\HP\.gemini\antigravity\scratch\khacojoti-man\public"
os.makedirs(public_dir, exist_ok=True)

img = Image.open(src_img_path).convert("RGBA")

# 1. 512x512 standard
icon_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
icon_512.save(os.path.join(public_dir, "pwa-512x512.png"), "PNG")
icon_512.save(os.path.join(public_dir, "logo.png"), "PNG")

# 2. 192x192 standard
icon_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
icon_192.save(os.path.join(public_dir, "pwa-192x192.png"), "PNG")

# 3. Maskable icon: Android requires ~10-15% safe padding around the logo so it doesn't get cropped
maskable_size = 512
maskable_img = Image.new("RGBA", (maskable_size, maskable_size), (11, 15, 25, 255)) # Dark background matching the image
inner_size = int(maskable_size * 0.82)
offset = (maskable_size - inner_size) // 2
resized_inner = img.resize((inner_size, inner_size), Image.Resampling.LANCZOS)
maskable_img.paste(resized_inner, (offset, offset), resized_inner)
maskable_img.save(os.path.join(public_dir, "maskable-icon-512x512.png"), "PNG")

# 4. Apple Touch Icon (180x180)
apple_icon = img.resize((180, 180), Image.Resampling.LANCZOS)
apple_icon.save(os.path.join(public_dir, "apple-touch-icon.png"), "PNG")

# 5. Favicon (64x64) and ICO
favicon = img.resize((64, 64), Image.Resampling.LANCZOS)
favicon.save(os.path.join(public_dir, "favicon.png"), "PNG")
favicon.save(os.path.join(public_dir, "favicon.ico"), format="ICO")

print("All custom logo icons created successfully!")
