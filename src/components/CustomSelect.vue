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
      :disabled="disabled || !options.length"
      class="group inline-flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#11131C] px-3.5 py-2.5 text-sm transition-all duration-150 ease-out hover:border-white/20 hover:bg-[#181B27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E99F9]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080D] disabled:cursor-not-allowed disabled:opacity-50"
      :class="[
        selectedOption ? 'text-[#F5F6FA]' : 'text-[#6F7688]',
        isOpen && 'border-[#9761E8]/40 bg-[#181B27]',
      ]"
      @click="toggleDropdown"
    >
      <span class="truncate font-medium">
        {{ displayLabel }}
      </span>

      <span
        aria-hidden="true"
        class="inline-flex size-4 shrink-0 items-center justify-center text-[#A7ADBC] transition-all duration-200 group-hover:text-[#F5F6FA]"
        :class="{ 'rotate-180 text-[#9761E8]': isOpen }"
      >
        <svg viewBox="0 0 16 16" focusable="false" class="size-full fill-current">
          <path
            d="M4.47 6.47a.75.75 0 0 1 1.06 0L8 8.94l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 0-1.06Z"
          />
        </svg>
      </span>
    </button>

    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1 scale-[0.98]"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-1 scale-[0.98]"
    >
      <ul
        v-if="isOpen"
        class="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 m-0 grid max-h-[240px] list-none gap-1 overflow-y-auto rounded-xl border border-white/10 bg-[#11131C]/95 p-1.5 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      >
        <li
          v-for="option in options"
          :key="String(option.value)"
          class="relative flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm transition-all duration-150"
          :class="
            option.value === modelValue
              ? 'bg-[#9761E8]/15 text-[#F5F6FA]'
              : 'text-[#A7ADBC] hover:bg-[#181B27] hover:text-[#F5F6FA]'
          "
          @click="selectOption(option)"
        >
          <span
            v-if="option.value === modelValue"
            class="absolute inset-y-2 left-0 w-0.5 rounded-full bg-linear-to-b from-[#0E99F9] via-[#9761E8] to-[#FB8E51]"
          />

          <span class="truncate">
            {{ option.label }}
          </span>

          <svg
            v-if="option.value === modelValue"
            viewBox="0 0 20 20"
            class="ml-auto size-4 shrink-0 text-[#9761E8]"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M16.704 5.292a1 1 0 0 1 .004 1.414l-7.25 7.292a1 1 0 0 1-1.42.004l-3.75-3.708a1 1 0 1 1 1.406-1.422l3.04 3.005 6.547-6.581a1 1 0 0 1 1.423-.004Z"
              clip-rule="evenodd"
            />
          </svg>
        </li>
      </ul>
    </transition>
  </div>
</template>
