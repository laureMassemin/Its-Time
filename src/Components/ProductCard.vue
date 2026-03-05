<template>
    <RouterLink :to="`/produit/${data.id}`" class="product-card">
        <div class="image-container">
            <img :src="data.api_featured_image" @error="$emit('image-error')" alt="Product">
        </div>
        <div class="info">
            <div class="brand">{{ data.brand }}</div>
            <div class="name">{{ data.name }}</div>
            <div class="price">{{ data.price }} {{ data.price_sign }}</div>
        </div>
    </RouterLink>

</template>

<script setup>
import { RouterLink } from 'vue-router';

    const props = defineProps({
        data: JSON
    });
    
    defineEmits(['image-error']);

</script>

<style scoped>
.product-card {
    overflow: hidden;
    background: white;
    transition: transform 0.2s;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    text-decoration: none;
    display: block;
}

.product-card:hover {
    transform: scale(1.02);
}

.image-container {
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    background: #fafafa;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.info {
    padding: 8px 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.brand {
    font-size: 0.75rem;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
}

.name {
    font-size: 0.9rem;
    font-weight: 500;
    color: #333;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

.price {
    font-size: 1rem;
    font-weight: 700;
    color: #000;
    margin-top: 4px;
}
</style>

