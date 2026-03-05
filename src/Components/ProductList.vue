<template>
    <div class="container">

        <div class="presentation">
            <div class="title">{{ props.title }}</div>
        </div>

        <div v-if="productStore.loading">
            <div v-if="productStore.loading" class="loading">Chargement des produits...</div>
            <div v-else-if="productStore.error" class="error">{{ productStore.error }}</div>
        </div>
        <div v-else class="content">
            <div class="filters">
                <!-- Prix Filter -->
                <div class="filter-section price-filter-section">
                    <div class="filter-title" @click="toggleFilter('price')">
                        <span>Prix</span>
                        <span class="toggle-icon">{{ openFilters.price ? '−' : '+' }}</span>
                    </div>
                    <div class="filter-options price-filter-options" v-show="openFilters.price">
                        <div class="price-inputs">
                            <div class="price-input-group">
                                <label>Min</label>
                                <div class="input-wrapper">
                                    <input 
                                        type="number" 
                                        v-model.number="priceRange.min"
                                        :min="availablePriceRange.min"
                                        :max="priceRange.max"
                                        class="price-input">
                                </div>
                            </div>
                            <div class="price-input-group">
                                <label>Max</label>
                                <div class="input-wrapper">
                                    <input 
                                        type="number" 
                                        v-model.number="priceRange.max"
                                        :min="priceRange.min"
                                        :max="availablePriceRange.max"
                                        class="price-input">
                                </div>
                            </div>
                        </div>
                        
                        <div class="range-slider-container">
                            <input 
                                type="range" 
                                v-model.number="priceRange.min"
                                :min="availablePriceRange.min"
                                :max="availablePriceRange.max"
                                class="range-slider range-slider-min">
                            <input 
                                type="range" 
                                v-model.number="priceRange.max"
                                :min="availablePriceRange.min"
                                :max="availablePriceRange.max"
                                class="range-slider range-slider-max">
                        </div>
                        
                        <button class="reset-price-btn" @click="priceRange.min = availablePriceRange.min; priceRange.max = availablePriceRange.max;">RETOUR</button>
                    </div>
                </div>

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
import { useProductStore } from '../stores/products';
import ProductCard from './ProductCard.vue';

const productStore = useProductStore();

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

const currentPage = ref(1);
const itemsPerPage = 30;

const selectedFilters = reactive(
    Object.fromEntries(filterConfigs.map(f => [f.key, []]))
);

const priceRange = reactive({
    min: 0,
    max: 10000
});

const openFilters = reactive({
    ...Object.fromEntries(filterConfigs.map(f => [f.key, false])),
    price: false
});

const allFilterOptions = ref({});

const toggleFilter = (key) => {
    openFilters[key] = !openFilters[key];
};

// Utiliser les produits du store
const products = computed(() => {
    // Si un filtre est appliqué, filtrer les produits
    if (props.filterKey && props.filterValue) {
        return productStore.products.filter(product => {
            if (props.filterKey === 'brand') {
                return product.brand === props.filterValue;
            } else if (props.filterKey === 'product_type') {
                return product.product_type === props.filterValue;
            }
            return true;
        });
    }
    return productStore.products;
});

// Réactions pour recalculer les filtres quand les produits changent
watch(
    () => productStore.products,
    () => {
        filterConfigs.forEach(filter => {
            if (filter.isArray) {
                const allTags = productStore.products
                    .flatMap(product => product[filter.key] || [])
                    .filter(value => value && String(value).trim() !== "");
                allFilterOptions.value[filter.key] = [...new Set(allTags)];
            } else {
                const options = productStore.products
                    .map(product => product[filter.key])
                    .filter(value => value && String(value).trim() !== "");
                allFilterOptions.value[filter.key] = [...new Set(options)];
            }
        });
    },
    { immediate: true }
);

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
    // Ne rien faire - les produits viennent du store
}

const resetFilters = () => {
    Object.keys(selectedFilters).forEach(key => {
        selectedFilters[key] = [];
    });
    priceRange.min = availablePriceRange.value.min;
    priceRange.max = availablePriceRange.value.max;
}

const filteredProducts = computed(() => {
    let filtered = products.value;
    
    // Filtrer les produits sans prix valide
    filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        return product.price && !isNaN(price) && price > 0;
    });
    
    // Appliquer les filtres de la sidebar
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
    
    // Appliquer le filtre prix
    filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        return price >= priceRange.min && price <= priceRange.max;
    });
    
    return filtered;
});

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));

const availablePriceRange = computed(() => {
    const prices = products.value
        .map(p => parseFloat(p.price))
        .filter(price => !isNaN(price) && price > 0)
        .sort((a, b) => a - b);
    
    return {
        min: prices.length > 0 ? Math.floor(prices[0]) : 0,
        max: prices.length > 0 ? Math.ceil(prices[prices.length - 1]) : 10000
    };
});

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

// Initialiser les prix quand les produits changent
watch(
    () => availablePriceRange.value,
    (newRange) => {
        if (priceRange.min === 0 && priceRange.max === 10000) {
            priceRange.min = newRange.min;
            priceRange.max = newRange.max;
        }
    },
    { immediate: true }
);

// Réinitialiser la page quand la route change
watch(() => [props.filterKey, props.filterValue], () => {
    currentPage.value = 1;
}, { immediate: false });

onMounted(() => {
    // Les produits sont déjà chargés dans App.vue
    productStore.loadProducts();
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

/* Price Filter Styles */
.price-filter-section {
    padding-top: 12px;
}

.price-filter-options {
    max-height: 100%;
    overflow: visible;
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.price-inputs {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.price-input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.price-input-group label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #333;
    text-transform: uppercase;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 2px;
    overflow: hidden;
    transition: border-color 0.2s;
}

.input-wrapper:hover {
    border-color: #d4364f;
}

.currency {
    position: absolute;
    left: 6px;
    font-size: 0.8rem;
    color: #666;
    font-weight: 500;
    pointer-events: none;
}

.price-input {
    width: 100%;
    padding: 6px 6px 6px 20px;
    border: none;
    font-size: 0.85rem;
    background: transparent;
    outline: none;
    -moz-appearance: textfield;
}

.price-input::-webkit-outer-spin-button,
.price-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.range-slider-container {
    position: relative;
    height: 5px;
    margin: 16px 0 12px 0;
}

.range-slider {
    position: absolute;
    width: 100%;
    height: 5px;
    top: 0;
    background: transparent;
    -webkit-appearance: none;
    appearance: none;
    pointer-events: none;
    outline: none;
}

.range-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #d4364f;
    cursor: pointer;
    pointer-events: auto;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
}

.range-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 6px rgba(212, 54, 79, 0.3);
}

.range-slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #d4364f;
    cursor: pointer;
    pointer-events: auto;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
}

.range-slider::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 6px rgba(212, 54, 79, 0.3);
}

.range-slider-min {
    z-index: 5;
}

.range-slider-max {
    z-index: 4;
}

.range-slider::-webkit-slider-runnable-track {
    background: linear-gradient(
        to right,
        #ddd,
        #d4364f 0%,
        #d4364f 100%,
        #ddd
    );
    height: 5px;
    border-radius: 2px;
}

.range-slider::-moz-range-track {
    background: linear-gradient(
        to right,
        #ddd,
        #d4364f 0%,
        #d4364f 100%,
        #ddd
    );
    height: 5px;
    border-radius: 2px;
    border: none;
}

.reset-price-btn {
    padding: 6px 12px;
    background-color: transparent;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 0;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.5px;
}

.reset-price-btn:hover {
    color: #d4364f;
    border-color: #d4364f;
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