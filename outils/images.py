"""Prépare les images du site à partir des originaux déposés dans images/.

Pour chaque fichier images/<nom>.jpg, crée :
  images/m/<nom>.jpg          640 px de large (secours pour les vieux navigateurs)
  images/w/<nom>-400.webp     400 px  (vignettes sur téléphone)
  images/w/<nom>-640.webp     640 px
  images/w/<nom>-1000.webp    1000 px (visionneuse, grands écrans)

Usage : python3 outils/images.py          (ne refait que ce qui manque)
        python3 outils/images.py --force  (refait tout)
Nécessite Pillow : pip install pillow
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent / "images"
FORCE = "--force" in sys.argv
WIDTHS = (400, 640, 1000)

def resized(im, w):
    if im.width <= w:
        return im
    return im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)

made = 0
for src in sorted(ROOT.glob("*.jpg")):
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    jpg = ROOT / "m" / src.name
    if FORCE or not jpg.exists():
        jpg.parent.mkdir(exist_ok=True)
        resized(im, 640).save(jpg, quality=82, optimize=True, progressive=True)
        made += 1
    for w in WIDTHS:
        out = ROOT / "w" / f"{src.stem}-{w}.webp"
        if FORCE or not out.exists():
            out.parent.mkdir(exist_ok=True)
            resized(im, w).save(out, "WEBP", quality=80, method=6)
            made += 1
print(f"{made} fichier(s) créé(s)")
