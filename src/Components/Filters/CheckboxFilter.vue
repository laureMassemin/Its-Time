<template>
    <div class="filter-section">
        <div class="filter-title" @click="toggleExpanded">
            <span>{{ label }}</span>
            <span class="toggle-icon">{{ isExpanded ? '−' : '+' }}</span>
        </div>
        <div class="filter-options" v-show="isExpanded">
            <label 
                v-for="option in availableOptions" 
                :key="option" 
                class="filter-option">
                <input 
                    type="checkbox" 
                    :value="option"
                    v-model="selectedValues">
                <span>{{ formatOption(option) }}</span>
            </label>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formatProductType } from '../../utils/formatters';

const props = defineProps({
    label: String,
    modelValue: Array,
    availableOptions: Array
});

const emit = defineEmits(['update:modelValue']);

const isExpanded = ref(false);

const selectedValues = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value;
};

const formatOption = (option) => {
    // Si l'option contient un underscore, on utilise le formatage
    if (option && option.includes('_')) {
        return formatProductType(option);
    }
    // Sinon on retourne l'option telle quelle
    return option;
};
</script>

<style scoped>
.filter-section {
    background: transparent;
}

.filter-title {
    padding: 8px 0;
    font-size: 0.85rem;
    font-weight: 600;
    color: #333;
    background: transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.filter-title:hover {
    color: #000;
}

.toggle-icon {
    font-size: 1.2rem;
    font-weight: 400;
    color: #666;
}

.filter-options {
    max-height: 120px;
    overflow-y: auto;
    padding: 4px 0;
}

.filter-options::-webkit-scrollbar {
    width: 4px;
}

.filter-options::-webkit-scrollbar-track {
    background: transparent;
}

.filter-options::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
}

.filter-options::-webkit-scrollbar-thumb:hover {
    background: #bbb;
}

.filter-option {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.filter-option:hover {
    background-color: #f5f5f5;
}

.filter-option input[type="checkbox"] {
    margin-right: 8px;
    cursor: pointer;
}

.filter-option span {
    font-size: 0.8rem;
    color: #555;
    user-select: none;
}
</style>
