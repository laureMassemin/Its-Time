<template>
    <div class="container">

        <div class="presentation">
            <div class="title">{{ props.title }}</div>
        </div>

        <div v-if="loading">
            <div v-if="loading" class="loading">Chargement des produits...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
        </div>
        <div v-else class="content">
            <div class="filters">
                <div v-for="filter in filterConfigs" :key="filter.key" class="filter-section">
                    <div class="filter-title" @click="toggleFilter(filter.key)">
                        <span>{{ filter.allLabel }}</span>
                        <span class="toggle-icon">{{ openFilters[filter.key] ? '−' : '+' }}</span>
                    </div>
                    <div class="filter-options" v-show="openFilters[filter.key]">
                        <label 
                            v-for="option in getAvailableOptions(filter.key)" 
                            :key="option" 
                            class="filter-option">
                            <input 
                                type="checkbox" 
                                :value="option"
                                v-model="selectedFilters[filter.key]">
                            <span>{{ option }}</span>
                        </label>
                    </div>
                </div>
                <button class="reset-btn" @click="resetFilters">Réinitialiser les filtres</button>
            </div>

            <div class="product-container">
                <div class="products-grid">
                    <div v-if="paginatedProducts.length === 0">
                        <p class="no-results">Aucun produit trouvé avec les filtres sélectionnés.</p>
                    </div>
                    <div v-else v-for="product in paginatedProducts" :key="product.id">
                        <ProductCard :data="product" @image-error="removeProduct(product)"/>
                    </div>
                </div>
                
                <div class="pagination" v-if="totalPages > 1">
                    <button @click="previousPage" :disabled="currentPage === 1">Précédent</button>
                    <span class="page-info">Page {{ currentPage }} / {{ totalPages }}</span>
                    <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, reactive } from 'vue';
import api from '../../fichier';
import ProductCard from './ProductCard.vue';

const props = defineProps({
    title: String,
    description: String,
    filterKey: String,
    filterValue: String
});

const filterConfigs = [
    { key: 'brand', allLabel: 'Toutes les marques' },
    { key: 'product_type', allLabel: 'Tous les types' },
    { key: 'tag_list', allLabel: 'Tous les tags', isArray: true }
];

const products = ref([]);
const currentPage = ref(1);
const itemsPerPage = 30;
const loading = ref(false);
const error = ref(null);


const selectedFilters = reactive(
    Object.fromEntries(filterConfigs.map(f => [f.key, []]))
);

const openFilters = reactive(
    Object.fromEntries(filterConfigs.map(f => [f.key, false]))
);

const allFilterOptions = ref({});

const toggleFilter = (key) => {
    openFilters[key] = !openFilters[key];
};

const getProducts = async () => {
    loading.value = true;
    try{
        // Construire les paramètres de l'API
        const params = {};
        
        // Si on a un filtre depuis le router
        if (props.filterKey && props.filterValue) {
            if (props.filterKey === 'brand') {
                params.brand = props.filterValue;
            } else if (props.filterKey === 'product_type') {
                params.product_type = props.filterValue;
            } else if (props.filterKey === 'tag_list') {
                params.product_tags = props.filterValue;
            }
        }
        
        const response = await api.get('/api/v1/products.json', { params });
        const data = Array.isArray(response.data) ? response.data : response.data.products || [];
        products.value = data;
        
        filterConfigs.forEach(filter => {
            if (filter.isArray) {
                const allTags = data
                    .flatMap(product => product[filter.key] || [])
                    .filter(value => value && String(value).trim() !== "");
                allFilterOptions.value[filter.key] = [...new Set(allTags)];
            } else {
                const options = data
                    .map(product => product[filter.key])
                    .filter(value => value && String(value).trim() !== "");
                allFilterOptions.value[filter.key] = [...new Set(options)];
            }
        });
        loading.value = false;
    } catch (error){
        console.error('Erreur lors de la récupération des produits : ', error);
        loading.value = false;
        error.value = 'Erreur lors de la récupération des produits';
    }
}

const getAvailableOptions = (filterKey) => {
    const filterConfig = filterConfigs.find(f => f.key === filterKey);
    let tempFiltered = products.value;
    
    Object.keys(selectedFilters).forEach(key => {
        if (key !== filterKey && selectedFilters[key].length > 0) {
            const keyConfig = filterConfigs.find(f => f.key === key);
            if (keyConfig?.isArray) {
                tempFiltered = tempFiltered.filter(p => 
                    Array.isArray(p[key]) && p[key].some(val => selectedFilters[key].includes(val))
                );
            } else {
                tempFiltered = tempFiltered.filter(p => selectedFilters[key].includes(p[key]));
            }
        }
    });
    
    if (filterConfig?.isArray) {
        const tags = tempFiltered
            .flatMap(product => product[filterKey] || [])
            .filter(value => value && String(value).trim() !== "");
        return [...new Set(tags)];
    } else {
        const options = tempFiltered
            .map(product => product[filterKey])
            .filter(value => value && String(value).trim() !== "");
        return [...new Set(options)];
    }
};

const removeProduct = (product) => {
    products.value = products.value.filter(p => p !== product);
}

