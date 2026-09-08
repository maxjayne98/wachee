<template>
  <div class="flex flex-wrap gap-3 items-center mb-2">
    <label class="grid gap-2 text-sm text-left">
      <span>Language</span>
      <CustomSelect v-model="language" :options="languageOptions" placeholder="Select Language" />
    </label>
    <label class="grid gap-2 text-sm text-left">
      <span>Runtime</span>
      <CustomSelect v-model="runtime" :options="runtimeOptions" placeholder="Select Runtime" />
    </label>
    <label class="grid gap-2 text-sm text-left min-w-md">
      <span>Rating</span>
      <RangeSlider v-model="rating" :min="1" :max="10" :step="0.1" />
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CustomSelect, { type SelectOption } from '@/components/CustomSelect.vue'
import RangeSlider from '@/components/RangeSlider.vue'
import { useShowList, type Filter } from '@/store/showList'
import { capitalizeFirstLetter } from '@/utils'

const { allShows, updateFilters } = useShowList()

const languageOptions = computed<SelectOption[]>(() => {
  const langs = new Set<string>()
  for (let index = 0; index < allShows.value.length; index++) {
    const element = allShows.value[index]
    if (element.language) {
      langs.add(capitalizeFirstLetter(element.language))
    }
  }
  return [
    { value: '', label: 'Any Language' },
    ...Array.from(langs).map(l => ({ value: l, label: l })),
  ] as SelectOption[]
})

const runtimeOptions = [
  { label: 'Any Runtime', value: '' },
  { label: 'Under 30 min', value: { min: 0, max: 30 } },
  { label: 'Under 60 min', value: { min: 0, max: 60 } },
  { label: 'Over 60 min', value: { min: 60, max: 200 } },
]

const language = ref<string>('')
const runtime = ref({
  min: 10,
  max: 120,
})

const rating = ref({
  min: 1,
  max: 10,
})

watch(
  () => [language.value, runtime.value, rating.value] as const,
  ([language, runtime, rating]) => {
    const filters: Filter[] = []
    if (language) {
      filters.push({ type: 'equal', field: 'language', value: language })
    }
    if (runtime && typeof runtime === 'object' && (runtime.min !== 10 || runtime.max !== 120)) {
      filters.push({ type: 'range', field: 'runtime', value: runtime })
    }
    if (rating && typeof rating === 'object' && (rating.min !== 1 || rating.max !== 10)) {
      filters.push({ type: 'range', field: 'rating.average', value: rating })
    }
    updateFilters(filters)
  },
  { deep: true }
)
</script>
<style lang="scss" scoped></style>
