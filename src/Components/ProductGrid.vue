<template>
    <div class="product-container">
        <div class="products-grid">
            <div v-if="paginatedProducts.length === 0">
                <p class="no-results">Aucun produit trouvé avec les filtres sélectionnés.</p>
            </div>
            <div v-else v-for="product in paginatedProducts" :key="product.id">
                <ProductCard :data="product" @image-error="$emit('image-error', product)"/>
            </div>
        </div>
        
        <div class="pagination" v-if="totalPages > 1">
            <button @click="previousPage" :disabled="currentPage === 1">Précédent</button>
            <span class="page-info">Page {{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ProductCard from './ProductCard.vue';

const props = defineProps({
    products: {
        type: Array,
        required: true
    },
    itemsPerPage: {
        type: Number,
        default: 32
    }
});

const emit = defineEmits(['image-error']);

const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(props.products.length / props.itemsPerPage));

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * props.itemsPerPage;
    const end = start + props.itemsPerPage;
    return props.products.slice(start, end);
});

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        window.scrollTo(0, 0);
    }
};

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        window.scrollTo(0, 0);
    }
};

watch(() => props.products, () => {
    currentPage.value = 1;
});

defineExpose({
    resetPage: () => {
        currentPage.value = 1;
    }
});
</script>

<style scoped>
.product-container {
    width: 80%;
    flex: 1;
}

.products-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 40px;
}

.products-grid > div {
    flex: 0 0 calc(25% - 7px);
    min-width: 180px;
}

.no-results {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
    color: #666;
    font-size: 1rem;
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
    .product-container {
        width: 100%;
    }
    
    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 20px;
    }
}

@media (max-width: 768px) {
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
    .products-grid {
        grid-template-columns: 1fr;
    }
}
</style>
