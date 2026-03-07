<template>
    <RouterLink 
        :to="`/type/${type}`"
        class="catalog-card card card-unified card-padding link"
        @click="scrollToTop"
    >
        <div class="catalog-card-media">
            <img 
                :src="typeImage" 
                :alt="formattedName"
                @error="handleImageError"
            />
        </div>
        <h3 class="catalog-card-title">{{ formattedName }}</h3>
        <p class="catalog-card-subtitle">{{ productCount }} produits</p>
    </RouterLink>
</template>

<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useProductStore } from '../stores/products';
import { formatProductType } from '../utils/formatters';

const props = defineProps({
    type: {
        type: String,
        required: true
    }
});

const productStore = useProductStore();
const imageError = ref(false);

const formattedName = computed(() => formatProductType(props.type));

const productCount = computed(() => {
    return productStore.products.filter(p => p.product_type === props.type).length;
});

const typeImage = computed(() => {
    if (imageError.value) {
        return '/assets/types/default.png';
    }
    // Essayer .png d'abord, .jpg en cas d'erreur
    return `/assets/types/${props.type}.png`;
});

const handleImageError = (e) => {
    if (!imageError.value) {
        imageError.value = true;
        // Essayer avec .jpg
        e.target.src = `/assets/types/${props.type}.jpg`;
        e.target.onerror = () => {
            // Si .jpg échoue aussi, utiliser l'image par défaut
            e.target.src = '/assets/types/default.png';
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


