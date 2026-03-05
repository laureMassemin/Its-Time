import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useFavoritesStore = defineStore('favorites', () => {
    const items = ref([]);

    const findFavoriteIndex = (productId, selectedColor = null) => {
        return items.value.findIndex(
            item => item.id === productId && item.selectedColor?.hex_value === selectedColor?.hex_value
        );
    };

    const addToFavorites = (product, selectedColor = null) => {
        const existingIndex = findFavoriteIndex(product.id, selectedColor);

        if (existingIndex !== -1) {
            return;
        }

        items.value.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: parseFloat(product.price),
            priceSign: product.price_sign,
            image: product.api_featured_image,
            selectedColor
        });
    };

    const removeFromFavorites = (itemIndex) => {
        items.value.splice(itemIndex, 1);
    };

    const toggleFavorite = (product, selectedColor = null) => {
        const existingIndex = findFavoriteIndex(product.id, selectedColor);

        if (existingIndex !== -1) {
            removeFromFavorites(existingIndex);
            return false;
        }

        addToFavorites(product, selectedColor);
        return true;
    };

    const isFavorite = (productId, selectedColor = null) => {
        return findFavoriteIndex(productId, selectedColor) !== -1;
    };

    const clearFavorites = () => {
        items.value = [];
    };

    const totalItems = computed(() => items.value.length);

    return {
        items,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        totalItems
    };
});
