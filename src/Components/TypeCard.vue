<template>
    <RouterLink 
        :to="`/type/${type}`"
        class="type-card"
        @click="scrollToTop"
    >
        <div class="type-image-container">
            <img 
                :src="typeImage" 
                :alt="formattedName"
                @error="handleImageError"
                class="type-image"
            />
        </div>
        <h3>{{ formattedName }}</h3>
        <p>{{ productCount }} produits</p>
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

<style scoped>
.type-card {
    background: white;
    padding: 40px 20px;
    text-align: center;
    border-radius: 8px;
    text-decoration: none;
    color: #333;
    transition: all 0.3s ease;
    border: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.type-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
}

.type-image-container {
    width: 80px;
    height: 80px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.type-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.type-card h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #333;
}

.type-card p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .type-card {
        padding: 30px 15px;
    }

    .type-image-container {
        width: 60px;
        height: 60px;
    }
}
</style>
