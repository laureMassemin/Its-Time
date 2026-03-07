<template>
    <div class="container">
        <div class="mb-2xl text-center">
            <div class="page-title">Toutes les catégories</div>
        </div>

        <div v-if="productStore.loading" class="loading">Chargement des catégories...</div>
        <div v-else-if="productStore.error" class="error">{{ productStore.error }}</div>
        <div v-else class="categories-grid">
            <TypeCard 
                v-for="type in productStore.types" 
                :key="type"
                :type="type"
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProductStore } from '../stores/products';
import TypeCard from '../Components/TypeCard.vue';

const productStore = useProductStore();

const loadCategories = async () => {
    await productStore.loadProducts();
};

onMounted(() => {
    loadCategories();
});
</script>


