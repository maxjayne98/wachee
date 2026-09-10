<template>
  <Badge
    size="small"
    class="inline-flex min-w-auto items-center gap-1.75 rounded-full border border-amber-300/90 bg-black py-1 pr-2.5 pl-1 font-bold text-white shadow-md shadow-amber-400/30"
  >
    <span
      class="inline-flex p-0.5 items-center justify-center rounded-full bg-amber-300/90 text-black text-xs"
    >
      IMDb
    </span>
    {{ score ? score.toFixed(1) : 'N/A' }}
  </Badge>
</template>
<script setup lang="ts">
import Badge from '@/components/Badge.vue'
defineProps<{ score: number | null | undefined }>()
</script>
