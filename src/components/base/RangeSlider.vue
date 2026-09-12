<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
  }
)

const model = defineModel<number>({ default: 1 })

const percent = computed(() => {
  if (props.max === props.min) return 0
  return Math.min(100, Math.max(0, ((model.value - props.min) / (props.max - props.min)) * 100))
})

const position = computed(
  () => `calc(${percent.value}% + (0.5 - ${percent.value / 100}) * var(--thumb-size))`
)
</script>

<template>
  <div class="group relative flex h-14 w-full select-none items-center [--thumb-size:1.1rem]">
    <div class="absolute inset-x-0 h-1.5 rounded-full bg-slate-800" />

    <div
      class="gradient-spectrum absolute left-0 h-1.5 rounded-full"
      :style="{ width: position }" />

    <input
      v-model.number="model"
      :min="min"
      :max="max"
      :step="step"
      type="range"
      class="slider-input absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none bg-transparent outline-none" />

    <div
      class="pointer-events-none absolute bottom-[calc(50%+18px)] z-20 -translate-x-1/2 rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs font-medium text-slate-300 shadow-sm transition-all duration-150 ease-out group-hover:border-slate-500 group-hover:text-white"
      :style="{ left: position }">
      {{ model }}
    </div>
  </div>
</template>

<style scoped>
.slider-input::-webkit-slider-runnable-track {
  height: 0.375rem;
  background: transparent;
}

.slider-input::-moz-range-track {
  height: 0.375rem;
  background: transparent;
}

.slider-input::-webkit-slider-thumb {
  appearance: none;
  margin-top: -0.3rem;
  box-sizing: border-box;
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: 9999px;
  border: 2px solid #ffffff;
  background-color: #e0f2fe;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s ease;
}

.slider-input::-moz-range-thumb {
  box-sizing: border-box;
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: 9999px;
  border: 2px solid #ffffff;
  background-color: #e0f2fe;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s ease;
}

.slider-input:hover::-webkit-slider-thumb {
  transform: scale(1.1);
}

.slider-input:hover::-moz-range-thumb {
  transform: scale(1.1);
}
</style>
