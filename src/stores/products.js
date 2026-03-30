import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../API/fichier.js';

export const useProductStore = defineStore('products', () => {
    const products = ref([]);
    const brands = ref([]);
    const types = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const lastFetchTime = ref(null);
    const cacheExpiry = 1800000; 

    const loadProducts = async (forceRefresh = false) => {
        if (products.value.length > 0 && lastFetchTime.value && !forceRefresh) {
            if (Date.now() - lastFetchTime.value < cacheExpiry) {
                return;
            }
        }

        loading.value = true;
        error.value = null;
        try {
            const response = await api.get('/api/v1/products.json');
            let data = response.data;
            
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            
            if (Array.isArray(data)) {
                data = data;
            } else if (data && data.products && Array.isArray(data.products)) {
                data = data.products;
            } else if (data && typeof data === 'object') {
                const arrays = Object.values(data).filter(v => Array.isArray(v));
                if (arrays.length > 0) {
                    data = arrays[0];
                } else {
                    data = [];
                }
            } else {
                data = [];
            }

            const validProducts = data.filter(product => {
                const price = parseFloat(product.price);
                return product && product.price && !isNaN(price) && price > 0;
            });

            products.value = validProducts;
            
            brands.value = [...new Set(validProducts.map(p => p.brand).filter(Boolean))].sort();
            types.value = [...new Set(validProducts.map(p => p.product_type).filter(Boolean))].sort();
            
            lastFetchTime.value = Date.now();
        } catch (err) {
            error.value = 'Erreur lors du chargement des produits: ' + err.message;
            console.error('Erreur produits:', err);
        } finally {
            loading.value = false;
        }
    };

    const getBrandProducts = (brand) => {
        return products.value.filter(p => p.brand === brand);
    };

    const getTypeProducts = (type) => {
        return products.value.filter(p => p.product_type === type);
    };

    const getProductById = (id) => {
        return products.value.find(p => p.id === parseInt(id));
    };

    return {
        products,
        brands,
        types,
        loading,
        error,
        loadProducts,
        getBrandProducts,
        getTypeProducts,
        getProductById
    };
});
