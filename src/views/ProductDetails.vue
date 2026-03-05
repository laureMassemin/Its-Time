<template>
    <div class="product-details-container">
        <div v-if="loading" class="loading">Chargement...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
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
                        <div v-for="color in product.product_colors" :key="color.hex_value" class="color-item">
                            <div class="color-swatch" :style="{ backgroundColor: color.hex_value }"></div>
                            <span class="color-name">{{ color.colour_name }}</span>
                        </div>
                    </div>
                </div>
                
                <div class="product-details-list">
                    <div class="detail-item" v-if="product.product_type">
                        <strong>Type:</strong> {{ product.product_type }}
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
                
                <button class="add-to-cart-btn">Ajouter au panier</button>
                
                <div class="meta-info">
                    <div v-if="product.created_at" class="meta-item">Ajouté le {{ formatDate(product.created_at) }}</div>
                    <div v-if="product.updated_at" class="meta-item">Mis à jour le {{ formatDate(product.updated_at) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../fichier';

const route = useRoute();
const product = ref(null);
const loading = ref(true);
const error = ref(null);

const getProduct = async () => {
    loading.value = true;
    try {
        const response = await api.get('/api/v1/products.json');
        const data = Array.isArray(response.data) ? response.data : response.data.products || [];
        
        const productId = parseInt(route.params.id);
        product.value = data.find(p => p.id === productId);
        
        if (!product.value) {
            error.value = 'Produit non trouvé';
        }
        
        loading.value = false;
    } catch (err) {
        console.error('Erreur:', err);
        error.value = 'Erreur lors du chargement du produit';
        loading.value = false;
    }
};

const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/400x400?text=Image+non+disponible';
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
    margin-top: 20px;
    width: fit-content;
}

.add-to-cart-btn:hover {
    background-color: #333;
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
