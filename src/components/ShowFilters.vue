<template>
  <div
    class="mb-4 grid min-w-0 grid-cols-1 items-start gap-x-4 gap-y-4 text-left sm:grid-cols-2 lg:grid-cols-4"
  >
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
      <div class="px-4">
        <RangeSlider v-model="rating" class="lg:w-64" :min="1" :max="10" :step="0.1" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import CustomSelect, { type SelectOption } from '@/components/CustomSelect.vue'
import RangeSlider from '@/components/RangeSlider.vue'
import { useShowList } from '@/store/showList'
import { debounce } from '@/utils'

const { allShows, filters } = useShowList()

const rating = ref({ ...filters.value.rating })

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
