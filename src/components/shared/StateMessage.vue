<script setup lang="ts">
interface Props {
  title: string
  message?: string
  retryLabel?: string
}

withDefaults(defineProps<Props>(), {
  message: '',
  retryLabel: 'Try again',
})
</script>

<template>
  <div
    role="status"
    class="rounded-3xl border border-white/10 bg-slate-900 p-8 text-center sm:p-12">
    <h3 class="text-xl! font-bold text-white!">
      {{ title }}
    </h3>

    <p v-if="message" class="mx-auto mt-2 max-w-md text-sm text-slate-400">
      {{ message }}
    </p>

    <slot />

    <div
      v-if="$attrs.onRetry || $slots.actions"
      class="mt-6 flex flex-wrap items-center justify-center gap-3">
      <button
        v-if="$attrs.onRetry && retryLabel"
        type="button"
        class="cursor-pointer rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 focus-visible:outline-2 focus-visible:outline-violet-400"
        @click="$emit('retry')">
        {{ retryLabel }}
      </button>

      <slot name="actions" />
    </div>
  </div>
</template>
