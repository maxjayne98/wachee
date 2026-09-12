<script setup lang="ts">
import { computed } from 'vue'

type RangeValue = {
  min: number
  max: number
}

interface Props {
  min?: number
  max?: number
  step?: number
  showLabels?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
})

const model = defineModel<RangeValue>({
  required: true,
})

const minPercent = computed(() => {
  return ((model.value.min - props.min) / (props.max - props.min)) * 100
})

const maxPercent = computed(() => {
  return ((model.value.max - props.min) / (props.max - props.min)) * 100
})

// Native thumb centers travel from half a thumb inside either end of the input.
const thumbPosition = (percent: number) =>
  `calc(${percent}% + (0.5 - ${percent / 100}) * var(--thumb-size))`

const minPosition = computed(() => thumbPosition(minPercent.value))
const maxPosition = computed(() => thumbPosition(maxPercent.value))
const rangeStyle = computed(() => ({
  left: minPosition.value,
  right: `calc(100% - ${maxPosition.value})`,
}))

function updateMin(value: number) {
  model.value = {
    ...model.value,
    min: Math.min(value, model.value.max - props.step),
  }
}

function updateMax(value: number) {
  model.value = {
    ...model.value,
    max: Math.max(value, model.value.min + props.step),
  }
}
</script>

<template>
  <div class="group w-full select-none [--thumb-size:--spacing(5)]">
    <div class="relative h-20">
      <div
        class="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-slate-800" />

      <div
        class="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full gradient-spectrum shadow-sm shadow-purple-500/30"
        :style="rangeStyle" />

      <input
        :value="model.min"
        :min="min"
        :max="max"
        :step="step"
        type="range"
        class="pointer-events-none absolute inset-0 z-20 m-0 h-full w-full border-0 p-0 touch-none select-none appearance-none bg-transparent outline-none [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:-mt-1.75 [&::-webkit-slider-thumb]:box-border [&::-webkit-slider-thumb]:size-(--thumb-size) [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-sky-100 [&::-webkit-slider-thumb]:shadow-sm hover:[&::-webkit-slider-thumb]:scale-110 hover:[&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:shadow-purple-500/30 [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:size-(--thumb-size) [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-sky-100 [&::-moz-range-thumb]:shadow-sm hover:[&::-moz-range-thumb]:scale-110 hover:[&::-moz-range-thumb]:shadow-md hover:[&::-moz-range-thumb]:shadow-purple-500/30"
        @input="updateMin(Number(($event.target as HTMLInputElement).value))" />

      <!-- Max thumb -->
      <input
        :value="model.max"
        :min="min"
        :max="max"
        :step="step"
        type="range"
        class="pointer-events-none absolute inset-0 z-30 m-0 h-full w-full border-0 p-0 touch-none select-none appearance-none bg-transparent outline-none [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:-mt-1.75 [&::-webkit-slider-thumb]:box-border [&::-webkit-slider-thumb]:size-(--thumb-size) [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-sky-100 [&::-webkit-slider-thumb]:shadow-sm hover:[&::-webkit-slider-thumb]:scale-110 hover:[&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:shadow-purple-500/30 [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:size-(--thumb-size) [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-sky-100 [&::-moz-range-thumb]:shadow-sm hover:[&::-moz-range-thumb]:scale-110 hover:[&::-moz-range-thumb]:shadow-md hover:[&::-moz-range-thumb]:shadow-purple-500/30"
        @input="updateMax(Number(($event.target as HTMLInputElement).value))" />

      <div
        class="pointer-events-none absolute bottom-[calc(50%+14px)] z-40 -translate-x-1/2 select-none opacity-60 scale-95 transition-[opacity,scale] duration-200 ease-out group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100"
        :style="{ left: minPosition }">
        <div
          class="relative rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-400 shadow-sm transition-all duration-200 ease-out group-hover:border-white group-hover:bg-slate-100 group-hover:text-slate-950 group-hover:font-bold group-hover:shadow-lg group-hover:shadow-black/40">
          {{ model.min }}

          <span
            class="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-slate-700 bg-slate-900 transition-all duration-200 ease-out group-hover:border-white group-hover:bg-slate-100" />
        </div>
      </div>

      <div
        class="pointer-events-none absolute bottom-[calc(50%+14px)] z-40 -translate-x-1/2 select-none opacity-60 scale-95 transition-[opacity,scale] duration-200 ease-out group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100"
        :style="{ left: maxPosition }">
        <div
          class="relative rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-400 shadow-sm transition-all duration-200 ease-out group-hover:border-white group-hover:bg-slate-100 group-hover:text-slate-950 group-hover:font-bold group-hover:shadow-lg group-hover:shadow-black/40">
          {{ model.max }}

          <span
            class="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-slate-700 bg-slate-900 transition-all duration-200 ease-out group-hover:border-white group-hover:bg-slate-100" />
        </div>
      </div>
    </div>
  </div>
</template>
