<template>
    <nav class="navbar">
        <div class="navbar-container">
            <RouterLink to="/" class="navbar-brand">Its-Time</RouterLink>

            <button
                class="mobile-menu-btn"
                type="button"
                :aria-expanded="isMobileMenuOpen"
                aria-label="Ouvrir le menu"
                @click="toggleMobileMenu"
            >
                {{ isMobileMenuOpen ? '✕' : '☰' }}
            </button>

            <div class="navbar-menu" :class="{ open: isMobileMenuOpen }">
                <RouterLink to="/produits" class="menu-link" @click="closeMobileMenu">Produits</RouterLink>
                
                <div class="menu-item">
                    <button class="menu-trigger" @click="toggleSubmenu('brands')">
                        <span>Marques</span>
                        <span class="arrow" :class="{ open: openMenus.brands }">↓</span>
                    </button>
                    <div class="mega-menu" v-show="openMenus.brands">
                        <div v-if="productStore.loading" class="mega-menu-loading">Chargement des marques...</div>
                        <div v-else class="mega-menu-content">
                            <div class="mega-menu-column" v-for="(column, index) in brandsColumns" :key="index">
                                <div v-for="brand in column" :key="brand">
                                    <RouterLink
                                        :to="`/marque/${brand}`"
                                        class="mega-menu-item"
                                        @click="handleMenuNavigation('brands')"
                                    >
                                        <img 
                                            :src="getBrandImage(brand)" 
                                            :alt="brand"
                                            class="menu-icon"
                                            @error="(e) => handleBrandImageError(e, brand)"
                                        />
                                        <span>{{ formatProductType(brand) }}</span>
                                    </RouterLink>
                                </div>
                            </div>
                        </div>
                        <div class="mega-menu-footer">
                            <RouterLink to="/marques" class="mega-menu-footer-link" @click="handleMenuNavigation('brands')">
                                Voir toutes les marques
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <div class="menu-item">
                    <button class="menu-trigger" @click="toggleSubmenu('types')">
                        <span>Types de produits</span>
                        <span class="arrow" :class="{ open: openMenus.types }">↓</span>
                    </button>
                    <div class="mega-menu" v-show="openMenus.types">
                        <div v-if="productStore.loading" class="mega-menu-loading">Chargement des types...</div>
                        <div v-else class="mega-menu-content">
                            <div class="mega-menu-column" v-for="(column, index) in typesColumns" :key="index">
                                <div v-for="type in column" :key="type">
                                    <RouterLink
                                        :to="`/type/${type}`"
                                        class="mega-menu-item"
                                        @click="handleMenuNavigation('types')"
                                    >
                                        <img 
                                            :src="getTypeImage(type)" 
                                            :alt="type"
                                            class="menu-icon"
                                            @error="(e) => handleTypeImageError(e, type)"
                                        />
                                        <span>{{ formatProductType(type) }}</span>
                                    </RouterLink>
                                </div>
                            </div>
                        </div>
                        <div class="mega-menu-footer">
                            <RouterLink to="/categories" class="mega-menu-footer-link" @click="handleMenuNavigation('types')">
                                Voir toutes les catégories
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>

            <div class="navbar-actions">
                <RouterLink to="/favoris" class="icon-link" aria-label="Voir les favoris">
                    <span class="action-icon">♥</span>
                    <span v-if="favoritesStore.totalItems > 0" class="item-badge">{{ favoritesStore.totalItems }}</span>
                </RouterLink>

                <RouterLink to="/panier" class="icon-link" aria-label="Voir le panier">
                    <span class="action-icon">🛒</span>
                    <span v-if="cartStore.totalItems > 0" class="item-badge">{{ cartStore.totalItems }}</span>
                </RouterLink>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useFavoritesStore } from '../stores/favorites';
import { useProductStore } from '../stores/products';
import { formatProductType } from '../utils/formatters';

const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();
const productStore = useProductStore();

const openMenus = ref({
    brands: false,
    types: false
});

const isMobileMenuOpen = ref(false);

const closeSubmenus = () => {
    openMenus.value.brands = false;
    openMenus.value.types = false;
};

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
    closeSubmenus();
};

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
    if (!isMobileMenuOpen.value) {
        closeSubmenus();
    }
};

const toggleSubmenu = (menu) => {
    if (menu === 'brands') {
        openMenus.value.types = false;
    }
    if (menu === 'types') {
        openMenus.value.brands = false;
    }
    openMenus.value[menu] = !openMenus.value[menu];
};

