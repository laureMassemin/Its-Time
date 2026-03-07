<template>
    <div class="search-bar">
        <input
            :value="modelValue"
            type="text"
            class="search-input"
            :placeholder="placeholder"
            @input="$emit('update:modelValue', $event.target.value)"
        />
        <button
            v-if="modelValue"
            class="clear-btn"
            type="button"
            aria-label="Effacer la recherche"
            title="Effacer la recherche"
            @click="$emit('update:modelValue', '')"
        >
            ×
        </button>
    </div>
</template>

<script setup>
defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Rechercher un produit, une marque ou un type...'
    }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.search-bar {
    position: relative;
    width: 100%;
    max-width: 560px;
    margin: 0 auto;
}

.search-input {
    width: 100%;
    height: 48px;
    border: 1px solid var(--border-color-light);
    border-radius: var(--radius-sm);
    padding: 0 42px 0 14px;
    font-size: 0.95rem;
    color: var(--text-secondary);
    background: var(--bg-white);
    outline: none;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.search-input:focus {
    border-color: var(--color-black);
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
}

.clear-btn {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 1.2rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.clear-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}
</style>