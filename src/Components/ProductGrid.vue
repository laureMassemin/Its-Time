<template>
    <div class="product-container">
        <div class="products-grid">
            <div v-if="paginatedProducts.length === 0">
                <p class="empty-state">Aucun produit trouvé avec les filtres sélectionnés.</p>
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

@media (max-width: 1024px) {
    .product-container {
        width: 100%;
    }
}
</style>
