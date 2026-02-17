<template>
    <div class="container">

        <div class="presentation">
            <div class="title">{{ props.title }}</div>
        </div>

        <div class="content">
            <div class="filters">
                <select 
                    v-for="filter in filterConfigs" 
                    :key="filter.key"
                    v-model="selectedFilters[filter.key]">
                    <option value="">{{ filter.allLabel }}</option>
                    <option 
                        v-for="option in getAvailableOptions(filter.key)" 
                        :key="option" 
                        :value="option">
                        {{ option }}
                    </option>
                </select>
                <button class="reset-btn" @click="resetFilters">Réinitialiser les filtres</button>
            </div>


            <div class="product-container">
                <div class="products-grid">
                    <div v-for="product in paginatedProducts" :key="product.id">
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
    description: String
});

const filterConfigs = [
    { key: 'brand', allLabel: 'Toutes les marques' },
    { key: 'category', allLabel: 'Toutes les catégories' },
    { key: 'product_type', allLabel: 'Tous les types' },
    { key: 'tag_list', allLabel: 'Tous les tags', isArray: true }
];

const products = ref([]);
const currentPage = ref(1);
const itemsPerPage = 30;

const selectedFilters = reactive(
    Object.fromEntries(filterConfigs.map(f => [f.key, '']))
);

const allFilterOptions = ref({});

const getProducts = async () => {
    try{
        const response = await api.get('/api/v1/products.json');
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
    } catch (error){
        console.error('Erreur lors de la récupération des produits : ', error);
    }
}

const getAvailableOptions = (filterKey) => {
    const filterConfig = filterConfigs.find(f => f.key === filterKey);
    let tempFiltered = products.value;
    
    Object.keys(selectedFilters).forEach(key => {
        if (key !== filterKey && selectedFilters[key]) {
            const keyConfig = filterConfigs.find(f => f.key === key);
            if (keyConfig?.isArray) {
                tempFiltered = tempFiltered.filter(p => 
                    Array.isArray(p[key]) && p[key].includes(selectedFilters[key])
                );
            } else {
                tempFiltered = tempFiltered.filter(p => p[key] === selectedFilters[key]);
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
        selectedFilters[key] = '';
    });
}

const filteredProducts = computed(() => {
    let filtered = products.value;
    
    Object.keys(selectedFilters).forEach(key => {
        if (selectedFilters[key]) {
            const filterConfig = filterConfigs.find(f => f.key === key);
            if (filterConfig?.isArray) {
                filtered = filtered.filter(product => 
                    Array.isArray(product[key]) && product[key].includes(selectedFilters[key])
                );
            } else {
                filtered = filtered.filter(product => product[key] === selectedFilters[key]);
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
}

.filters select{
    padding: 12px 16px;
    font-size: 0.95rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background-color: white;
    color: #333;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    outline: none;
}

.filters select:hover{
    border-color: #2c3e50;
}

.filters select:focus{
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.filters select option{
    padding: 10px;
}

.reset-btn {
    padding: 12px 16px;
    background-color: #666;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
}

.reset-btn:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
}

.reset-btn:active {
    transform: translateY(0);
}

.product-container{
    width: 80%;
    flex: 1;
}

.products-grid{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
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
    padding: 12px 24px;
    background-color: #2c3e50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination button:hover:not(:disabled) {
    background-color: #34495e;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.pagination button:active:not(:disabled) {
    transform: translateY(0);
}

.pagination button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background-color: #95a5a6;
}

.page-info {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1rem;
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