const resetFilters = () => {
    Object.keys(selectedFilters).forEach(key => {
        selectedFilters[key] = [];
    });
}

const filteredProducts = computed(() => {
    let filtered = products.value;
    
    // Filtrer les produits sans prix valide
    filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        return product.price && !isNaN(price) && price > 0;
    });
    
    // Note: Le filtre du router est déjà appliqué côté API
    // On applique seulement les filtres de la sidebar ici
    
    Object.keys(selectedFilters).forEach(key => {
        if (selectedFilters[key].length > 0) {
            const filterConfig = filterConfigs.find(f => f.key === key);
            if (filterConfig?.isArray) {
                filtered = filtered.filter(product => 
                    Array.isArray(product[key]) && product[key].some(val => selectedFilters[key].includes(val))
                );
            } else {
                filtered = filtered.filter(product => selectedFilters[key].includes(product[key]));
            }
        }
    });
    
    return filtered;
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProducts.value.slice(start, end);
});

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        window.scrollTo(0, 0);
    }
}

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        window.scrollTo(0, 0);
    }
}

watch(() => Object.values(selectedFilters), () => {
    currentPage.value = 1;
});

// Recharger les produits quand la route change
watch(() => [props.filterKey, props.filterValue], () => {
    getProducts();
    currentPage.value = 1;
}, { immediate: false });

onMounted(() => {
    getProducts();
});

</script>

<style scoped>

.container{
    margin: auto;
    padding: 20px;
    max-width: 1600px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    font-family: 'Montserrat', sans-serif;
}

.presentation{
    text-align: center;
    padding: 20px 0;
}

.presentation .title{
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 10px;
    letter-spacing: -0.5px;
}

.presentation .description{
    font-size: 1.1rem;
    color: #666;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
}

.content{
    display: flex;
    flex-direction: row;
    gap: 40px;
    align-items: flex-start;
}

.filters{
    display: flex;
    flex-direction: column;
    width: 20%;
    min-width: 220px;
    gap: 15px;
    position: sticky;
    top: 20px;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
    padding-right: 8px;
}

.filters::-webkit-scrollbar {
    width: 6px;
}

.filters::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.filters::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
}

.filters::-webkit-scrollbar-thumb:hover {
    background: #999;
}

.filter-section {
    background: transparent;
}

.filter-title {
    padding: 8px 0;
    font-size: 0.85rem;
    font-weight: 600;
    color: #333;
    background: transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.filter-title:hover {
    color: #000;
}

.toggle-icon {
    font-size: 1.2rem;
    font-weight: 400;
    color: #666;
}

.filter-options {
    max-height: 120px;
    overflow-y: auto;
    padding: 4px 0;
}

.filter-options::-webkit-scrollbar {
    width: 4px;
}

.filter-options::-webkit-scrollbar-track {
    background: transparent;
}

.filter-options::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
}

.filter-options::-webkit-scrollbar-thumb:hover {
    background: #bbb;
}

.filter-option {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.filter-option:hover {
    background-color: #f5f5f5;
}

.filter-option input[type="checkbox"] {
    margin-right: 8px;
    cursor: pointer;
}

.filter-option span {
    font-size: 0.8rem;
    color: #555;
    user-select: none;
}

.reset-btn {
    padding: 8px 16px;
    background-color: transparent;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 0;
    font-size: 0.85rem;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 10px;
}

.reset-btn:hover {
    border-color: #999;
    color: #000;
}

.product-container{
    width: 80%;
    flex: 1;
}

.products-grid{
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 40px;
}

.products-grid > div {
    flex: 0 0 calc(25% - 7px);
    min-width: 180px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 40px;
    padding: 20px 0;
}

.pagination button {
    padding: 8px 16px;
    background-color: transparent;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 0;
    cursor: pointer;
    font-weight: 400;
    font-size: 0.85rem;
    transition: border-color 0.2s ease;
}

.pagination button:hover:not(:disabled) {
    border-color: #999;
    color: #000;
}

.pagination button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    color: #999;
}

.page-info {
    font-weight: 400;
    color: #666;
    font-size: 0.85rem;
    min-width: 140px;
    text-align: center;
}

/* Responsive */
@media (max-width: 1024px) {
    .content {
        flex-direction: column;
        gap: 30px;
    }
    
    .filters {
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
        position: static;
    }
    
    .filters select {
        flex: 1;
        min-width: 200px;
    }
    
    .product-container {
        width: 100%;
    }
    
    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 20px;
    }
}

@media (max-width: 768px) {
    .presentation .title {
        font-size: 2rem;
    }
    
    .presentation .description {
        font-size: 1rem;
    }
    
    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 16px;
    }
    
    .pagination {
        gap: 12px;
        flex-wrap: wrap;
    }
    
    .pagination button {
        padding: 10px 20px;
        font-size: 0.9rem;
    }
    
    .page-info {
        font-size: 0.9rem;
        min-width: 120px;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 15px;
    }
    
    .filters {
        flex-direction: column;
    }
    
    .filters select {
        width: 100%;
    }
    
    .products-grid {
        grid-template-columns: 1fr;
    }
    
    .presentation .title {
        font-size: 1.75rem;
    }
}
</style>