<template>
    <div class="container">
        <div class="presentation">
            <div class="title">{{ props.title }}</div>
        </div>

        <div v-if="productStore.loading">
            <div class="loading">Chargement des produits...</div>
        </div>
        <div v-else-if="productStore.error" class="error">
            {{ productStore.error }}
        </div>
        <div v-else class="content">
            <FiltersSection 
                :products="baseProducts"
                @update-filters="handleFiltersUpdate"
                ref="filtersRef"
            />

            <ProductGrid 
                :products="filteredProducts"
                :items-per-page="30"
                @image-error="removeProduct"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useProductStore } from '../stores/products';
import FiltersSection from './Filters/FiltersSection.vue';
import ProductGrid from './ProductGrid.vue';

const productStore = useProductStore();

const props = defineProps({
    title: String,
    description: String,
    filterKey: String,
    filterValue: String
});

const filtersRef = ref(null);
const currentFilters = ref({
    selectedFilters: {},
    priceRange: { min: 0, max: 10000 }
});

const baseProducts = computed(() => {
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

const filteredProducts = computed(() => {
    let filtered = baseProducts.value;

    filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        return product.price && !isNaN(price) && price > 0;
    });

    const selectedFilters = currentFilters.value.selectedFilters;
    const filterConfigs = [
        { key: 'brand', isArray: false },
        { key: 'product_type', isArray: false },
        { key: 'tag_list', isArray: true }
    ];

    filterConfigs.forEach(filterConfig => {
        const key = filterConfig.key;
        if (selectedFilters[key] && selectedFilters[key].length > 0) {
            if (filterConfig.isArray) {
                filtered = filtered.filter(product => 
                    Array.isArray(product[key]) && 
                    product[key].some(val => selectedFilters[key].includes(val))
                );
            } else {
                filtered = filtered.filter(product => 
                    selectedFilters[key].includes(product[key])
                );
            }
        }
    });

    const { min, max } = currentFilters.value.priceRange;
    filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        return price >= min && price <= max;
    });

    return filtered;
});

const handleFiltersUpdate = (filters) => {
    currentFilters.value = filters;
};

const removeProduct = (product) => {
};

watch(() => [props.filterKey, props.filterValue], () => {
    if (filtersRef.value) {
        filtersRef.value.resetAllFilters();
    }
}, { immediate: false });

onMounted(() => {
    productStore.loadProducts();
});
</script>

<style scoped>
.container {
    margin: auto;
    padding: 20px;
    max-width: 1600px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    font-family: 'Montserrat', sans-serif;
}

.presentation {
    text-align: center;
    padding: 20px 0;
}

.presentation .title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 10px;
    letter-spacing: -0.5px;
}

.loading,
.error {
    text-align: center;
    padding: 40px 20px;
    font-size: 1.1rem;
    color: #666;
}

.error {
    color: #d32f2f;
}

.content {
    display: flex;
    flex-direction: row;
    gap: 40px;
    align-items: flex-start;
}

/* Responsive */
@media (max-width: 1024px) {
    .content {
        flex-direction: column;
        gap: 30px;
    }
}

@media (max-width: 768px) {
    .presentation .title {
        font-size: 2rem;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 15px;
    }

    .presentation .title {
        font-size: 1.75rem;
    }
}
</style>