const handleMenuNavigation = (menu) => {
    openMenus.value[menu] = false;
    closeMobileMenu();
};

const getBrandImage = (brand) => {
    const brandSlug = brand.toLowerCase().replace(/\s+/g, '-');
    return `/assets/brands/${brandSlug}.png`;
};

const getTypeImage = (type) => {
    return `/assets/types/${type}.png`;
};

const handleBrandImageError = (event, brand) => {
    const brandSlug = brand.toLowerCase().replace(/\s+/g, '-');
    const target = event.target;
    if (target.src.endsWith('.png')) {
        target.src = `/assets/brands/${brandSlug}.jpg`;
    } else {
        target.src = '/assets/brands/default.png';
    }
};

const handleTypeImageError = (event, type) => {
    const target = event.target;
    if (target.src.endsWith('.png')) {
        target.src = `/assets/types/${type}.jpg`;
    } else {
        target.src = '/assets/types/default.png';
    }
};

const brandsColumns = computed(() => {
    const itemsPerColumn = 6;
    const maxColumns = 4;
    const numColumns = Math.min(Math.ceil(productStore.brands.length / itemsPerColumn), maxColumns);
    const columns = [];
    for (let i = 0; i < numColumns; i++) {
        const start = i * itemsPerColumn;
        columns.push(productStore.brands.slice(start, start + itemsPerColumn));
    }
    return columns.filter(col => col.length > 0);
});

const typesColumns = computed(() => {
    const itemsPerColumn = 6;
    const maxColumns = 4;
    const numColumns = Math.min(Math.ceil(productStore.types.length / itemsPerColumn), maxColumns);
    const columns = [];
    for (let i = 0; i < numColumns; i++) {
        const start = i * itemsPerColumn;
        columns.push(productStore.types.slice(start, start + itemsPerColumn));
    }
    return columns.filter(col => col.length > 0);
});

onMounted(() => {
    productStore.loadProducts();
});
</script>

<style scoped>
.navbar {
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.navbar-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    align-items: center;
    height: 72px;
    gap: 56px;
}

.mobile-menu-btn {
    display: none;
    border: 1px solid #e6e6e6;
    background: #fff;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
    line-height: 1;
    cursor: pointer;
    color: #1a1a1a;
}

.navbar-brand {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: #1a1a1a;
    min-width: 140px;
    text-decoration: none;
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'Montserrat', sans-serif;
}

.navbar-brand:hover {
    color: #000;
}

.navbar-menu {
    display: flex;
    gap: 48px;
    flex: 1;
    align-items: center;
}

.menu-link {
    display: flex;
    align-items: center;
    padding: 8px 2px;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: #1a1a1a;
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.3s ease;
    height: 72px;
}

.menu-link:hover {
    color: #d4364f;
}

.menu-item {
    position: relative;
    height: 72px;
    display: flex;
    align-items: center;
}

.menu-trigger {
    background: none;
    border: none;
    padding: 8px 2px;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.3px;
    cursor: pointer;
    color: #1a1a1a;
    font-family: 'Montserrat', sans-serif;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color 0.3s ease;
    text-transform: uppercase;
    position: relative;
}

.menu-trigger:hover {
    color: #d4364f;
}

.menu-trigger::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    right: 0;
    height: 2px;
    background: #d4364f;
    transform: scaleX(0);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-trigger:hover::after {
    transform: scaleX(1);
}

.arrow {
    display: none;
}

.mega-menu {
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    width: 100%;
    background: #ffffff;
    border: none;
    border-top: 2px solid #d4364f;
    border-radius: 0;
    z-index: 1000;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                visibility 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
}

.mega-menu-loading {
    padding: 20px;
    color: #666;
    font-size: 0.9rem;
}

.menu-item:hover .mega-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: all;
}

.mega-menu-content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    padding: 40px 52px;
    max-height: 30vh;
    overflow-y: auto;
}

.mega-menu-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.mega-menu-column-title {
    font-size: 0.85rem;
    font-weight: 700;
    color: #1a1a1a;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
}

.mega-menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #666;
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 400;
    letter-spacing: 0.1px;
    transition: color 0.2s ease, padding-left 0.2s ease;
    padding-left: 0;
}

.menu-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
    flex-shrink: 0;
}

.mega-menu-item:hover {
    color: #d4364f;
    padding-left: 6px;
}

