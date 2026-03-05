<template>
    <div class="favorites-page">
        <div class="header">
            <h1>Mes favoris</h1>
            <button v-if="favoritesStore.totalItems > 0" class="clear-btn" @click="favoritesStore.clearFavorites()">
                Vider les favoris
            </button>
        </div>

        <div v-if="favoritesStore.items.length === 0" class="empty-state">
            Aucun produit en favoris pour le moment.
        </div>

        <div v-else class="favorites-grid">
            <div v-for="(item, index) in favoritesStore.items" :key="`${item.id}-${item.selectedColor?.hex_value || 'default'}`" class="favorite-card">
                <RouterLink :to="`/produit/${item.id}`" class="card-link">
                    <div class="image-wrap">
                        <img :src="item.image" :alt="item.name" />
                    </div>
                    <div class="card-info">
                        <div class="brand">{{ item.brand || 'Marque inconnue' }}</div>
                        <div class="name">{{ item.name }}</div>
                        <div class="price">{{ item.price }} {{ item.priceSign }}</div>
                        <div v-if="item.selectedColor" class="color">
                            Couleur: {{ item.selectedColor.colour_name || item.selectedColor.hex_value }}
                        </div>
                    </div>
                </RouterLink>

                <button class="remove-btn" @click="favoritesStore.removeFromFavorites(index)">
                    Retirer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useFavoritesStore } from '../stores/favorites';

const favoritesStore = useFavoritesStore();
</script>

<style scoped>
.favorites-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px 50px;
    font-family: 'Montserrat', sans-serif;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
}

.header h1 {
    margin: 0;
    font-size: 1.8rem;
    color: #333;
}

.clear-btn,
.remove-btn {
    background: transparent;
    border: 1px solid #ddd;
    color: #333;
    padding: 8px 14px;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.85rem;
    cursor: pointer;
}

.clear-btn:hover,
.remove-btn:hover {
    border-color: #000;
    color: #000;
}

.empty-state {
    color: #777;
    font-size: 0.95rem;
    padding: 10px 0;
}

.favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 18px;
}

.favorite-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.card-link {
    text-decoration: none;
    color: inherit;
}

.image-wrap {
    width: 100%;
    aspect-ratio: 1;
    background: #fafafa;
    overflow: hidden;
}

.image-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 8px;
}

.brand {
    font-size: 0.75rem;
    color: #999;
    text-transform: uppercase;
}

.name {
    font-size: 0.9rem;
    color: #333;
    line-height: 1.3;
}

.price {
    font-size: 1rem;
    color: #000;
    font-weight: 600;
}

.color {
    font-size: 0.8rem;
    color: #666;
}

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
