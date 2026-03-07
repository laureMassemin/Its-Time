<template>
    <RouterLink 
        :to="`/marque/${brand}`"
        class="brand-card"
        @click="scrollToTop"
    >
        <div class="brand-image-container">
            <img 
                :src="brandImage" 
                :alt="brand"
                @error="handleImageError"
                class="brand-image"
            />
        </div>
        <div class="brand-name">{{ brand }}</div>
        <div v-if="showCount" class="brand-count">{{ productCount }} produits</div>
    </RouterLink>
</template>

<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useProductStore } from '../stores/products';

const props = defineProps({
    brand: {
        type: String,
        required: true
    },
    showCount: {
        type: Boolean,
        default: false
    }
});

const productStore = useProductStore();
const imageError = ref(false);

const productCount = computed(() => {
    return productStore.products.filter(p => p.brand === props.brand).length;
});

const brandImage = computed(() => {
    if (imageError.value) {
        return '/assets/brands/default.png';
    }
    // Convertir le nom de la marque en minuscules et remplacer les espaces
    const brandSlug = props.brand.toLowerCase().replace(/\s+/g, '-');
    return `/assets/brands/${brandSlug}.png`;
});

const handleImageError = (e) => {
    if (!imageError.value) {
        imageError.value = true;
        // Essayer avec .jpg
        const brandSlug = props.brand.toLowerCase().replace(/\s+/g, '-');
        e.target.src = `/assets/brands/${brandSlug}.jpg`;
        e.target.onerror = () => {
            // Si .jpg échoue aussi, utiliser l'image par défaut
            e.target.src = '/assets/brands/default.png';
        };
    }
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};
</script>

<style scoped>
.brand-card {
    background: white;
    padding: 30px;
    text-align: center;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.brand-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.brand-image-container {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
}

.brand-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.brand-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    text-transform: capitalize;
}

.brand-count {
    font-size: 0.85rem;
    color: #666;
}
</style>
