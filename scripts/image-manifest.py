# Records every photo's real size so pages can reserve the right space (no layout shift).
# Run after adding photos:  python3 scripts/image-manifest.py
import glob, json
from PIL import Image
out = {}
for f in sorted(glob.glob("public/images/**/*.webp", recursive=True)):
    w, h = Image.open(f).size
    out[f.removeprefix("public")] = [w, h]
json.dump(out, open("src/lib/image-manifest.json", "w"), indent=0)
print(len(out), "images")
