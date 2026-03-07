<template>
    <div class="cart-container container-sm">
        <h1 class="page-title mb-xl">Mon Panier</h1>
        
        <div v-if="cartStore.items.length === 0" class="empty-state">
            <p style="font-size: 1.2rem; margin-bottom: 20px;">Votre panier est vide</p>
            <RouterLink to="/produits" class="btn btn-primary">Continuer les achats</RouterLink>
        </div>
        
        <div v-else class="cart-content flex flex-gap-lg">
            <div class="cart-items flex-column flex-gap-lg">
                <div v-for="(item, index) in cartStore.items" :key="index" class="item-card card" @click="goToProduct(item.id)" style="cursor: pointer;">
                    <img :src="item.image" :alt="item.name" class="item-image">
                    
                    <div class="item-details">
                        <div class="brand-text">{{ item.brand }}</div>
                        <div class="product-name" style="font-size: 1rem;">{{ item.name }}</div>
                        
                        <div v-if="item.selectedColor" class="flex flex-gap-sm" style="font-size: 0.85rem; color: var(--text-muted);">
                            <span>Couleur:</span>
                            <div class="flex flex-gap-sm">
                                <div class="color-swatch-sm" :style="{ backgroundColor: item.selectedColor.hex_value }"></div>
                                <span style="font-size: 0.8rem;">{{ item.selectedColor.colour_name }}</span>
                            </div>
                        </div>
                        
                        <div class="price-text">{{ item.price }} {{ item.priceSign }}</div>
                    </div>
                    
                    <div class="item-actions flex-column flex-gap-md">
                        <div class="quantity-control">
                            <button @click="cartStore.updateQuantity(index, item.quantity - 1)">-</button>
                            <span class="quantity">{{ item.quantity }}</span>
                            <button @click="cartStore.updateQuantity(index, item.quantity + 1)">+</button>
                        </div>
                        
                        <button @click="cartStore.removeFromCart(index)" class="btn btn-outline btn-sm remove-btn">Supprimer</button>
                    </div>
                    
                    <div class="item-total">
                        {{ (item.price * item.quantity).toFixed(2) }} {{ item.priceSign }}
                    </div>
                </div>
            </div>
            
            <div class="cart-summary card card-unified card-padding">
                <h2 class="subsection-title">Résumé</h2>
                
                <div class="summary-line">
                    <span>Articles ({{ cartStore.totalItems }})</span>
                    <span>{{ cartStore.totalPrice.toFixed(2) }} $</span>
                </div>
                
                <div class="summary-total">
                    <span>Total</span>
                    <span>{{ cartStore.totalPrice.toFixed(2) }} $</span>
                </div>
                
                <button class="btn btn-primary" style="width: 100%; margin-top: 20px;">Passer la commande</button>
                <button @click="cartStore.clearCart()" class="btn btn-outline btn-sm" style="width: 100%; margin-top: 10px;">Vider le panier</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';

const router = useRouter();
const cartStore = useCartStore();

const goToProduct = (productId) => {
    router.push(`/produit/${productId}`);
};
</script>

<style scoped>
.cart-items {
    flex: 1;
}

.cart-summary {
    flex: 0 0 300px;
    position: sticky;
    top: 80px;
}

.cart-summary h2 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 20px;
}

.summary-line {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    font-size: 0.9rem;
    color: var(--text-muted);
}

.summary-total {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    margin-top: 10px;
    border-top: 1px solid var(--border-color);
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--color-black);
}

.quantity-control {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid var(--border-color-light);
}

.quantity-control button {
    padding: 8px 12px;
    background: white;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color var(--transition-fast);
}

.quantity-control button:hover {
    background-color: #f5f5f5;
}

.quantity {
    padding: 0 10px;
    min-width: 30px;
    text-align: center;
}

.remove-btn {
    border-color: var(--text-muted);
    color: var(--text-muted);
    transition: all var(--transition-fast);
}

.remove-btn:hover {
    border-color: var(--color-error) !important;
    color: var(--color-error) !important;
    background-color: rgba(255, 0, 0, 0.05);
}

.item-total {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-black);
    min-width: 100px;
    text-align: right;
}

.item-actions {
    display: flex;
    align-items: center;
}

@media (max-width: 768px) {
    .cart-content {
        flex-direction: column !important;
    }
    
    .cart-summary {
        width: 100%;
        position: static;
    }
    
    .item-card {
        flex-direction: column;
        text-align: center;
    }
    
    .item-total {
        text-align: center;
    }
}
</style>
