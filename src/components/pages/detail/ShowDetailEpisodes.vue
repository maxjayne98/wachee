<script setup lang="ts">
import { computed } from 'vue'
import type { Episode, Season } from '@/types'
import CustomSelect from '@/components/base/CustomSelect.vue'
import ShowDetailEpisodeItem from './ShowDetailEpisodeItem.vue'
import StateMessage from '@/components/shared/StateMessage.vue'

const props = defineProps<{
  seasons: Season[]
  episodes: Episode[]
  episodesLoading?: boolean
  episodesError?: string | null
}>()

const emit = defineEmits<{
  (e: 'retry-episodes'): void
}>()

const selectedSeason = defineModel<number | null>('selectedSeason', { default: null })

const seasonsOptions = computed(() =>
  props.seasons.map(season => ({ value: season.id, label: `Season ${season.number}` }))
)
</script>

<template>
  <section tabindex="-1" class="mt-12 scroll-mt-28 focus:outline-none">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
      <h2 class="m-0! text-2xl! font-bold text-white!">Episodes</h2>
      <CustomSelect
        v-if="seasons.length"
        v-model="selectedSeason"
        :options="seasonsOptions"
        class="w-48! cursor-pointer rounded-lg px-4 py-2 text-sm! text-slate-200 outline-sky-300" />
    </div>
    <Transition
      mode="out-in"
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-to-class="opacity-0">
      <StateMessage
        v-if="episodesError"
        key="error"
        title="Episodes couldn’t load"
        :message="episodesError"
        @retry="emit('retry-episodes')" />
      <p
        v-else-if="episodesLoading"
        key="loading"
        role="status"
        class="py-8 text-sm text-slate-400">
        Loading episodes…
      </p>
      <StateMessage
        v-else-if="!seasons.length"
        key="no-seasons"
        title="No seasons available" />
      <StateMessage
        v-else-if="!episodes.length"
        key="no-episodes"
        title="No episodes available" />
      <div v-else :key="selectedSeason ?? 'episodes'" class="space-y-3">
        <ShowDetailEpisodeItem
          v-for="episode in episodes"
          :key="episode.id"
          :episode="episode" />
      </div>
    </Transition>
  </section>
</template>
