<script setup lang="ts">
import type { BadgeColor } from '@/utils'

withDefaults(
  defineProps<{
    color?: BadgeColor
    href?: string
  }>(),
  { size: 'small', href: undefined, color: 'sky' }
)

const colorMap: Record<BadgeColor, string> = {
  sky: 'border-sky-400 bg-slate-950/80 text-sky-100',
  purple: 'border-purple-500 bg-slate-950/80 text-purple-100',
  orange: 'border-orange-500 bg-slate-950/80 text-orange-100',
  pink: 'border-pink-500 bg-slate-950/80 text-pink-100',
  amber: 'border-amber-400 bg-slate-950/80 text-amber-100',
}

const hoverMap: Record<BadgeColor, string> = {
  sky: 'hover:border-sky-300 hover:bg-sky-950/90 hover:shadow-md hover:shadow-sky-400/30',
  purple:
    'hover:border-purple-400 hover:bg-purple-950/90 hover:shadow-md hover:shadow-purple-500/30',
  orange:
    'hover:border-orange-400 hover:bg-orange-950/90 hover:shadow-md hover:shadow-orange-500/30',
  pink: 'hover:border-pink-400 hover:bg-pink-950/90 hover:shadow-md hover:shadow-pink-500/30',
  amber: 'hover:border-amber-300 hover:bg-amber-950/90 hover:shadow-md hover:shadow-amber-400/30',
}
</script>

<template>
  <component
    :is="href ? 'a' : 'span'"
    :href="href"
    class="inline-flex min-w-16 items-center justify-center rounded-full border-2 font-semibold tracking-wide whitespace-nowrap transition-all duration-200 motion-reduce:transition-none px-3.5 py-1 text-sm"
    :class="[
      colorMap[color],
      href && hoverMap[color],
      href &&
        'cursor-pointer hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2',
    ]">
    <slot />
  </component>
</template>
