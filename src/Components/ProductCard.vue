<template>
    <div class="product-card-wrapper">
        <button
            class="favorite-toggle"
            :aria-label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
            :title="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
            @click.stop="toggleFavorite"
        >
            {{ isFavorite ? '✕' : '♡' }}
        </button>

        <RouterLink :to="`/produit/${data.id}`" class="product-card link transition-fast hover-scale">
            <div class="img-container">
                <img :src="data.api_featured_image" @error="$emit('image-error')" alt="Product" class="img-responsive">
            </div>
            <div class="info flex-column flex-gap-sm">
                <div class="brand-text">{{ data.brand }}</div>
                <div class="product-name">{{ data.name }}</div>
                <div class="price-text">{{ data.price }} {{ data.price_sign }}</div>
            </div>
        </RouterLink>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useFavoritesStore } from '../stores/favorites';

const props = defineProps({
    data: JSON
});

defineEmits(['image-error']);

const favoritesStore = useFavoritesStore();

const isFavorite = computed(() => favoritesStore.isFavorite(props.data.id));

const toggleFavorite = () => {
    favoritesStore.toggleFavorite(props.data);
};
</script>

<style scoped>
.product-card-wrapper {
    position: relative;
}

.product-card {
    overflow: hidden;
    background: white;
    cursor: pointer;
    display: block;
}

.favorite-toggle {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 30px;
    height: 30px;
    border: 1px solid var(--border-color);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    color: var(--text-secondary);
    cursor: pointer;
    z-index: 2;
    font-size: 1rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
}

.favorite-toggle:hover {
    border-color: var(--color-black);
    color: var(--color-black);
}

.info {
    padding: 8px 4px;
}

.product-name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>

