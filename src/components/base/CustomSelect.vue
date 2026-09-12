<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ArrowDown from '@/components/base/icons/ArrowDown.vue'

export type SelectValue = string | number | Record<string, unknown> | null

export type SelectOption = {
  value: SelectValue
  label: string
}

const props = withDefaults(
  defineProps<{
    options: SelectOption[]
    placeholder?: string
    disabled?: boolean
    ariaLabel?: string
  }>(),
  {
    options: () => [],
    placeholder: 'Select an option',
    disabled: false,
    ariaLabel: undefined,
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
  <div ref="rootRef" class="relative w-full min-w-0 select-none">
    <button
      type="button"
      :disabled="disabled || !options.length"
      :aria-label="ariaLabel"
      :aria-expanded="isOpen"
      class="group inline-flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 min-h-11 text-sm! transition-all duration-150 ease-out hover:border-white/20 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50"
      :class="[
        selectedOption ? 'text-slate-100' : 'text-slate-400',
        isOpen && 'border-purple-500/40 bg-slate-800',
      ]"
      @click="toggleDropdown">
      <span class="truncate font-medium">
        {{ displayLabel }}
      </span>

      <span
        aria-hidden="true"
        class="inline-flex size-4 shrink-0 items-center justify-center text-slate-400 transition-all duration-200 group-hover:text-slate-100"
        :class="{ 'rotate-180 text-purple-400': isOpen }">
        <ArrowDown />
      </span>
    </button>

    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1 scale-[0.98]"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-1 scale-[0.98]">
      <ul
        v-if="isOpen"
        class="absolute inset-x-0 top-[calc(100%+0.5rem)] z-1000 m-0 grid max-h-60 list-none gap-1 overflow-y-auto rounded-xl border border-white/10 bg-slate-900 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <li
          v-for="option in options"
          :key="String(option.value)"
          class="relative flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm transition-all duration-150"
          :class="
            option.value === modelValue
              ? 'bg-purple-500/15 text-slate-100'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
          "
          @click="selectOption(option)">
          <span class="truncate">
            {{ option.label }}
          </span>

          <svg
            v-if="option.value === modelValue"
            viewBox="0 0 20 20"
            class="ml-auto size-4 shrink-0 text-purple-400"
            fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M16.704 5.292a1 1 0 0 1 .004 1.414l-7.25 7.292a1 1 0 0 1-1.42.004l-3.75-3.708a1 1 0 1 1 1.406-1.422l3.04 3.005 6.547-6.581a1 1 0 0 1 1.423-.004Z"
              clip-rule="evenodd" />
          </svg>
        </li>
      </ul>
    </transition>
  </div>
</template>
