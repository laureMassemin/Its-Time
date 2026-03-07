<template>
    <div v-if="products.length > 0" class="recommended-section">
        <div class="recommended-header">
            <h2>{{ title }}</h2>
            <RouterLink :to="viewAllLink" class="view-all-btn">
                {{ viewAllText }}
            </RouterLink>
        </div>
        <div class="recommended-grid">
            <ProductCard 
                v-for="product in products" 
                :key="product.id"
                :data="product"
                @image-error="handleImageError"
            />
        </div>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import ProductCard from './ProductCard.vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        default: () => []
    },
    viewAllLink: {
        type: String,
        required: true
    },
    viewAllText: {
        type: String,
        default: 'Voir tout'
    }
});

const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/400x400?text=Image+non+disponible';
};
</script>

<style scoped>
.recommended-section {
    margin-top: 60px;
    padding-top: 40px;
    border-top: 1px solid #e0e0e0;
}

.recommended-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 15px;
}

.recommended-header h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.view-all-btn {
    padding: 12px 24px;
    background-color: transparent;
    color: #000;
    border: 1px solid #000;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    font-family: 'Montserrat', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.2s ease;
    display: inline-block;
}

.view-all-btn:hover {
    background-color: #000;
    color: #fff;
}

.recommended-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}

@media (max-width: 768px) {
    .recommended-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }

    .recommended-header h2 {
        font-size: 1.2rem;
    }

    .view-all-btn {
        font-size: 0.75rem;
        padding: 10px 18px;
    }
}
</style>
