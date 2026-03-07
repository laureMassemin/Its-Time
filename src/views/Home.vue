<template>
    <div class="home">
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <h1 class="hero-title">Découvrez la beauté autrement</h1>
                <p class="hero-subtitle">
                    Explorez notre collection de produits de maquillage des plus grandes marques
                </p>
                <div class="hero-actions">
                    <RouterLink to="/produits" class="btn btn-primary">
                        Voir tous les produits
                    </RouterLink>
                    <RouterLink to="/marques" class="btn btn-secondary">
                        Découvrir les marques
                    </RouterLink>
                </div>
            </div>
        </section>

        <!-- Featured Categories -->
        <section class="featured-section">
            <div class="container">
                <h2 class="section-title">Catégories populaires</h2>
                <div class="categories-grid">
                    <TypeCard 
                        v-for="type in featuredTypes" 
                        :key="type"
                        :type="type"
                    />
                </div>
            </div>
        </section>

        <!-- Featured Brands -->
        <section class="featured-section brands-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Marques vedettes</h2>
                    <RouterLink to="/marques" class="view-all-link">
                        Voir toutes les marques →
                    </RouterLink>
                </div>
                <div class="brands-grid">
                    <BrandCard 
                        v-for="brand in featuredBrands" 
                        :key="brand"
                        :brand="brand"
                    />
                </div>
            </div>
        </section>

        <!-- Recent Products -->
        <section class="featured-section products-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Produits récents</h2>
                    <RouterLink to="/produits" class="view-all-link">
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
                <h2>Prêt à commencer votre shopping beauté ?</h2>
                <p>Rejoignez des milliers de clients satisfaits</p>
                <RouterLink to="/produits" class="btn btn-light">
                    Explorer maintenant
                </RouterLink>
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
    return productStore.brands.slice(0, 8);
});

const recentProducts = computed(() => {
    return productStore.products.slice(0, 8);
});
</script>

<style scoped>
.home {
    font-family: 'Montserrat', sans-serif;
}

.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 120px 32px;
    text-align: center;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin: 0 0 20px 0;
    line-height: 1.2;
}

.hero-subtitle {
    font-size: 1.3rem;
    margin: 0 0 40px 0;
    opacity: 0.95;
    font-weight: 300;
}

.hero-actions {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
}

.btn {
    padding: 16px 40px;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: inline-block;
}

.btn-primary {
    background-color: #000;
    color: #fff;
}

.btn-primary:hover {
    background-color: #333;
    transform: translateY(-2px);
}

.btn-secondary {
    background-color: transparent;
    color: #fff;
    border: 2px solid #fff;
}

.btn-secondary:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.btn-light {
    background-color: #fff;
    color: #667eea;
}

.btn-light:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
}

.featured-section {
    padding: 80px 32px;
}

.brands-section {
    background-color: #f9f9f9;
}

.products-section {
    background-color: #fff;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 40px 0;
    text-align: center;
    color: #333;
}

.section-header .section-title {
    margin: 0;
    text-align: left;
}

.view-all-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    transition: color 0.2s ease;
}

.view-all-link:hover {
    color: #764ba2;
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
}

.brands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
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
    gap: 24px;
}

.products-grid-wrapper :deep(.products-grid > div) {
    flex: none;
    min-width: auto;
}

.products-grid-wrapper :deep(.pagination) {
    display: none;
}

.loading {
    text-align: center;
    padding: 40px;
    color: #666;
    font-size: 1.1rem;
}

.cta-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 100px 32px;
    text-align: center;
}

.cta-content h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 15px 0;
}

.cta-content p {
    font-size: 1.2rem;
    margin: 0 0 30px 0;
    opacity: 0.95;
}

@media (max-width: 768px) {
    .hero {
        padding: 80px 20px;
    }

    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .hero-actions {
        flex-direction: column;
        align-items: stretch;
    }

    .btn {
        padding: 14px 30px;
        font-size: 0.9rem;
    }

    .featured-section {
        padding: 60px 20px;
    }

    .section-title {
        font-size: 1.8rem;
    }

    .categories-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }

    .brands-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .products-grid-wrapper :deep(.products-grid) {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }

    .cta-section {
        padding: 60px 20px;
    }

    .cta-content h2 {
        font-size: 1.8rem;
    }

    .cta-content p {
        font-size: 1rem;
    }
}
</style>
