<template>
    <div class="cart-container">
        <h1 class="cart-title">Mon Panier</h1>
        
        <div v-if="cartStore.items.length === 0" class="empty-cart">
            <p>Votre panier est vide</p>
            <RouterLink to="/" class="continue-shopping">Continuer les achats</RouterLink>
        </div>
        
        <div v-else class="cart-content">
            <div class="cart-items">
                <div v-for="(item, index) in cartStore.items" :key="index" class="cart-item">
                    <img :src="item.image" :alt="item.name" class="item-image">
                    
                    <div class="item-details">
                        <div class="item-brand">{{ item.brand }}</div>
                        <div class="item-name">{{ item.name }}</div>
                        
                        <div v-if="item.selectedColor" class="item-color">
                            <span>Couleur:</span>
                            <div class="color-display">
                                <div class="color-box" :style="{ backgroundColor: item.selectedColor.hex_value }"></div>
                                <span class="color-text">{{ item.selectedColor.colour_name }}</span>
                            </div>
                        </div>
                        
                        <div class="item-price">{{ item.price }} {{ item.priceSign }}</div>
                    </div>
                    
                    <div class="item-actions">
                        <div class="quantity-control">
                            <button @click="cartStore.updateQuantity(index, item.quantity - 1)">-</button>
                            <span class="quantity">{{ item.quantity }}</span>
                            <button @click="cartStore.updateQuantity(index, item.quantity + 1)">+</button>
                        </div>
                        
                        <button @click="cartStore.removeFromCart(index)" class="remove-btn">Supprimer</button>
                    </div>
                    
                    <div class="item-total">
                        {{ (item.price * item.quantity).toFixed(2) }} {{ item.priceSign }}
                    </div>
                </div>
            </div>
            
            <div class="cart-summary">
                <h2>Résumé</h2>
                
                <div class="summary-line">
                    <span>Articles ({{ cartStore.totalItems }})</span>
                    <span>{{ cartStore.totalPrice.toFixed(2) }} $</span>
                </div>
                
                <div class="summary-total">
                    <span>Total</span>
                    <span>{{ cartStore.totalPrice.toFixed(2) }} $</span>
                </div>
                
                <button class="checkout-btn">Passer la commande</button>
                <button @click="cartStore.clearCart()" class="clear-btn">Vider le panier</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();
</script>

<style scoped>
.cart-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: 'Montserrat', sans-serif;
}

.cart-title {
    font-size: 2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 30px;
}

.empty-cart {
    text-align: center;
    padding: 60px 20px;
}

.empty-cart p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 20px;
}

.continue-shopping {
    display: inline-block;
    padding: 12px 24px;
    background-color: #000;
    color: white;
    text-decoration: none;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: background-color 0.2s ease;
}

.continue-shopping:hover {
    background-color: #333;
}

.cart-content {
    display: flex;
    gap: 40px;
    align-items: flex-start;
}

.cart-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.cart-item {
    display: flex;
    gap: 20px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    align-items: center;
}

.item-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    background: #fafafa;
}

.item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.item-brand {
    font-size: 0.8rem;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.item-name {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
}

.item-color {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #666;
}

.color-display {
    display: flex;
    align-items: center;
    gap: 6px;
}

.color-box {
    width: 20px;
    height: 20px;
    border: 1px solid #ddd;
}

.color-text {
    font-size: 0.8rem;
}

.item-price {
    font-size: 1rem;
    font-weight: 700;
    color: #000;
}

.item-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
}

.quantity-control {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid #ddd;
}

.quantity-control button {
    padding: 8px 12px;
    background: white;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;
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
    padding: 6px 12px;
    background: transparent;
    border: 1px solid #ddd;
    font-size: 0.8rem;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    transition: all 0.2s ease;
}

.remove-btn:hover {
    border-color: #e74c3c;
    color: #e74c3c;
}

.item-total {
    font-size: 1.1rem;
    font-weight: 700;
    color: #000;
    min-width: 100px;
    text-align: right;
}

.cart-summary {
    flex: 0 0 300px;
    padding: 20px;
    border: 1px solid #e0e0e0;
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
    color: #666;
}

.summary-total {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    margin-top: 10px;
    border-top: 1px solid #e0e0e0;
    font-size: 1.2rem;
    font-weight: 700;
    color: #000;
}

.checkout-btn {
    width: 100%;
    padding: 16px;
    background-color: #000;
    color: white;
    border: none;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: background-color 0.2s ease;
    margin-top: 20px;
}

.checkout-btn:hover {
    background-color: #333;
}

.clear-btn {
    width: 100%;
    padding: 12px;
    background: transparent;
    color: #666;
    border: 1px solid #ddd;
    font-size: 0.85rem;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    transition: all 0.2s ease;
    margin-top: 10px;
}

.clear-btn:hover {
    border-color: #999;
    color: #000;
}

@media (max-width: 768px) {
    .cart-content {
        flex-direction: column;
    }
    
    .cart-summary {
        width: 100%;
        position: static;
    }
    
    .cart-item {
        flex-direction: column;
        text-align: center;
    }
    
    .item-total {
        text-align: center;
    }
}
</style>
