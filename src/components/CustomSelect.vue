<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export type SelectValue = string | number | Record<string, unknown>
export type SelectOption = {
  value: SelectValue
  label: string
}

const props = withDefaults(
  defineProps<{
    options: SelectOption[]
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    options: () => [],
    placeholder: 'Select an option',
    disabled: false,
  }
)

const modelValue = defineModel<SelectValue>()

const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const selectedOption = computed(
  () => props.options.find(option => option.value === modelValue.value) ?? null
)

const displayLabel = computed(() => {
  return selectedOption.value?.label || props.placeholder
})

function toggleDropdown() {
  if (!props.disabled && props.options.length > 0) {
    isOpen.value = !isOpen.value
  }
}

function selectOption(option: SelectOption) {
  modelValue.value = option.value
  isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="rootRef" class="relative w-full min-w-[140px] select-none">
    <button
      type="button"
      class="inline-flex w-full cursor-pointer items-center justify-between gap-2 rounded-full border border-white/[0.18] bg-[#140c1c]/[0.92] px-3 py-[0.45rem] text-[0.85rem] transition-all duration-150 ease-out hover:-translate-y-px hover:border-white/35 hover:bg-[#1c1026]/[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff527a]/70 disabled:cursor-not-allowed disabled:opacity-60"
      :class="selectedOption ? 'text-white/[0.88]' : 'text-white/60'"
      :disabled="disabled || !options.length"
      @click="toggleDropdown"
    >
      <span class="truncate">{{ displayLabel }}</span>
      <span
        aria-hidden="true"
        class="inline-flex size-4 shrink-0 items-center justify-center transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      >
        <svg viewBox="0 0 16 16" focusable="false" class="size-full fill-current">
          <path
            d="M4.47 6.47a.75.75 0 0 1 1.06 0L8 8.94l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 0-1.06Z"
          />
        </svg>
      </span>
    </button>

    <transition
      enter-active-class="transition duration-120 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-120 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <ul
        v-if="isOpen"
        class="absolute inset-x-0 top-[calc(100%+0.35rem)] z-20 m-0 grid max-h-[240px] list-none gap-[0.1rem] overflow-y-auto rounded-xl border border-white/[0.18] bg-[#160c20]/[0.98] p-[0.4rem] shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
      >
        <li
          v-for="option in options"
          :key="option.value"
          class="block cursor-pointer rounded-[0.55rem] px-[0.6rem] py-[0.45rem] text-[0.85rem] transition-colors duration-120 hover:bg-[#ff2d55]/20 hover:text-white/[0.92]"
          :class="
            option.value === modelValue ? 'bg-[#ff2d55]/35 text-white/[0.96]' : 'text-white/[0.85]'
          "
          @click="selectOption(option)"
        >
          {{ option.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>
