import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
    const items = ref([]);

    const addToCart = (product, selectedColor = null) => {
        const existingItem = items.value.find(
            item => item.id === product.id && item.selectedColor?.hex_value === selectedColor?.hex_value
        );

        if (existingItem) {
            existingItem.quantity++;
        } else {
            items.value.push({
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: parseFloat(product.price),
                priceSign: product.price_sign,
                image: product.api_featured_image,
                selectedColor: selectedColor,
                quantity: 1
            });
        }
    };

    const removeFromCart = (itemIndex) => {
        items.value.splice(itemIndex, 1);
    };

    const updateQuantity = (itemIndex, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemIndex);
        } else {
            items.value[itemIndex].quantity = quantity;
        }
    };

    const clearCart = () => {
        items.value = [];
    };

    const totalItems = computed(() => {
        return items.value.reduce((total, item) => total + item.quantity, 0);
    });

    const totalPrice = computed(() => {
        return items.value.reduce((total, item) => total + (item.price * item.quantity), 0);
    });

    return {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
    };
});
