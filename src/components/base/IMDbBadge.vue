<script setup lang="ts">
defineProps<{ score: number | null | undefined }>()
</script>

<template>
  <span
    class="inline-flex min-w-auto items-center gap-1.75 rounded-full border border-amber-300/90 bg-black py-1 pr-2.5 pl-1 text-xs font-bold text-white shadow-md shadow-amber-400/30">
    <span
      class="inline-flex p-0.5 items-center justify-center rounded-full bg-amber-300/90 text-black text-xs font-extrabold">
      IMDb
    </span>
    {{ score ? score.toFixed(1) : 'N/A' }}
  </span>
</template>
