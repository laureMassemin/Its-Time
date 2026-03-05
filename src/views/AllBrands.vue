<template>
    <div class="container">
        <div class="presentation">
            <div class="title">Toutes les marques</div>
        </div>

        <div v-if="productStore.loading" class="loading">Chargement des marques...</div>
        <div v-else-if="productStore.error" class="error">{{ productStore.error }}</div>
        <div v-else class="brands-grid">
            <RouterLink 
                v-for="brand in productStore.brands" 
                :key="brand"
                :to="`/marque/${brand}`"
                class="brand-card"
            >
                <div class="brand-name">{{ brand }}</div>
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useProductStore } from '../stores/products';

const productStore = useProductStore();

const loadBrands = async () => {
    await productStore.loadProducts();
};

onMounted(() => {
    loadBrands();
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

.brands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 24px;
}

.brand-card {
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

.brand-card:hover {
    border-color: #d4364f;
    box-shadow: 0 12px 30px rgba(212, 54, 79, 0.15);
    transform: translateY(-4px);
}

.brand-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1a1a;
    text-align: center;
    letter-spacing: 0.2px;
    transition: color 0.3s ease;
}

.brand-card:hover .brand-name {
    color: #d4364f;
}

@media (max-width: 768px) {
    .container {
        padding: 24px 20px;
    }

    .title {
        font-size: 1.5rem;
    }

    .brands-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 16px;
    }

    .brand-card {
        padding: 24px 16px;
        min-height: 100px;
    }

    .brand-name {
        font-size: 0.85rem;
    }
}
</style>
