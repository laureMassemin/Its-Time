<template>
    <div class="product-card">
        <div class="image-container">
            <img :src="data.api_featured_image" @error="$emit('image-error')" alt="Product">
        </div>
        <div class="info">
            <div class="brand">{{ data.brand }}</div>
            <div class="name">{{ data.name }}</div>
            <div class="price">{{ data.price }} {{ data.price_sign }}</div>
        </div>
    </div>

</template>

<script setup>

    const props = defineProps({
        data: JSON
    });
    
    defineEmits(['image-error']);

</script>

<style scoped>
.product-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.image-container {
    width: 300px;
    height: 300px;
    overflow: hidden;
    background: #f5f5f5;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.info {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.brand {
    font-size: 0.85rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.name {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    line-height: 1.3;
}

.price {
    font-size: 1.1rem;
    font-weight: 700;
    color: #e74c3c;
}
</style>

