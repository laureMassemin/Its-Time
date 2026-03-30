# Its-Time

Application e-commerce developpee avec Vue.js pour consulter des produits cosmetiques, filtrer le catalogue, voir les details d'un produit, et gerer un panier/favoris.

## Objectif du projet

L'objectif de ce projet est de concevoir une application front-end en Vue 3 avec:

- une navigation entre plusieurs pages
- des listes produits filtrees et paginees
- une interface responsive (desktop, tablette, mobile)

## Fonctionnalites principales

- Mega menu pour marques et categories
- Liste de produits avec pagination
- Recherche sur les pages liste produits
- Filtres avances: prix, marques, types, tags
- Page detail produit avec recommandations
- Panier: ajout, suppression, quantite
- Favoris: ajout/retrait depuis les cartes produit
- Scroll en haut a chaque changement de page
- Etats de chargement sur les blocs dependants de l'API

## Organisation du travail

Projet solo, organise en etapes:

1. Initialisation du projet Vue 3 avec Vite et mise en place de la base de l'application.
2. Integration de l'API produits et creation des premiers composants (carte produit + liste produits).
3. Mise en place des filtres (marque, type, tags), puis ajout du filtre prix dynamique.
4. Creation de la page detail produit, puis ajout du panier et des favoris avec Pinia.
5. Ajout des pages `AllBrands` et `AllCategories` + organisation des composants.
6. Ajout des recommandations produits et des images de marques/types.
7. Refonte visuelle globale avec `main.css` et amelioration du responsive.
8. Ajout de la barre de recherche sur les pages liste.
9. Nettoyage du code, correction des details UX (scroll top, chargements, styles) et finalisation du README.

## Difficultes rencontrees et solutions apportees

- Difficulte principale: temps de chargement de l'API et risque de requetes repetitives.
- Solution apportee: mise en place d'un store Pinia (`products.js`) pour centraliser les donnees produits, avec cache temporaire afin de limiter les appels API inutiles et accelerer l'affichage.

## API utilisee

- API: Makeup API
- Base URL: `https://makeup-api.herokuapp.com`
- Fichier de configuration Axios: `fichier.js`

### Endpoint principal utilise

- `GET /api/v1/products.json`

URL complete:

`https://makeup-api.herokuapp.com/api/v1/products.json`

## Routes de l'application

| Route | Nom | Description |
|-------|-----|-------------|
| `/` | `Home` | Page d'accueil avec categories populaires, marques vedettes et produits recents. |
| `/produits` | `AllProducts` | Catalogue complet des produits avec recherche, filtres et pagination. |
| `/marques` | `AllBrands` | Liste de toutes les marques disponibles. |
| `/categories` | `AllCategories` | Liste de tous les types/categories de produits. |
| `/marque/:brand` | `Brand` | Catalogue filtre par marque. |
| `/type/:type` | `Type` | Catalogue filtre par type de produit. |
| `/produit/:id` | `ProductDetails` | Fiche detaillee d'un produit (infos, couleurs, recommandations). |
| `/panier` | `Cart` | Gestion du panier (quantites, suppression, total). |
| `/favoris` | `Favorites` | Liste des produits favoris. |

## Installation et lancement

### Prerequis

- Node.js 16+
- npm

### Installation

```bash
npm install
```

### Lancement en developpement

```bash
npm run dev
```

Application accessible sur `http://localhost:5173`.

### Build de production

```bash
npm run build
```
