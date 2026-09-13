<script setup lang="ts">
import Badge from './Badge.vue'

defineProps<{ score: number | null | undefined }>()
</script>

<template>
  <Badge color="amber" class="p-0.5!">
    <span
      class="inline-flex p-0.5! items-center justify-center rounded-full bg-amber-300/90 text-black text-xs font-extrabold">
      IMDb
    </span>
    <span class="mx-1">
      {{ score ? score.toFixed(1) : 'N/A' }}
    </span>
  </Badge>
</template>