.mega-menu-footer {
    padding: 20px 52px;
    border-top: 1px solid #f0f0f0;
    background: #fafafa;
}

.mega-menu-footer-link {
    display: inline-block;
    color: #d4364f;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    transition: color 0.3s ease;
    padding: 10px 16px;
    border: 1px solid #d4364f;
    border-radius: 4px;
}

.mega-menu-footer-link:hover {
    background-color: #d4364f;
    color: white;
}

.navbar-actions {
    display: flex;
    align-items: center;
    gap: 28px;
    margin-left: auto;
}

.icon-link {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    padding: 12px;
    transition: transform 0.2s ease;
}

.icon-link:hover {
    transform: scale(1.15);
}

.action-icon {
    font-size: 1.4rem;
    color: #1a1a1a;
}

.item-badge {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #d4364f;
    color: white;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 2px 5px;
    border-radius: 8px;
    min-width: 18px;
    text-align: center;
}

@media (max-width: 992px) {
    .navbar-container {
        padding: 0 24px;
        gap: 40px;
    }

    .navbar-menu {
        gap: 32px;
    }

    .mega-menu {
        left: 0;
        right: 0;
    }

    .mega-menu-content {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        padding: 28px 32px;
    }

    .mega-menu-column {
        gap: 14px;
    }

    .mega-menu-footer {
        padding: 16px 32px;
    }
}

@media (max-width: 768px) {
    .navbar-container {
        display: grid;
        grid-template-columns: 1fr auto auto;
        grid-template-areas:
            "brand actions toggle"
            "menu menu menu";
        height: auto;
        gap: 10px;
        padding: 12px 14px;
        align-items: center;
    }

    .navbar-brand {
        grid-area: brand;
        min-width: 0;
        font-size: 1.2rem;
    }

    .mobile-menu-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        grid-area: toggle;
    }

    .navbar-menu {
        grid-area: menu;
        width: 100%;
        display: none;
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        padding-top: 6px;
    }

    .navbar-menu.open {
        display: flex;
    }

    .menu-link,
    .menu-trigger {
        width: 100%;
        height: auto;
        min-height: 42px;
        border: 1px solid #ececec;
        border-radius: 8px;
        background: #fff;
        justify-content: space-between;
        padding: 10px 12px;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.2px;
    }

    .menu-item {
        height: auto;
        width: 100%;
    }

    .menu-trigger::after {
        display: none;
    }

    .arrow {
        display: inline-block;
        transition: transform 0.3s ease;
        font-size: 0.7rem;
        line-height: 1;
    }

    .arrow.open {
        transform: rotate(180deg);
    }

    .navbar-actions {
        grid-area: actions;
        margin-left: 0;
        align-self: center;
        gap: 8px;
    }

    .icon-link {
        padding: 8px;
    }

    .mega-menu {
        position: static;
        top: auto;
        transform: none;
        border: none;
        border-top: 1px solid #f0f0f0;
        background: #fafafa;
        border-radius: 8px;
        box-shadow: none;
        opacity: 1;
        visibility: visible;
        pointer-events: all;
        margin-top: 6px;
    }

    .mega-menu:is([style*="display: none"]) {
        opacity: 0;
        visibility: hidden;
        display: none !important;
    }

    .mega-menu-content {
        grid-template-columns: 1fr;
        gap: 10px;
        padding: 10px;
        max-height: none;
    }

    .mega-menu-column-title {
        display: none;
    }

    .mega-menu-column {
        gap: 6px;
    }

    .mega-menu-item {
        padding: 8px 10px;
        border-radius: 6px;
        background: #fff;
    }

    .mega-menu-item:hover {
        padding-left: 10px;
        color: #1a1a1a;
        background: #f3f3f3;
    }

    .mega-menu-footer {
        padding: 10px;
        text-align: center;
        background: transparent;
    }

    .mega-menu-footer-link {
        width: 100%;
        display: block;
    }
}

@media (max-width: 480px) {
    .navbar-container {
        padding: 10px 12px;
        gap: 8px;
    }

    .navbar-brand {
        font-size: 1.05rem;
    }

    .menu-link,
    .menu-trigger {
        min-height: 40px;
        font-size: 0.74rem;
        padding: 9px 10px;
    }

    .action-icon {
        font-size: 1.2rem;
    }

    .mega-menu-content {
        grid-template-columns: 1fr;
    }
}
</style>
