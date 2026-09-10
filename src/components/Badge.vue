<script setup lang="ts">
withDefaults(
  defineProps<{
    colorIndex?: number
    href?: string
    size?: 'small' | 'regular'
  }>(),
  { colorIndex: 0, size: 'small', href: undefined }
)
const colors = [
  '[--badge-color:#0099ff]',
  '[--badge-color:#a855f7]',
  '[--badge-color:#ff5533]',
  '[--badge-color:#ec4899]',
]
</script>

<template>
  <component
    :is="href ? 'a' : 'span'"
    :href="href"
    class="badge min-w-20 inline-flex items-center justify-center rounded-full border-2 border-(--badge-color) bg-[#0c101a]/75! font-semibold text-[#e2e8f0] tracking-[0.02em] capitalize whitespace-nowrap no-underline shadow-[0_0_10px_color-mix(in_srgb,var(--badge-color)_35%,transparent)] transition-[transform,box-shadow,background] duration-200 ease-in-out motion-reduce:transition-none"
    :class="[
      colors[((colorIndex % colors.length) + colors.length) % colors.length],
      size === 'regular' ? 'px-3 py-0.75 text-sm' : 'px-2 py-0.5 text-xs',
      href &&
        'cursor-pointer hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--badge-color)_18%,#0c101a)]! hover:shadow-[0_0_18px_color-mix(in_srgb,var(--badge-color)_50%,transparent)] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4',
    ]"
  >
    <slot />
  </component>
</template>
