import os
from PIL import Image, ImageDraw, ImageFont

public_dir = r"C:\Users\HP\.gemini\antigravity\scratch\khacojoti-man\public"
os.makedirs(public_dir, exist_ok=True)

def create_icon(size, is_maskable=False):
    # Create image with transparent background (or solid for maskable)
    img = Image.new("RGBA", (size, size), (15, 23, 42, 255) if is_maskable else (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    padding = size * 0.1 if is_maskable else size * 0.05
    box = [padding, padding, size - padding, size - padding]
    corner_radius = size * 0.22
    
    # Draw rounded rectangle with gradient effect
    # Base background: deep slate to cyan/sky blue gradient
    draw.rounded_rectangle(box, radius=corner_radius, fill=(2, 132, 199, 255))
    
    # Draw inner circle / coin or wallet highlight
    center = size / 2
    r = size * 0.28
    draw.ellipse([center - r, center - r, center + r, center + r], fill=(14, 165, 233, 255), outline=(255, 255, 255, 180), width=max(2, int(size * 0.02)))
    
    # Text "ХМ"
    try:
        # Try finding a bold font
        font = ImageFont.truetype("arialbd.ttf", int(size * 0.26))
    except:
        font = ImageFont.load_default()
        
    text = "ХМ"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    tx = (size - tw) / 2
    ty = (size - th) / 2 - (bbox[1])
    
    draw.text((tx, ty), text, font=font, fill=(255, 255, 255, 255))
    return img

# Generate icons
icon_192 = create_icon(192)
icon_192.save(os.path.join(public_dir, "pwa-192x192.png"))

icon_512 = create_icon(512)
icon_512.save(os.path.join(public_dir, "pwa-512x512.png"))

maskable_512 = create_icon(512, is_maskable=True)
maskable_512.save(os.path.join(public_dir, "maskable-icon-512x512.png"))

apple_icon = create_icon(180, is_maskable=True)
apple_icon.save(os.path.join(public_dir, "apple-touch-icon.png"))

favicon = create_icon(64)
favicon.save(os.path.join(public_dir, "favicon.png"))
favicon.save(os.path.join(public_dir, "favicon.ico"))

print("All icons generated successfully in public directory!")
