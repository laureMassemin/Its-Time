<template>
    <div class="favorites-page container-sm">
        <div class="flex-between mb-lg">
            <h1 class="page-title">Mes favoris</h1>
            <button v-if="favoritesStore.totalItems > 0" class="btn btn-outline btn-sm" @click="favoritesStore.clearFavorites()">
                Vider les favoris
            </button>
        </div>

        <div v-if="favoritesStore.items.length === 0" class="empty-state">
            Aucun produit en favoris pour le moment.
        </div>

        <div v-else class="favorites-grid">
            <div 
                v-for="(item, index) in favoritesStore.items" 
                :key="`${item.id}-${item.selectedColor?.hex_value || 'default'}`"
                class="favorite-card-wrapper"
            >
                <RouterLink 
                    :to="`/produit/${item.id}`" 
                    class="favorite-card link transition-fast hover-scale"
                >
                    <div class="img-container">
                        <img :src="item.image" :alt="item.name" class="img-responsive" />
                    </div>
                    <div class="info flex-column flex-gap-sm">
                        <div class="brand-text">{{ item.brand || 'Marque inconnue' }}</div>
                        <div class="product-name">{{ item.name }}</div>
                        <div class="price-text">{{ item.price }} {{ item.priceSign }}</div>
                        <div v-if="item.selectedColor" class="text-muted" style="font-size: 0.8rem;">
                            Couleur: {{ item.selectedColor.colour_name || item.selectedColor.hex_value }}
                        </div>
                    </div>
                </RouterLink>
                <button 
                    @click="favoritesStore.removeFromFavorites(index)" 
                    class="remove-favorite-btn"
                    title="Retirer des favoris"
                >
                    ✕
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
.favorites-page h1 {
    margin: 0;
    font-size: 1.8rem;
}

.favorite-card-wrapper {
    position: relative;
}

.favorite-card {
    overflow: hidden;
    background: white;
    cursor: pointer;
    display: block;
    transition: transform var(--transition-fast);
}

.favorite-card:hover {
    transform: translateY(-4px);
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

.remove-favorite-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.remove-favorite-btn:hover {
    background: var(--color-error);
    color: white;
    transform: scale(1.1);
}

@media (max-width: 768px) {
    .flex-between {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
