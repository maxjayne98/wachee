<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <input
    v-model="model"
    class="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 placeholder:text-slate-500 transition-colors focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-50" />
</template>
