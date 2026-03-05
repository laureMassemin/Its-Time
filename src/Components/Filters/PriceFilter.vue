<template>
    <div class="filter-section price-filter-section">
        <div class="filter-title" @click="toggleExpanded">
            <span>Prix</span>
            <span class="toggle-icon">{{ isExpanded ? '−' : '+' }}</span>
        </div>
        <div class="filter-options price-filter-options" v-show="isExpanded">
            <div class="price-inputs">
                <div class="price-input-group">
                    <label>Min</label>
                    <div class="input-wrapper">
                        <input 
                            type="number" 
                            v-model.number="localRange.min"
                            :min="availableRange.min"
                            :max="localRange.max"
                            class="price-input">
                    </div>
                </div>
                <div class="price-input-group">
                    <label>Max</label>
                    <div class="input-wrapper">
                        <input 
                            type="number" 
                            v-model.number="localRange.max"
                            :min="localRange.min"
                            :max="availableRange.max"
                            class="price-input">
                    </div>
                </div>
            </div>
            
            <div class="range-slider-container">
                <input 
                    type="range" 
                    v-model.number="localRange.min"
                    :min="availableRange.min"
                    :max="availableRange.max"
                    class="range-slider range-slider-min">
                <input 
                    type="range" 
                    v-model.number="localRange.max"
                    :min="availableRange.min"
                    :max="availableRange.max"
                    class="range-slider range-slider-max">
            </div>
            
            <button class="reset-price-btn" @click="resetPrice">RETOUR</button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    availableRange: {
        type: Object,
        default: () => ({ min: 0, max: 10000 })
    }
});

const emit = defineEmits(['update:modelValue']);

const isExpanded = ref(false);

const localRange = reactive({
    min: props.modelValue.min,
    max: props.modelValue.max
});

const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value;
};

const resetPrice = () => {
    localRange.min = props.availableRange.min;
    localRange.max = props.availableRange.max;
};

watch(localRange, () => {
    emit('update:modelValue', { ...localRange });
}, { deep: true });

watch(() => props.modelValue, (newVal) => {
    localRange.min = newVal.min;
    localRange.max = newVal.max;
});
</script>

<style scoped>
.filter-section {
    background: transparent;
}

.price-filter-section {
    padding-top: 12px;
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

.price-filter-options {
    max-height: 100%;
    overflow: visible;
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.price-inputs {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.price-input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.price-input-group label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #333;
    text-transform: uppercase;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 2px;
    overflow: hidden;
    transition: border-color 0.2s;
}

.input-wrapper:hover {
    border-color: #d4364f;
}

.price-input {
    width: 100%;
    padding: 6px 12px;
    border: none;
    font-size: 0.85rem;
    background: transparent;
    outline: none;
}

.price-input::-webkit-outer-spin-button,
.price-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.range-slider-container {
    position: relative;
    height: 5px;
    margin: 16px 0 12px 0;
}

.range-slider {
    position: absolute;
    width: 100%;
    height: 5px;
    top: 0;
    background: transparent;
    -webkit-appearance: none;
    appearance: none;
    pointer-events: none;
    outline: none;
}

.range-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #d4364f;
    cursor: pointer;
    pointer-events: auto;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
}

.range-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 6px rgba(212, 54, 79, 0.3);
}

.range-slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #d4364f;
    cursor: pointer;
    pointer-events: auto;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
}

.range-slider::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 6px rgba(212, 54, 79, 0.3);
}

.range-slider-min {
    z-index: 5;
}

.range-slider-max {
    z-index: 4;
}

.range-slider::-webkit-slider-runnable-track {
    background: linear-gradient(to right, #ddd, #d4364f 0%, #d4364f 100%, #ddd);
    height: 5px;
    border-radius: 2px;
}

.range-slider::-moz-range-track {
    background: linear-gradient(to right, #ddd, #d4364f 0%, #d4364f 100%, #ddd);
    height: 5px;
    border-radius: 2px;
    border: none;
}

.reset-price-btn {
    padding: 6px 12px;
    background-color: transparent;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 0;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.5px;
}

.reset-price-btn:hover {
    color: #d4364f;
    border-color: #d4364f;
}
</style>
