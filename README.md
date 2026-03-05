# Its-Time 

Une application e-commerce développée avec Vue 3.

## ✨ Fonctionnalités

### Interface Utilisateur
- **Mega Menu** - Navigation avec dropdown full-width
- **Design Responsive** - Optimisé pour mobile, tablette et desktop
- **Thème** - Couleur signature #d4364f, typographie Montserrat

### Filtres Avancés
- **Filtre Prix** - Range slider avec inputs min/max
- **Filtres Marques** - Checkboxes dynamiques avec toutes les marques
- **Filtres Types** - Filtrage par catégories de produits
- **Filtres Tags** - Tags personnalisés pour affiner la recherche

### Fonctionnalités
- **Panier** - Ajout/suppression de produits, gestion des quantités
- **Favoris** - Sauvegarde des produits préférés
- **Pages Produits** - Détails complets, sélection de couleurs, variations
- **Pagination** - Navigation fluide dans les catalogues (30 produits/page)

### Performance
- **Cache Intelligent** - Pinia store avec cache de 30 minutes
- **Chargement Optimisé** - 1 seul appel API au démarrage
- **Navigation Instantanée** - Filtrage côté client ultra-rapide

## Architecture

### Structure des Composants
```
src/
├── Components/
│   ├── Filters/
│   │   ├── PriceFilter.vue      # Filtre prix avec range slider
│   │   ├── CheckboxFilter.vue   # Filtre checkbox réutilisable
│   │   └── FiltersSection.vue   # Conteneur des filtres
│   ├── Navbar.vue               # Navigation avec mega menu
│   ├── ProductCard.vue          # Carte produit
│   ├── ProductList.vue          # Liste de produits orchestrateur
│   └── ProductGrid.vue          # Grille + pagination
├── stores/
│   ├── products.js              # Cache produits (30 min)
│   ├── cart.js                  # Gestion panier
│   └── favorites.js             # Gestion favoris
├── views/
│   ├── ProductDetails.vue       # Page détail produit
│   ├── Cart.vue                 # Page panier
│   ├── Favorites.vue            # Page favoris
│   ├── AllBrands.vue            # Toutes les marques
│   └── AllCategories.vue        # Toutes les catégories
└── router.js                    # Configuration des routes
```

### Technologies

- **Vue 3** - Composition API, `<script setup>`
- **Vue Router** - Navigation SPA avec routes dynamiques
- **Pinia** - State management moderne
- **Vite** - Build tool ultra-rapide
- **Montserrat** - Police Google Fonts

## Démarrage 

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Installation

```sh
npm install
```

### Développement

```sh
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build Production

```sh
npm run build
```

## 📱 Routes

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil avec tous les produits |
| `/marques` | Grille de toutes les marques |
| `/categories` | Grille de toutes les catégories |
| `/marque/:brand` | Produits filtrés par marque |
| `/type/:type` | Produits filtrés par type |
| `/produit/:id` | Détails d'un produit |
| `/panier` | Panier d'achats |
| `/favoris` | Produits favoris |

## 🎨 Thème & Design

### Couleurs
- **Primary:** #d4364f 
- **Text:** #1a1a1a, #333, #666
- **Border:** #ddd

### Typographie
- **Font Family:** Montserrat, sans-serif
- **Weights:** 400, 600, 700

## 🔧 Configuration

### IDE Recommandé
[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### Extensions Navigateur
- **Chrome/Edge:** [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- **Firefox:** [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## 📦 Dépendances Principales

```json
{
  "vue": "^3.x",
  "vue-router": "^4.x",
  "pinia": "^2.x",
  "axios": "^1.x"
}
```

## 📝 License

[MIT](LICENSE)
