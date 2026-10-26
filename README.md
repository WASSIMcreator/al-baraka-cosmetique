# AL BARAKA — Cosmétique & Clothes

Boutique en une page (العربية par défaut / Français) : FOCUS en vedette, packs soin (shampoing + gel douche), vêtements avec scène 3D, panier unique et formulaire de livraison qui envoie la commande sur WhatsApp.

## Fichiers
- `index.html` : la page
- `styles.css` : le design
- `script.js` : produits, prix, panier, WhatsApp, pixels, 3D
- `focus-hero.jpg`, `focus-trio.jpg`, `focus-lifestyle.jpg` : photos compressées (≈ 290 Ko au total au lieu de 7,5 Mo)

## Avant de lancer les pubs
1. **Pixel** : dans `script.js`, en haut (`CONFIG`), collez votre ID Meta Pixel (`metaPixel`) et/ou TikTok Pixel (`tiktokPixel`).
   Événements envoyés : PageView, ViewContent, AddToCart, InitiateCheckout, Lead (Meta) / SubmitForm (TikTok).
2. **Prix des packs et vêtements** : ce sont des exemples. Modifiez `PACKS` et `CLOTHES` dans `script.js`.
3. **Liens de pub** : ajoutez des UTM, ex.
   `https://wassimcreator.github.io/al-baraka-cosmetique/?utm_source=facebook&utm_campaign=focus`
   La source s'affiche dans le message WhatsApp → vous savez quelle pub a vendu.
4. Lien direct vers le formulaire : ajoutez `#order` à la fin de l'URL.

## Photos de vêtements
Mettez une photo dans le dépôt (ex. `hoodie.jpg`) puis ajoutez `img:'hoodie.jpg'` au produit dans `CLOTHES`.
