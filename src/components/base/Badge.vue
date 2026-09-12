<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    colorIndex?: number
    href?: string
    size?: 'small' | 'regular'
  }>(),
  { colorIndex: 0, size: 'small', href: undefined }
)

const colorVariants = [
  'border-sky-400 bg-slate-950/80 text-sky-100',
  'border-purple-500 bg-slate-950/80 text-purple-100',
  'border-orange-500 bg-slate-950/80 text-orange-100',
  'border-pink-500 bg-slate-950/80 text-pink-100',
]

const hoverVariants = [
  'hover:border-sky-300 hover:bg-sky-950/90 hover:shadow-md hover:shadow-sky-400/30',
  'hover:border-purple-400 hover:bg-purple-950/90 hover:shadow-md hover:shadow-purple-500/30',
  'hover:border-orange-400 hover:bg-orange-950/90 hover:shadow-md hover:shadow-orange-500/30',
  'hover:border-pink-400 hover:bg-pink-950/90 hover:shadow-md hover:shadow-pink-500/30',
]

const activeIndex = computed(
  () => ((props.colorIndex % colorVariants.length) + colorVariants.length) % colorVariants.length
)
</script>

<template>
  <component
    :is="href ? 'a' : 'span'"
    :href="href"
    class="inline-flex min-w-16 items-center justify-center rounded-full border-2 font-semibold tracking-wide whitespace-nowrap transition-all duration-200 motion-reduce:transition-none"
    :class="[
      colorVariants[activeIndex],
      href && hoverVariants[activeIndex],
      size === 'regular' ? 'px-3.5 py-1 text-sm' : 'px-2.5 py-0.5 text-xs',
      href && 'cursor-pointer hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2',
    ]">
    <slot />
  </component>
</template>
