<template>
    <div class="product-details-container">
        <div v-if="productStore.loading" class="loading">Chargement...</div>
        <div v-else-if="productStore.error" class="error">{{ productStore.error }}</div>
        <div v-else-if="product" class="product-details">
            <div class="product-image">
                <img :src="product.api_featured_image" :alt="product.name" @error="handleImageError">
            </div>
            
            <div class="product-info">
                <div class="brand">{{ product.brand }}</div>
                <h1 class="name">{{ product.name }}</h1>
                <div class="price-container">
                    <div class="price">{{ product.price }} {{ product.price_sign }}</div>
                    <div class="currency" v-if="product.currency">{{ product.currency }}</div>
                </div>
                
                <div class="rating" v-if="product.rating">
                    <strong>Note:</strong> {{ product.rating }} / 5
                </div>
                
                <div class="description" v-if="product.description">
                    <h2>Description</h2>
                    <p>{{ product.description }}</p>
                </div>
                
                <div class="colors" v-if="product.product_colors && product.product_colors.length > 0">
                    <h2>Couleurs disponibles ({{ product.product_colors.length }})</h2>
                    <div class="colors-grid">
                        <div 
                            v-for="color in product.product_colors" 
                            :key="color.hex_value" 
                            class="color-item"
                            :class="{ selected: selectedColor?.hex_value === color.hex_value }"
                            @click="selectedColor = color">
                            <div class="color-swatch" :style="{ backgroundColor: color.hex_value }"></div>
                            <span class="color-name">{{ color.colour_name }}</span>
                        </div>
                    </div>
                </div>
                
                <div class="product-details-list">
                    <div class="detail-item" v-if="product.product_type">
                        <strong>Type:</strong> {{ formatProductType(product.product_type) }}
                    </div>
                    <div class="detail-item" v-if="product.category">
                        <strong>Catégorie:</strong> {{ product.category }}
                    </div>
                    <div class="detail-item" v-if="product.id">
                        <strong>ID:</strong> {{ product.id }}
                    </div>
                </div>
                
                <div class="tags" v-if="product.tag_list && product.tag_list.length > 0">
                    <span v-for="tag in product.tag_list" :key="tag" class="tag">{{ tag }}</span>
                </div>
                
                <div class="links">
                    <a v-if="product.product_link" :href="product.product_link" target="_blank" class="external-link">
                        Voir sur le site officiel
                    </a>
                    <a v-if="product.website_link" :href="product.website_link" target="_blank" class="external-link">
                        Site de la marque
                    </a>
                </div>
                
                <div class="add-to-cart-section">
                    <div v-if="product.product_colors && product.product_colors.length > 0 && !selectedColor" class="color-warning">
                        Veuillez sélectionner une couleur
                    </div>
                    <div class="actions-row">
                        <button
                            class="add-to-cart-btn"
                            @click="handleAddToCart"
                            :disabled="product.product_colors && product.product_colors.length > 0 && !selectedColor"
                        >
                            Ajouter au panier
                        </button>
                        <button
                            class="add-to-favorites-btn"
                            @click="handleAddToFavorites"
                            :disabled="product.product_colors && product.product_colors.length > 0 && !selectedColor"
                        >
                            {{ isCurrentSelectionFavorite() ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
                        </button>
                    </div>
                    <div v-if="addedMessage" class="added-message">✓ Ajouté au panier</div>
                    <div v-if="favoriteMessage" class="favorite-message">✓ Favoris mis à jour</div>
                </div>
                
                <div class="meta-info">
                    <div v-if="product.created_at" class="meta-item">Ajouté le {{ formatDate(product.created_at) }}</div>
                    <div v-if="product.updated_at" class="meta-item">Mis à jour le {{ formatDate(product.updated_at) }}</div>
                </div>
            </div>
        </div>

        <RecommendedProducts
            v-if="product"
            :title="`Plus de produits de ${product.brand}`"
            :products="relatedProductsByBrand"
            :view-all-link="`/marque/${product.brand}`"
            :view-all-text="`Voir tous les produits de ${product.brand}`"
        />

        <RecommendedProducts
            v-if="product"
            :title="`Plus de ${formatProductType(product.product_type)}`"
            :products="relatedProductsByType"
            :view-all-link="`/type/${product.product_type}`"
            :view-all-text="`Voir tous les ${formatProductType(product.product_type)}`"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useFavoritesStore } from '../stores/favorites';
import { useProductStore } from '../stores/products';
import { formatProductType } from '../utils/formatters';
import RecommendedProducts from '../Components/RecommendedProducts.vue';

const route = useRoute();
const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();
const productStore = useProductStore();

const product = ref(null);
const selectedColor = ref(null);
const addedMessage = ref(false);
const favoriteMessage = ref(false);

const relatedProductsByBrand = computed(() => {
    if (!product.value || !product.value.brand) {
        return [];
    }
    
    return productStore.products
        .filter(p => p.brand === product.value.brand && p.id !== product.value.id)
        .slice(0, 4);
});


const relatedProductsByType = computed(() => {
    if (!product.value || !product.value.product_type) {
        return [];
    }
    
    return productStore.products
        .filter(p => p.product_type === product.value.product_type && p.id !== product.value.id)
        .slice(0, 4);
});

const getProduct = async () => {
    await productStore.loadProducts();
    
    const productId = parseInt(route.params.id);
    product.value = productStore.getProductById(productId);
    
    if (!product.value) {
        console.error('Produit non trouvé');
    }
};

const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/400x400?text=Image+non+disponible';
};

