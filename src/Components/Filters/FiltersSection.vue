<template>
    <div class="filters">
        <PriceFilter 
            :model-value="priceRange"
            @update:model-value="updatePriceRange"
            :available-range="availablePriceRange"
        />

        <CheckboxFilter
            v-for="filter in filterConfigs"
            :key="filter.key"
            :label="filter.allLabel"
            v-model="selectedFilters[filter.key]"
            :available-options="getAvailableOptions(filter.key)"
        />

        <button class="reset-btn" @click="resetAllFilters">Réinitialiser les filtres</button>
    </div>
</template>

<script setup>
import { computed, watch, reactive, defineProps, defineEmits } from 'vue';
import PriceFilter from './PriceFilter.vue';
import CheckboxFilter from './CheckboxFilter.vue';

const props = defineProps({
    products: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['update-filters']);

const filterConfigs = [
    { key: 'brand', allLabel: 'Toutes les marques' },
    { key: 'product_type', allLabel: 'Tous les types' },
    { key: 'tag_list', allLabel: 'Tous les tags', isArray: true }
];

const selectedFilters = reactive(
    Object.fromEntries(filterConfigs.map(f => [f.key, []]))
);

const priceRange = reactive({
    min: 0,
    max: 10000
});

const availablePriceRange = computed(() => {
    const prices = props.products
        .map(p => parseFloat(p.price))
        .filter(price => !isNaN(price) && price > 0)
        .sort((a, b) => a - b);
    
    return {
        min: prices.length > 0 ? Math.floor(prices[0]) : 0,
        max: prices.length > 0 ? Math.ceil(prices[prices.length - 1]) : 10000
    };
});

// Initialiser les prix quand availablePriceRange change
watch(availablePriceRange, (newRange) => {
    if (priceRange.min === 0 && priceRange.max === 10000) {
        priceRange.min = newRange.min;
        priceRange.max = newRange.max;
    }
}, { immediate: true });

const updatePriceRange = (newRange) => {
    priceRange.min = newRange.min;
    priceRange.max = newRange.max;
};

const getAvailableOptions = (filterKey) => {
    const filterConfig = filterConfigs.find(f => f.key === filterKey);
    let tempFiltered = props.products;
    
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
    
    // Filtrer par prix aussi
    tempFiltered = tempFiltered.filter(product => {
        const price = parseFloat(product.price);
        return price >= priceRange.min && price <= priceRange.max;
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

const resetAllFilters = () => {
    Object.keys(selectedFilters).forEach(key => {
        selectedFilters[key] = [];
    });
    priceRange.min = availablePriceRange.value.min;
    priceRange.max = availablePriceRange.value.max;
};

// Émettre les filtres à chaque changement
watch([selectedFilters, priceRange], () => {
    emit('update-filters', {
        selectedFilters: { ...selectedFilters },
        priceRange: { ...priceRange }
    });
}, { deep: true, immediate: true });

// Exposer les filtres actuels
defineExpose({
    resetAllFilters
});
</script>

<style scoped>
.filters {
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
</style>
