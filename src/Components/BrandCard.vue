<template>
    <RouterLink 
        :to="`/marque/${brand}`"
        class="catalog-card card card-unified card-padding link"
        @click="scrollToTop"
    >
        <div class="catalog-card-media">
            <img 
                :src="brandImage" 
                :alt="brand"
                @error="handleImageError"
            />
        </div>
        <div class="catalog-card-title" style="text-transform: capitalize;">{{ brand }}</div>
        <div v-if="showCount" class="catalog-card-subtitle">{{ productCount }} produits</div>
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


