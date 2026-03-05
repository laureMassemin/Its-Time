<template>
    <nav class="navbar">
        <div class="navbar-container">
            <RouterLink to="/" class="navbar-brand">Its-Time</RouterLink>
            
            <div class="navbar-menu">
                <div class="menu-item">
                    <button class="menu-toggle" @click="toggleSubmenu('brands')">
                        <span>Marques</span>
                        <span class="arrow" :class="{ open: openMenus.brands }">›</span>
                    </button>
                    <div class="submenu" v-show="openMenus.brands">
                        <RouterLink 
                            v-for="brand in brands" 
                            :key="brand" 
                            :to="`/marque/${brand}`"
                            class="submenu-item"
                            @click="openMenus.brands = false">
                            {{ brand }}
                        </RouterLink>
                    </div>
                </div>
                
                <div class="menu-item">
                    <button class="menu-toggle" @click="toggleSubmenu('types')">
                        <span>Types de produits</span>
                        <span class="arrow" :class="{ open: openMenus.types }">›</span>
                    </button>
                    <div class="submenu" v-show="openMenus.types">
                        <RouterLink 
                            v-for="type in types" 
                            :key="type" 
                            :to="`/type/${type}`"
                            class="submenu-item"
                            @click="openMenus.types = false">
                            {{ type }}
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import api from '../../fichier';

const openMenus = ref({
    brands: false,
    types: false
});

const brands = ref([]);
const types = ref([]);

const toggleSubmenu = (menu) => {
    openMenus.value[menu] = !openMenus.value[menu];
};

const loadMenuData = async () => {
    try {
        const response = await api.get('/api/v1/products.json');
        const data = Array.isArray(response.data) ? response.data : response.data.products || [];
        
        // Filtrer uniquement les produits avec prix valide
        const validProducts = data.filter(product => {
            const price = parseFloat(product.price);
            return product.price && !isNaN(price) && price > 0;
        });
        
        brands.value = [...new Set(validProducts.map(p => p.brand).filter(Boolean))].sort();
        types.value = [...new Set(validProducts.map(p => p.product_type).filter(Boolean))].sort();
    } catch (error) {
        console.error('Erreur menu:', error);
    }
};

onMounted(() => {
    loadMenuData();
});
</script>

<style scoped>
.navbar {
    background: white;
    border-bottom: 1px solid #ddd;
    font-family: 'Montserrat', sans-serif;
    position: sticky;
    top: 0;
    z-index: 100;
}

.navbar-container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    height: 60px;
    gap: 40px;
}

.navbar-brand {
    font-size: 1.3rem;
    font-weight: 700;
    color: #333;
    min-width: 120px;
    text-decoration: none;
    transition: color 0.2s ease;
}

.navbar-brand:hover {
    color: #000;
}

.navbar-menu {
    display: flex;
    gap: 30px;
    flex: 1;
}

.menu-item {
    position: relative;
}

.menu-toggle {
    background: none;
    border: none;
    padding: 8px 0;
    font-size: 0.9rem;
    cursor: pointer;
    color: #333;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color 0.2s ease;
}

.menu-toggle:hover {
    color: #000;
}

.arrow {
    display: inline-block;
    transition: transform 0.2s ease;
    font-size: 1.2rem;
    line-height: 1;
}

.arrow.open {
    transform: rotate(90deg);
}

.submenu {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #ddd;
    border-top: none;
    min-width: 200px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
}

.submenu-item {
    display: block;
    padding: 8px 16px;
    color: #666;
    text-decoration: none;
    font-size: 0.85rem;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.submenu-item:hover {
    background-color: #f5f5f5;
    color: #000;
}

.submenu::-webkit-scrollbar {
    width: 6px;
}

.submenu::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.submenu::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
}

@media (max-width: 768px) {
    .navbar-container {
        flex-direction: column;
        height: auto;
        gap: 15px;
        padding: 15px 20px;
    }
    
    .navbar-menu {
        width: 100%;
        flex-direction: column;
        gap: 10px;
    }
    
    .submenu {
        position: static;
        border: none;
        background: #f8f8f8;
        max-height: 150px;
    }
}
</style>
