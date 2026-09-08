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

const rangeStyle = computed(() => ({
  left: `${minPercent.value}%`,
  width: `${maxPercent.value - minPercent.value}%`,
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
  <div class="group w-full select-none">
    <div class="relative h-20">
      <!-- Base track -->
      <div class="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-gray-700" />

      <!-- Active range -->
      <div
        class="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-linear-to-r from-[#0E99F9] via-[#9761E8] to-[#FB8E51] shadow-[0_0_14px_rgba(151,97,232,0.18)]"
        :style="rangeStyle"
      />

      <!-- Min thumb -->
      <input
        :value="model.min"
        :min="min"
        :max="max"
        :step="step"
        type="range"
        class="pointer-events-none absolute inset-0 z-20 h-full w-full touch-none select-none appearance-none bg-transparent outline-none [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#F5F6FA] [&::-webkit-slider-thumb]:bg-[#D8E9FF] [&::-webkit-slider-thumb]:shadow-[0_0_0_7px_rgba(216,233,255,0.08)] [&::-webkit-slider-thumb]:transition [&::-webkit-slider-thumb]:duration-150 hover:[&::-webkit-slider-thumb]:scale-110 hover:[&::-webkit-slider-thumb]:shadow-[0_0_0_9px_rgba(151,97,232,0.12)] [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#F5F6FA] [&::-moz-range-thumb]:bg-[#D8E9FF] [&::-moz-range-thumb]:shadow-[0_0_0_7px_rgba(216,233,255,0.08)]"
        @input="updateMin(Number(($event.target as HTMLInputElement).value))"
      />

      <!-- Max thumb -->
      <input
        :value="model.max"
        :min="min"
        :max="max"
        :step="step"
        type="range"
        class="pointer-events-none absolute inset-0 z-30 h-full w-full touch-none select-none appearance-none bg-transparent outline-none [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#F5F6FA] [&::-webkit-slider-thumb]:bg-[#D8E9FF] [&::-webkit-slider-thumb]:shadow-[0_0_0_7px_rgba(216,233,255,0.08)] [&::-webkit-slider-thumb]:transition [&::-webkit-slider-thumb]:duration-150 hover:[&::-webkit-slider-thumb]:scale-110 hover:[&::-webkit-slider-thumb]:shadow-[0_0_0_9px_rgba(151,97,232,0.12)] [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#F5F6FA] [&::-moz-range-thumb]:bg-[#D8E9FF] [&::-moz-range-thumb]:shadow-[0_0_0_7px_rgba(216,233,255,0.08)]"
        @input="updateMax(Number(($event.target as HTMLInputElement).value))"
      />

      <!-- Min tooltip -->
      <div
        class="pointer-events-none absolute bottom-[calc(50%+14px)] z-40 -translate-x-1/2 select-none opacity-60 scale-95 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100"
        :style="{ left: `${minPercent}%` }"
      >
        <div
          class="relative rounded-md border border-[#282D3F] bg-[#151823] px-2.5 py-1 text-xs font-medium text-[#8C95A7] shadow-sm transition-all duration-200 ease-out group-hover:border-white group-hover:bg-[#F5F6FA] group-hover:text-[#07080D] group-hover:font-bold group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
        >
          {{ model.min }}

          <span
            class="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-[#282D3F] bg-[#151823] transition-all duration-200 ease-out group-hover:border-white group-hover:bg-[#F5F6FA]"
          />
        </div>
      </div>

      <!-- Max tooltip -->
      <div
        class="pointer-events-none absolute bottom-[calc(50%+14px)] z-40 -translate-x-1/2 select-none opacity-60 scale-95 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100"
        :style="{ left: `${maxPercent}%` }"
      >
        <div
          class="relative rounded-md border border-[#282D3F] bg-[#151823] px-2.5 py-1 text-xs font-medium text-[#8C95A7] shadow-sm transition-all duration-200 ease-out group-hover:border-white group-hover:bg-[#F5F6FA] group-hover:text-[#07080D] group-hover:font-bold group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
        >
          {{ model.max }}

          <span
            class="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-[#282D3F] bg-[#151823] transition-all duration-200 ease-out group-hover:border-white group-hover:bg-[#F5F6FA]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
