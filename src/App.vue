<script setup>
import { onMounted } from 'vue';
import Navbar from './Components/Navbar.vue';
import Footer from './Components/Footer.vue';
import { useProductStore } from './stores/products';

const productStore = useProductStore();

onMounted(() => {
    productStore.loadProducts();
});
</script>

<template>
  <Navbar></Navbar>
  <RouterView></RouterView>
  <Footer></Footer>
</template>

<style scoped></style>
