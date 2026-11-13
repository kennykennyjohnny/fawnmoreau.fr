# fawnmoreau.fr

Site de Fawn Moreau, peintre horlogère à Paris. Site statique (HTML/CSS/JS), déployé avec GitHub Pages sur fawnmoreau.fr.

## Ajouter ou changer une œuvre
1. Déposer l'image en `.jpg`, 1000 px de large, dans `images/` (nom en minuscules, sans accent ni espace : `oeuvre-ma-montre.jpg`).
2. Lancer `python3 outils/images.py` : il crée la version téléphone (`images/m/`) et les versions WebP légères (`images/w/`). Il faut Pillow (`pip install pillow`).
3. Ajouter une ligne dans `app.js` : listes `OEUVRES`, `SAISONS` ou `CARNET`, au format `["oeuvre-ma-montre", "Légende"]`.

Cliquer sur une image ouvre la visionneuse, qui reste dans sa collection (Œuvres, Saisons ou Carnet).

## Mouvement
Les règles sont en tête de `motion.js`. En bref : une seule vraie entrée (l'accueil), chaque section apparaît d'un seul geste, et seules trois séries d'images ont leur propre mouvement (Saisons, portrait, atelier). Tout est coupé si l'appareil demande moins d'animations.

## Partage et référencement
- `og.jpg` (1200 × 630) : l'image affichée quand on partage le lien.
- `robots.txt`, `sitemap.xml`, données structurées dans `index.html`.
- `404.html` : page affichée pour une adresse qui n'existe pas.

## Polices
Instrument Serif (titres) et Geist (texte), hébergées dans `fonts/` et déclarées en tête de `style.css` (pas d'appel à Google Fonts).

## À compléter
- Mentions légales : statut, SIRET, adresse, e-mail (obligatoires pour une activité professionnelle)
- Une adresse e-mail de contact, en plus d'Instagram
- Légendes définitives des œuvres
