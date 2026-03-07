# Guide d'ajout des images pour les marques et types de produits

## 📁 Structure des dossiers

```
public/
└── assets/
    ├── brands/         # Logos des marques
    │   ├── default.png # Image par défaut si logo non trouvé
    │   ├── maybelline.png
    │   ├── colourpop.png
    │   └── ...
    └── types/          # Icônes des types de produits
        ├── default.png # Image par défaut si icône non trouvée
        ├── lipstick.png
        ├── foundation.png
        └── ...
```

## 🎨 Types de produits

### Liste des types à créer
Pour chaque type de produit, créez une image avec le nom exact suivant :

- `lipstick.png` - Rouge à lèvres
- `foundation.png` - Fond de teint
- `mascara.png` - Mascara
- `eyeliner.png` - Eye-liner
- `blush.png` - Fard à joues
- `nail_polish.png` - Vernis à ongles (notez l'underscore !)
- `eyeshadow.png` - Fard à paupières
- `bronzer.png` - Bronzeur
- `lip_liner.png` - Crayon à lèvres (notez l'underscore !)
- `eyebrow.png` - Sourcils
- `concealer.png` - Anti-cernes
- `powder.png` - Poudre
- `highlighter.png` - Illuminateur
- `contour.png` - Contour

### Spécifications recommandées
- **Format** : PNG (avec transparence) ou JPG
- **Dimensions** : 200x200px (carré)
- **Poids** : < 50KB
- **Style** : Icônes simples, épurées, reconnaissables

## 🏷️ Marques

### Convention de nommage
Le nom du fichier doit être le nom de la marque en **minuscules** avec les espaces remplacés par des **tirets**.

Exemples :
- Marque "Maybelline" → `maybelline.png`
- Marque "NYX" → `nyx.png`
- Marque "ColourPop" → `colourpop.png`
- Marque "e.l.f." → `e.l.f..png`

### Spécifications recommandées
- **Format** : PNG (avec transparence recommandé) ou JPG
- **Dimensions** : 150x150px minimum
- **Poids** : < 50KB
- **Style** : Logos officiels de la marque

## 📥 Comment ajouter une image

1. **Préparez votre image** selon les spécifications ci-dessus
2. **Nommez le fichier** exactement comme indiqué (respectez les underscores et tirets !)
3. **Placez le fichier** dans le bon dossier :
   - `public/assets/types/` pour les types de produits
   - `public/assets/brands/` pour les marques
4. **Formats acceptés** : PNG (prioritaire) ou JPG (fallback automatique)

## 🔄 Gestion des erreurs

Si une image n'est pas trouvée, le système :
1. Essaie d'abord avec `.png`
2. Si non trouvé, essaie avec `.jpg`
3. Si toujours non trouvé, affiche `default.png`

## 💡 Conseils

- Utilisez des images optimisées pour le web (compression)
- Privilégiez le PNG pour les logos avec transparence
- Gardez une cohérence visuelle entre toutes les images
- Pour les marques : utilisez les logos officiels si possible
- Pour les types : créez des icônes minimalistes et reconnaissables

## 🎨 Ressources pour créer des icônes

- [Flaticon](https://www.flaticon.com/) - Icônes gratuites
- [Noun Project](https://thenounproject.com/) - Icônes simples
- [Figma](https://www.figma.com/) - Créer vos propres icônes
- [Canva](https://www.canva.com/) - Créer des logos simples
