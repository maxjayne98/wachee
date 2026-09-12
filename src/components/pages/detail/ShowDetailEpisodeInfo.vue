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
    <div
      v-if="episodesError"
      role="alert"
      class="rounded-2xl border border-slate-700 p-6 text-sm text-slate-400">
      Episodes couldn’t load.
      <button class="ml-2 text-sky-300 underline" @click="emit('retry-episodes')">Try again</button>
    </div>
    <p v-else-if="episodesLoading" role="status" class="py-8 text-sm text-slate-400">
      Loading episodes…
    </p>
    <p v-else-if="!seasons.length" class="py-4 text-sm text-slate-400">
      No season information is available yet.
    </p>
    <p v-else-if="!episodes.length" class="py-4 text-sm text-slate-400">
      No episodes are available for this season yet.
    </p>
    <div v-else class="space-y-3">
      <article
        v-for="episode in episodes"
        :key="episode.id"
        class="flex flex-col overflow-hidden rounded-xl border border-slate-700/60 bg-linear-to-r from-slate-800/40 to-slate-950 sm:flex-row">
        <DetailImage
          :src="episode.image?.medium || episode.image?.original"
          :alt="episode.name"
          class="aspect-video w-full shrink-0 sm:aspect-auto sm:min-h-28 sm:w-44" />
        <div class="flex min-w-0 flex-1 items-start gap-4 p-4 sm:items-center sm:p-5">
          <span
            class="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-600/50 text-sm text-slate-300">
            {{ episode.number ?? 'SP' }}
          </span>
          <div class="min-w-0 flex-1">
            <h3 class="m-0! text-base! font-semibold text-white">{{ episode.name }}</h3>
            <p class="mt-1! line-clamp-2 text-sm leading-relaxed text-slate-400">
              {{ plainText(episode.summary) || 'No episode synopsis available.' }}
            </p>
            <p v-if="episode.airdate" class="mt-2! text-xs text-slate-500">
              {{ episode.airdate }}
            </p>
          </div>
          <div class="flex shrink-0 flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <span v-if="episode.runtime" class="text-xs text-slate-400">
              {{ episode.runtime }} min
            </span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { plainText } from '@/utils'
import type { Episode, Season } from '@/types'
import CustomSelect from '@/components/base/CustomSelect.vue'
import DetailImage from '@/components/base/DetailImage.vue'

const props = defineProps<{
  seasons: Season[]
  episodes: Episode[]
  episodesLoading?: boolean
  episodesError?: boolean
}>()
const emit = defineEmits<{
  (e: 'retry-episodes'): void
}>()
const selectedSeason = defineModel<number | null>('selectedSeason', { default: null })

const seasonsOptions = computed(() =>
  props.seasons.map(season => ({ value: season.id, label: `Season ${season.number}` }))
)
</script>
