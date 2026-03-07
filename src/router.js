import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import ProductList from './Components/ProductList.vue';
import ProductDetails from './views/ProductDetails.vue';
import Cart from './views/Cart.vue';
import Favorites from './views/Favorites.vue';
import AllBrands from './views/AllBrands.vue';
import AllCategories from './views/AllCategories.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/produits',
        name: 'AllProducts',
        component: ProductList,
        props: { title: 'Tous nos produits' }
    },
    {
        path: '/marques',
        name: 'AllBrands',
        component: AllBrands
    },
    {
        path: '/categories',
        name: 'AllCategories',
        component: AllCategories
    },
    {
        path: '/marque/:brand',
        name: 'Brand',
        component: ProductList,
        props: route => ({ 
            title: route.params.brand,
            filterKey: 'brand',
            filterValue: route.params.brand
        })
    },
    {
        path: '/type/:type',
        name: 'Type',
        component: ProductList,
        props: route => ({ 
            title: route.params.type,
            filterKey: 'product_type',
            filterValue: route.params.type
        })
    },
    {
        path: '/produit/:id',
        name: 'ProductDetails',
        component: ProductDetails
    },
    {
        path: '/panier',
        name: 'Cart',
        component: Cart
    },
    {
        path: '/favoris',
        name: 'Favorites',
        component: Favorites
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Scroll to top on route change
router.afterEach(() => {
    window.scrollTo(0, 0);
});

export default router;
