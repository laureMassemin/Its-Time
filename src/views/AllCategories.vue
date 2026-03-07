<template>
    <div class="container">
        <div class="presentation">
            <div class="title">Toutes les catégories</div>
        </div>

        <div v-if="productStore.loading" class="loading">Chargement des catégories...</div>
        <div v-else-if="productStore.error" class="error">{{ productStore.error }}</div>
        <div v-else class="categories-grid">
            <RouterLink 
                v-for="type in productStore.types" 
                :key="type"
                :to="`/type/${type}`"
                class="category-card"
            >
                <div class="category-name">{{ formatProductType(type) }}</div>
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useProductStore } from '../stores/products';
import { formatProductType } from '../utils/formatters';

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

.category-card {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    background: #ffffff;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 120px;
    cursor: pointer;
}

.category-card:hover {
    border-color: #d4364f;
    box-shadow: 0 12px 30px rgba(212, 54, 79, 0.15);
    transform: translateY(-4px);
}

.category-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1a1a;
    text-align: center;
    letter-spacing: 0.2px;
    transition: color 0.3s ease;
}

.category-card:hover .category-name {
    color: #d4364f;
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

    .category-card {
        padding: 24px 16px;
        min-height: 100px;
    }

    .category-name {
        font-size: 0.85rem;
    }
}
</style>
