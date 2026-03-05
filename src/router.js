import { createRouter, createWebHistory } from 'vue-router';
import ProductList from './Components/ProductList.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: ProductList,
        props: { title: 'Tous nos produits' }
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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
