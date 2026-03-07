<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-columns">
                <div class="footer-column">
                    <h3 class="footer-title">Its-Time</h3>
                    <p class="footer-description">
                        Votre destination beauté en ligne. Découvrez une sélection de produits de maquillage des meilleures marques.
                    </p>
                </div>

                <div class="footer-column">
                    <h4 class="footer-heading">Navigation</h4>
                    <ul class="footer-links">
                        <li><RouterLink to="/" @click="scrollToTop">Accueil</RouterLink></li>
                        <li><RouterLink to="/marques" @click="scrollToTop">Toutes les marques</RouterLink></li>
                        <li><RouterLink to="/categories" @click="scrollToTop">Toutes les catégories</RouterLink></li>
                        <li><RouterLink to="/favoris" @click="scrollToTop">Mes favoris</RouterLink></li>
                        <li><RouterLink to="/panier" @click="scrollToTop">Mon panier</RouterLink></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h4 class="footer-heading">Informations</h4>
                    <ul class="footer-links">
                        <li><a href="#" @click.prevent>À propos</a></li>
                        <li><a href="#" @click.prevent>Conditions d'utilisation</a></li>
                        <li><a href="#" @click.prevent>Politique de confidentialité</a></li>
                        <li><a href="#" @click.prevent>Contact</a></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h4 class="footer-heading">Suivez-nous</h4>
                    <ul class="footer-links">
                        <li><a href="#" @click.prevent>Instagram</a></li>
                        <li><a href="#" @click.prevent>Facebook</a></li>
                        <li><a href="#" @click.prevent>Twitter</a></li>
                        <li><a href="#" @click.prevent>Pinterest</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; {{ currentYear }} Its-Time. Tous droits réservés.</p>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const currentYear = computed(() => new Date().getFullYear());

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};
</script>

<style scoped>
.footer {
    background-color: #1a1a1a;
    color: #ffffff;
    margin-top: 80px;
    font-family: 'Montserrat', sans-serif;
}

.footer-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 60px 32px 30px;
}

.footer-columns {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-column {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.footer-title {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0 0 10px 0;
    color: #ffffff;
}

.footer-description {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #b0b0b0;
    margin: 0;
}

.footer-heading {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 15px 0;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.footer-links li a {
    color: #b0b0b0;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s ease;
}

.footer-links li a:hover {
    color: #ffffff;
}

.footer-bottom {
    padding-top: 30px;
    border-top: 1px solid #333;
    text-align: center;
}

.footer-bottom p {
    margin: 0;
    font-size: 0.85rem;
    color: #808080;
}

@media (max-width: 1024px) {
    .footer-columns {
        grid-template-columns: 1fr 1fr;
        gap: 30px;
    }
}

@media (max-width: 768px) {
    .footer-container {
        padding: 40px 20px 20px;
    }

    .footer-columns {
        grid-template-columns: 1fr;
        gap: 30px;
        margin-bottom: 30px;
    }

    .footer-title {
        font-size: 1.5rem;
    }

    .footer-heading {
        font-size: 0.95rem;
    }

    .footer-links li a {
        font-size: 0.85rem;
    }
}
</style>
