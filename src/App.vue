<script setup>
import { onMounted } from 'vue';
import Navbar from './Components/Navbar.vue';
import { useProductStore } from './stores/products';

const productStore = useProductStore();

onMounted(() => {
    productStore.loadProducts();
});
</script>

<template>
  <Navbar></Navbar>
  <RouterView></RouterView>
</template>

<style scoped></style>
