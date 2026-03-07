<template>
    <div class="container">
        <div class="presentation">
            <div class="title">Toutes les catégories</div>
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

<style scoped>
.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 32px;
    font-family: 'Montserrat', sans-serif;
}

.presentation {
    margin-bottom: 40px;
    text-align: center;
}

.title {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    letter-spacing: -0.5px;
}

.loading,
.error {
    text-align: center;
    padding: 40px;
    font-size: 1rem;
    color: #666;
}

.error {
    color: #d4364f;
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 24px;
}

@media (max-width: 768px) {
    .container {
        padding: 24px 20px;
    }

    .title {
        font-size: 1.5rem;
    }

    .categories-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 16px;
    }
}
</style>
