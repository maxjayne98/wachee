<script setup lang="ts">
import { ref, watch } from 'vue'
interface Props {
  src?: string | null
  alt: string
  eager?: boolean
  imageClass?: string
}
const props = withDefaults(defineProps<Props>(), {
  src: '',
  eager: false,
  imageClass: '',
})
const failed = ref(false)
const emit = defineEmits<{ error: [event: Event] }>()
function handleError(event: Event) {
  failed.value = true
  emit('error', event)
}
watch(
  () => props.src,
  () => {
    failed.value = false
  }
)
</script>
<template>
  <div class="relative overflow-hidden">
    <img
      v-if="src && !failed"
      :src="src"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      :class="['absolute inset-0 size-full object-cover object-top', imageClass]"
      @error="handleError" />
    <div
      v-else
      :class="[
        'flex size-full items-center justify-center p-4 text-center text-sm text-slate-500',
      ]">
      {{ alt }}
    </div>
  </div>
</template>
