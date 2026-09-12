<template>
  <div
    class="mb-4 grid min-w-0 grid-cols-1 items-start gap-x-4 gap-y-4 text-left sm:grid-cols-2 lg:grid-cols-4">
    <div class="min-w-0">
      <p class="m-0! text-sm font-medium leading-5 text-slate-300">Language</p>
      <div class="flex h-20 items-center">
        <CustomSelect v-model="filters.language" :options="languageOptions" aria-label="Language" />
      </div>
    </div>
    <div class="min-w-0">
      <p class="m-0! text-sm font-medium leading-5 text-slate-300">Runtime</p>
      <div class="flex h-20 items-center">
        <CustomSelect v-model="filters.runtime" :options="runtimeOptions" aria-label="Runtime" />
      </div>
    </div>
    <div class="min-w-0 sm:col-span-2">
      <p class="m-0! text-sm font-medium leading-5 text-slate-300">Rating</p>
      <div class="flex h-20 items-center gap-3 px-2 sm:gap-4 sm:px-4">
        <RangeSlider
          v-model="rating"
          class="flex-1 min-w-0 lg:max-w-64"
          :min="1"
          :max="10"
          :step="0.1" />
        <button
          type="button"
          aria-label="Reset filters"
          title="Reset filters"
          :disabled="!hasActiveFilters"
          class="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-100 shadow-sm transition hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-rose-400 focus-visible:outline-2 focus-visible:outline-rose-400 disabled:cursor-not-allowed disabled:opacity-30 motion-reduce:transition-none"
          @click="handleReset">
          <Trash class="size-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import CustomSelect, { type SelectOption } from '@/components/base/CustomSelect.vue'
import RangeSlider from '@/components/base/RangeSlider.vue'
import Trash from '@/components/base/icons/Trash.vue'
import { useShowList } from '@/store/showList'
import { debounce } from '@/utils'

const { allShows, filters, resetFilters } = useShowList()

const rating = ref({ ...filters.value.rating })

const hasActiveFilters = computed(() => {
  return (
    Boolean(filters.value.language) ||
    Boolean(filters.value.runtime) ||
    filters.value.rating.min > 1 ||
    filters.value.rating.max < 10
  )
})

function handleReset() {
  resetFilters()
  rating.value = { min: 1, max: 10 }
}

const updateFilterRating = debounce((newRating: { min: number; max: number }) => {
  filters.value.rating = { ...newRating }
}, 300)

watch(
  rating,
  newRating => {
    updateFilterRating(newRating)
  },
  { deep: true }
)

watch(
  () => filters.value.rating,
  newRating => {
    if (newRating.min !== rating.value.min || newRating.max !== rating.value.max) {
      rating.value = { ...newRating }
    }
  },
  { deep: true }
)

onUnmounted(() => {
  updateFilterRating.cancel()
})

const languageOptions = computed<SelectOption[]>(() => [
  { value: '', label: 'Any language' },
  ...Array.from(
    new Set(
      allShows.value
        .map(show => show.language)
        .filter((language): language is string => Boolean(language))
    )
  )
    .sort()
    .map(language => ({ value: language, label: language })),
])

// Primitive values keep selection identity stable through Vue's reactive proxies.
const runtimeOptions: SelectOption[] = [
  { label: 'Any runtime', value: '' },
  { label: 'Under 30 min', value: 'short' },
  { label: '30–60 min', value: 'medium' },
  { label: 'Over 60 min', value: 'long' },
]
</script>
