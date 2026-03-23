<template>
    <div class="product-details-container container-sm">
        <div v-if="productStore.loading" class="loading">Chargement...</div>
        <div v-else-if="productStore.error" class="error">{{ productStore.error }}</div>
        <div v-else-if="product" class="product-details flex flex-gap-lg">
            <div class="product-image">
                <img :src="product.api_featured_image" :alt="product.name" @error="handleImageError" class="img-responsive">
            </div>
            
            <div class="product-info flex-column flex-gap-lg">
                <div class="brand-text">{{ product.brand }}</div>
                
                <h1 class="h1">{{ product.name }}</h1>
                <div class="flex flex-gap-md">
                    <div class="price-text-large">{{ product.price }} {{ product.price_sign }}</div>
                    <div class="text-muted" v-if="product.currency">{{ product.currency }}</div>
                </div>
                
                <div class="text-muted" v-if="product.rating">
                    <strong>Note:</strong> {{ product.rating }} / 5
                </div>
                
                <div class="mt-lg" v-if="product.description">
                    <h2 class="h3">Description</h2>
                    <p class="text-muted">{{ product.description }}</p>
                </div>
                
                <div class="mt-lg" v-if="product.product_colors && product.product_colors.length > 0">
                    <h2 class="h3">Couleurs disponibles ({{ product.product_colors.length }})</h2>
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
                
                <div class="flex-column flex-gap-sm">
                    <div class="flex flex-gap-md text-muted" v-if="product.product_type">
                        <img 
                            :src="typeImage" 
                            :alt="formatProductType(product.product_type)"
                            @error="handleTypeImageError"
                            class="img-icon-sm"
                        />
                        <span><strong>Type:</strong> {{ formatProductType(product.product_type) }}</span>
                    </div>
                    <div class="text-muted" v-if="product.id">
                        <strong>ID:</strong> {{ product.id }}
                    </div>
                </div>
                
                <div class="flex flex-wrap flex-gap-sm mt-md" v-if="product.tag_list && product.tag_list.length > 0">
                    <span v-for="tag in product.tag_list" :key="tag" class="tag">{{ tag }}</span>
                </div>
                
                <div class="flex-column flex-gap-md mt-lg">
                    <a v-if="product.product_link" :href="product.product_link" target="_blank" class="link-primary">
                        Voir sur le site officiel
                    </a>
                    <a v-if="product.website_link" :href="product.website_link" target="_blank" class="link-primary">
                        Site de la marque
                    </a>
                </div>
                
                <div class="flex-column flex-gap-md mt-lg">
                    <div v-if="product.product_colors && product.product_colors.length > 0 && !selectedColor" class="warning-message">
                        Veuillez sélectionner une couleur
                    </div>
                    <div class="flex flex-gap-md flex-wrap">
                        <button
                            class="btn btn-primary"
                            @click="handleAddToCart"
                            :disabled="product.product_colors && product.product_colors.length > 0 && !selectedColor"
                        >
                            Ajouter au panier
                        </button>
                        <button
                            class="btn btn-outline"
                            @click="handleAddToFavorites"
                            :disabled="product.product_colors && product.product_colors.length > 0 && !selectedColor"
                        >
                            {{ isCurrentSelectionFavorite() ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
                        </button>
                    </div>
                    <div v-if="addedMessage" class="success-message">✓ Ajouté au panier</div>
                    <div v-if="favoriteMessage" class="success-message">✓ Favoris mis à jour</div>
                </div>
                
                <div class="border-top pt-lg mt-xl flex-column flex-gap-sm">
                    <div class="caption" v-if="product.created_at">Ajouté le {{ formatDate(product.created_at) }}</div>
                    <div class="caption" v-if="product.updated_at">Mis à jour le {{ formatDate(product.updated_at) }}</div>
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
import { ref, onMounted, computed, watch } from 'vue';
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
const brandImageError = ref(false);
const typeImageError = ref(false);

const brandImage = computed(() => {
    if (!product.value || brandImageError.value) return '/assets/brands/default.png';
    const brandSlug = product.value.brand.toLowerCase().replace(/\s+/g, '-');
    return `/assets/brands/${brandSlug}.png`;
});

const typeImage = computed(() => {
    if (!product.value || typeImageError.value) return '/assets/types/default.png';
    return `/assets/types/${product.value.product_type}.png`;
});

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

const handleBrandImageError = (e) => {
    if (!brandImageError.value) {
        brandImageError.value = true;
        const brandSlug = product.value.brand.toLowerCase().replace(/\s+/g, '-');
        e.target.src = `/assets/brands/${brandSlug}.jpg`;
        e.target.onerror = () => {
            e.target.src = '/assets/brands/default.png';
        };
    }
};

const handleTypeImageError = (e) => {
    if (!typeImageError.value) {
        typeImageError.value = true;
        e.target.src = `/assets/types/${product.value.product_type}.jpg`;
        e.target.onerror = () => {
            e.target.src = '/assets/types/default.png';
        };
    }
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

// Watch for route changes to reload product when switching between details pages
watch(() => route.params.id, () => {
    selectedColor.value = null; // Reset color selection
    getProduct();
});
</script>

<style scoped>
.product-details {
    align-items: flex-start;
}

.product-image {
    flex: 0 0 500px;
    background: var(--bg-lighter);
    position: sticky;
    top: 80px;
    align-self: flex-start;
    max-height: calc(100vh - 100px);
    overflow: hidden;
}

.product-info {
    flex: 1;
}

.colors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: var(--spacing-sm);
}

.color-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    padding: 4px;
    border: 2px solid transparent;
    transition: all var(--transition-fast);
}

.color-item:hover {
    border-color: var(--border-color-light);
}

.color-item.selected {
    border-color: var(--color-black);
    background-color: var(--bg-lighter);
}

.color-name {
    font-size: 0.7rem;
    color: var(--text-muted);
    text-align: center;
    line-height: 1.2;
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
}
</style>
