import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../../fichier';

export const useProductStore = defineStore('products', () => {
    const products = ref([]);
    const brands = ref([]);
    const types = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const lastFetchTime = ref(null);
    const cacheExpiry = 1800000; // 30 minutes

    const loadProducts = async (forceRefresh = false) => {
        // Vérifier si les données sont en cache et fraîches
        if (products.value.length > 0 && lastFetchTime.value && !forceRefresh) {
            if (Date.now() - lastFetchTime.value < cacheExpiry) {
                return; // Utiliser le cache
            }
        }

        loading.value = true;
        error.value = null;
        try {
            const response = await api.get('/api/v1/products.json');
            const data = Array.isArray(response.data) ? response.data : response.data.products || [];

            const validProducts = data.filter(product => {
                const price = parseFloat(product.price);
                return product.price && !isNaN(price) && price > 0;
            });

            products.value = validProducts;
            
            // Extraire les marques et types uniques
            brands.value = [...new Set(validProducts.map(p => p.brand).filter(Boolean))].sort();
            types.value = [...new Set(validProducts.map(p => p.product_type).filter(Boolean))].sort();
            
            lastFetchTime.value = Date.now();
        } catch (err) {
            error.value = 'Erreur lors du chargement des produits';
            console.error(err);
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
