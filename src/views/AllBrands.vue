<template>
    <div class="container">
        <div class="mb-2xl text-center">
            <div class="page-title">Toutes les marques</div>
        </div>

        <div v-if="productStore.loading" class="loading">Chargement des marques...</div>
        <div v-else-if="productStore.error" class="error">{{ productStore.error }}</div>
        <div v-else class="brands-grid">
            <BrandCard 
                v-for="brand in productStore.brands" 
                :key="brand"
                :brand="brand"
                :show-count="true"
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProductStore } from '../stores/products';
import BrandCard from '../Components/BrandCard.vue';

const productStore = useProductStore();

const loadBrands = async () => {
    await productStore.loadProducts();
};

onMounted(() => {
    loadBrands();
});
</script>