const handleAddToCart = () => {
    if (product.value.product_colors && product.value.product_colors.length > 0 && !selectedColor.value) {
        return;
    }
    
    cartStore.addToCart(product.value, selectedColor.value);
    
    addedMessage.value = true;
    setTimeout(() => {
        addedMessage.value = false;
    }, 2000);
};

const handleAddToFavorites = () => {
    if (product.value.product_colors && product.value.product_colors.length > 0 && !selectedColor.value) {
        return;
    }

    favoritesStore.toggleFavorite(product.value, selectedColor.value);

    favoriteMessage.value = true;
    setTimeout(() => {
        favoriteMessage.value = false;
    }, 2000);
};

const isCurrentSelectionFavorite = () => {
    if (!product.value) {
        return false;
    }

    return favoritesStore.isFavorite(product.value.id, selectedColor.value);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

onMounted(() => {
    getProduct();
});
</script>

<style scoped>
.product-details-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: 'Montserrat', sans-serif;
}

.loading, .error {
    text-align: center;
    padding: 60px 20px;
    font-size: 1.1rem;
    color: #666;
}

.error {
    color: #e74c3c;
}

.product-details {
    display: flex;
    gap: 60px;
    align-items: flex-start;
}

.product-image {
    flex: 0 0 500px;
    background: #fafafa;
    position: sticky;
    top: 80px;
    align-self: flex-start;
    max-height: calc(100vh - 100px);
    overflow: hidden;
}

.product-image img {
    width: 100%;
    height: auto;
    display: block;
}

.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.brand {
    font-size: 0.9rem;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
}

.name {
    font-size: 2rem;
    font-weight: 600;
    color: #333;
    line-height: 1.3;
    margin: 0;
}

.price-container {
    display: flex;
    align-items: baseline;
    gap: 10px;
}

.price {
    font-size: 1.8rem;
    font-weight: 700;
    color: #000;
}

.currency {
    font-size: 0.9rem;
    color: #666;
    font-weight: 400;
}

.rating {
    font-size: 0.95rem;
    color: #666;
    padding: 8px 0;
}

.description {
    margin-top: 20px;
}

.description h2 {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.description p {
    font-size: 0.95rem;
    color: #666;
    line-height: 1.6;
}

.colors {
    margin-top: 20px;
}

.colors h2 {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.colors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
}

.color-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    padding: 4px;
    border: 2px solid transparent;
    transition: all 0.2s ease;
}

.color-item:hover {
    border-color: #ddd;
}

.color-item.selected {
    border-color: #000;
    background-color: #fafafa;
}

.color-swatch {
    width: 40px;
    height: 40px;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.color-swatch:hover {
    transform: scale(1.1);
}

.color-name {
    font-size: 0.7rem;
    color: #666;
    text-align: center;
    line-height: 1.2;
}

.product-details-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 10px 0;
}

.detail-item {
    font-size: 0.9rem;
    color: #666;
}

.detail-item strong {
    color: #333;
    margin-right: 5px;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.tag {
    padding: 4px 12px;
    background: #f5f5f5;
    color: #666;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.links {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 20px 0;
}

.external-link {
    font-size: 0.9rem;
    color: #333;
    text-decoration: underline;
    transition: color 0.2s ease;
}

.external-link:hover {
    color: #000;
}

.add-to-cart-section {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.actions-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.color-warning {
    font-size: 0.85rem;
    color: #e74c3c;
    font-style: italic;
}

.add-to-cart-btn {
    padding: 16px 32px;
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
    width: fit-content;
}

.add-to-favorites-btn {
    padding: 16px 24px;
    background-color: transparent;
    color: #000;
    border: 1px solid #000;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: background-color 0.2s ease, color 0.2s ease;
    width: fit-content;
}

.add-to-cart-btn:hover:not(:disabled) {
    background-color: #333;
}

.add-to-cart-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.add-to-favorites-btn:hover:not(:disabled) {
    background-color: #000;
    color: #fff;
}

.add-to-favorites-btn:disabled {
    border-color: #ccc;
    color: #999;
    cursor: not-allowed;
}

.added-message {
    font-size: 0.9rem;
    color: #27ae60;
    font-weight: 500;
}

.favorite-message {
    font-size: 0.9rem;
    color: #27ae60;
    font-weight: 500;
}

.meta-info {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.meta-item {
    font-size: 0.75rem;
    color: #999;
}

@media (max-width: 768px) {
    .product-details {
        flex-direction: column;
        gap: 30px;
    }
    
    .product-image {
        flex: 1 1 auto;
        width: 100%;
    }
    
    .name {
        font-size: 1.5rem;
    }
    
    .price {
        font-size: 1.4rem;
    }
}
</style>
