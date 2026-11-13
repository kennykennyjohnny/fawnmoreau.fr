"""Génère les deux textures de lavis (aquarelle) utilisées par la transition entre les parties du site.

  images/lavis-clair.webp  lavis sépia très léger sur papier crème
  images/lavis-nuit.webp   lavis bleu nuit, comme le fond de ses toiles

Usage : python3 outils/lavis.py   (nécessite numpy, scipy, pillow)
"""
from pathlib import Path
import numpy as np
from scipy.ndimage import gaussian_filter
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "images"
N = 900
rng = np.random.default_rng(7)

def field(sigma):
    f = gaussian_filter(rng.random((N, N)), sigma, mode="wrap")
    return (f - f.min()) / (f.max() - f.min())

# plusieurs couches de lavis superposées, comme des glacis : chaque couche est une flaque
# aux contours irréguliers, plus foncée sur son bord (le pigment s'y accumule en séchant)
grain = field(1.2)
def warp(f, amp):
    wx, wy = field(40) - 0.5, field(40) - 0.5
    y, x = np.mgrid[0:N, 0:N]
    return f[(y + (wy * amp).astype(int)) % N, (x + (wx * amp).astype(int)) % N]

layers = []
for sigma, t, amp in ((110, 0.55, 140), (55, 0.60, 90), (30, 0.62, 60)):
    b = warp(field(sigma), amp)
    inside = 1 / (1 + np.exp(-(b - t) / 0.02))
    rim = np.exp(-((b - t) / 0.008) ** 2) * (0.5 + 0.5 * field(12))
    fill = inside * (0.55 + 0.45 * field(18))
    layers.append((fill, gaussian_filter(rim, 0.8)))
density = sum(f for f, _ in layers) / len(layers)
edge = np.clip(sum(r for _, r in layers), 0, 1)

def paint(base, pigment, amount, edge_amount, name):
    a = np.clip(amount * density + edge_amount * edge, 0, 1)[..., None]
    a = a * (0.85 + 0.15 * grain[..., None])
    img = np.array(base, float) * (1 - a) + np.array(pigment, float) * a
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(OUT / name, "WEBP", quality=72, method=6)
    print(name, (OUT / name).stat().st_size // 1024, "Ko")

paint((244, 240, 233), (176, 148, 108), 0.17, 0.09, "lavis-clair.webp")
paint((15, 17, 21), (40, 64, 112), 0.34, 0.14, "lavis-nuit.webp")

# masque de la goutte : une tache d'aquarelle qui s'étale, bord irrégulier et légèrement granuleux
S = 640
yy, xx = np.mgrid[0:S, 0:S] / S - 0.5
d = np.hypot(xx, yy)
theta = np.arctan2(yy, xx)
def ring_noise(k, amp, seed):
    r = np.random.default_rng(seed)
    return sum(r.normal() * amp / f * np.cos(f * theta + r.uniform(0, 6.28)) for f in range(2, k))
radius = 0.42 * (1 + ring_noise(14, 0.10, 3) + ring_noise(40, 0.012, 4))
fringe = 0.035 * (0.7 + 0.6 * gaussian_filter(rng.random((S, S)), 2) )
alpha = np.clip((radius - d) / fringe + 0.5, 0, 1)
alpha = np.where(d < radius - fringe, 1.0, alpha * (0.75 + 0.25 * gaussian_filter(rng.random((S, S)), 0.8)))
rgba = np.dstack([np.full((S, S), 255)] * 3 + [alpha * 255]).astype(np.uint8)
Image.fromarray(rgba, "RGBA").save(OUT / "goutte.webp", "WEBP", quality=80, method=6)
print("goutte.webp", (OUT / "goutte.webp").stat().st_size // 1024, "Ko, rayon mini", round(float(radius.min()), 3))
