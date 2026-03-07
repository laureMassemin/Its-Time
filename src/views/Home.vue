<template>
    <div class="home">
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title">Découvrez la beauté autrement</h1>
                <p class="hero-subtitle">
                    Explorez notre collection de produits de maquillage des plus grandes marques
                </p>
                <div class="flex flex-center flex-gap-lg flex-wrap">
                    <RouterLink to="/produits" class="btn btn-primary">
                        Voir tous les produits
                    </RouterLink>
                    <RouterLink to="/marques" class="btn btn-secondary">
                        Découvrir les marques
                    </RouterLink>
                </div>
            </div>
        </section>

        <!-- Featured Brands -->
        <section class="section section-alt">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title-left">Marques vedettes</h2>
                    <RouterLink to="/marques" class="view-all-btn">
                        Voir toutes les marques →
                    </RouterLink>
                </div>
                <div v-if="productStore.loading" class="loading">Chargement des marques...</div>
                <div v-else class="brands-grid">
                    <BrandCard 
                        v-for="brand in featuredBrands" 
                        :key="brand"
                        :brand="brand"
                        :show-count="true"
                    />
                </div>
            </div>
        </section>

        <!-- Recent Products -->
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title-left">Produits récents</h2>
                    <RouterLink to="/produits" class="view-all-btn">
                        Voir tous les produits →
                    </RouterLink>
                </div>
                <div v-if="productStore.loading" class="loading">Chargement...</div>
                <div v-else class="products-grid-wrapper">
                    <ProductGrid :products="recentProducts" :items-per-page="8" />
                </div>
            </div>
        </section>

        <!-- Call to Action -->
        <section class="cta-section">
            <div class="cta-content">
                <h2 style="font-size: 2.5rem; font-weight: 700; margin: 0 0 15px 0;">Prêt à commencer votre shopping beauté ?</h2>
                <p style="font-size: 1.2rem; margin: 0 0 30px 0; opacity: 0.95;">Rejoignez des milliers de clients satisfaits</p>
                <RouterLink to="/produits" class="btn btn-secondary">
                    Explorer maintenant
                </RouterLink>
            </div>
        </section>

        <!-- Featured Categories -->
        <section class="section">
            <div class="container">
                <h2 class="section-title">Catégories populaires</h2>
                <div v-if="productStore.loading" class="loading">Chargement des categories...</div>
                <div v-else class="categories-grid">
                    <TypeCard 
                        v-for="type in featuredTypes" 
                        :key="type"
                        :type="type"
                    />
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useProductStore } from '../stores/products';
import ProductGrid from '../Components/ProductGrid.vue';
import BrandCard from '../Components/BrandCard.vue';
import TypeCard from '../Components/TypeCard.vue';

const productStore = useProductStore();

onMounted(() => {
    productStore.loadProducts();
});

const featuredTypes = computed(() => {
    const priorityTypes = ['lipstick', 'foundation', 'mascara', 'eyeliner', 'blush', 'nail_polish'];
    
    // Filtrer pour ne retourner que les types qui existent dans les données
    return priorityTypes.filter(type => 
        productStore.products.some(p => p.product_type === type)
    ).slice(0, 6);
});

const featuredBrands = computed(() => {
    const priorityBrands = ['maybelline', 'fenty', 'revlon', 'covergirl', 'nyx', 'clinique', 'dior'];
    return priorityBrands.filter(brand => 
        productStore.products.some(p => p.brand === brand)
    ).slice(0, 6);
});

const recentProducts = computed(() => {
    return productStore.products.slice(0, 8);
});
</script>

<style scoped>
.hero-content {
    max-width: 800px;
    margin: 0 auto;
}

.view-all-btn {
    padding: 12px 24px;
    background-color: transparent;
    color: #000;
    border: 1px solid #000;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    font-family: 'Montserrat', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.2s ease;
    display: inline-block;
}

.view-all-btn:hover {
    background-color: #000;
    color: #fff;
}

.products-grid-wrapper {
    display: flex;
    justify-content: center;
}

.products-grid-wrapper :deep(.product-container) {
    width: 100%;
}

.products-grid-wrapper :deep(.products-grid) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--spacing-lg);
}

.products-grid-wrapper :deep(.products-grid > div) {
    flex: none;
    min-width: auto;
}

.products-grid-wrapper :deep(.pagination) {
    display: none;
}

@media (max-width: 768px) {
    .flex-center {
        flex-direction: column;
        align-items: stretch;
    }

    .view-all-btn {
        font-size: 0.75rem;
        padding: 10px 18px;
    }

    .products-grid-wrapper :deep(.products-grid) {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }
}
</style>
