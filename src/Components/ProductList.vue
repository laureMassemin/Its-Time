<template>
    <div class="product-list-container">
        <div class="mb-2xl text-center">
            <div class="section-title">{{ formattedTitle }}</div>
            <SearchBar
                v-model="searchQuery"
                class="mt-md"
                placeholder="Rechercher par nom, marque, type ou tag"
            />
        </div>

        <div v-if="productStore.loading" class="loading">Chargement des produits...</div>
        <div v-else-if="productStore.error" class="error">
            {{ productStore.error }}
        </div>
        <div v-else class="content flex flex-gap-xl">
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
import { formatProductType } from '../utils/formatters';
import FiltersSection from './Filters/FiltersSection.vue';
import SearchBar from './Filters/SearchBar.vue';
import ProductGrid from './ProductGrid.vue';

const productStore = useProductStore();

const props = defineProps({
    title: String,
    description: String,
    filterKey: String,
    filterValue: String
});

const filtersRef = ref(null);
const searchQuery = ref('');
const currentFilters = ref({
    selectedFilters: {},
    priceRange: { min: 0, max: 10000 }
});

const formattedTitle = computed(() => {

    return formatProductType(props.title);
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

    const normalizedSearch = searchQuery.value.trim().toLowerCase();
    if (normalizedSearch) {
        filtered = filtered.filter(product => {
            const haystack = [
                product.name,
                product.brand,
                product.product_type,
                ...(Array.isArray(product.tag_list) ? product.tag_list : [])
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return haystack.includes(normalizedSearch);
        });
    }

    return filtered;
});

const handleFiltersUpdate = (filters) => {
    currentFilters.value = filters;
};

const removeProduct = (product) => {
};

watch(() => [props.filterKey, props.filterValue], () => {
    searchQuery.value = '';
    if (filtersRef.value) {
        filtersRef.value.resetAllFilters();
    }
}, { immediate: false });

onMounted(() => {
    productStore.loadProducts();
});
</script>

<style scoped>
.product-list-container {
    margin: auto;
    padding: var(--spacing-lg);
    max-width: 1600px;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.content {
    align-items: flex-start;
}

@media (max-width: 1024px) {
    .content {
        flex-direction: column;
    }
}
</style>