<template>
  <section class="relative isolate overflow-hidden pt-24">
    <DetailImage :src="backdrop" alt="" eager class="absolute! inset-0 -z-20 opacity-65" />
    <div
      aria-hidden="true"
      class="absolute inset-0 -z-10 bg-linear-to-r from-slate-950 via-slate-950/70 to-slate-950/10" />
    <div
      aria-hidden="true"
      class="absolute inset-0 -z-10 bg-linear-to-t from-slate-950 via-transparent to-slate-950/20" />
    <div class="mx-auto max-w-360 px-6 pb-10 sm:px-12 lg:px-16">
      <nav aria-label="Breadcrumb" class="mb-7 flex! flex-wrap gap-3 text-xs text-slate-400">
        <router-link to="/" class="text-slate-300 hover:text-sky-200">Discover</router-link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ show.name }}</span>
      </nav>
      <div class="flex flex-col items-start gap-7 sm:flex-row sm:items-center sm:gap-10">
        <div
          class="w-36 shrink-0 rounded-2xl bg-linear-to-br from-cyan-400 via-purple-500 to-orange-400 p-0.5 shadow-xl shadow-blue-950/50 sm:w-52 lg:w-60">
          <DetailImage
            :src="show.image?.original || show.image?.medium"
            :alt="show.name"
            eager
            class="aspect-2/3 rounded-2xl" />
        </div>
        <div class="min-w-0 max-w-2xl py-2">
          <p class="mb-3! text-xs font-semibold tracking-widest text-sky-200 uppercase">
            {{ show.type }}
            <span v-if="show.network?.name || show.webChannel?.name">
              · {{ show.network?.name || show.webChannel?.name }}
            </span>
          </p>
          <h1
            class="m-0! text-4xl! leading-tight! font-bold! tracking-tight! text-white! sm:text-5xl! lg:text-6xl! [overflow-wrap:anywhere]">
            {{ show.name }}
          </h1>
          <div class="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <IMDbBadge v-if="show.rating.average" :score="show.rating.average" />

            <span v-if="years">{{ years }}</span>
            <span v-if="seasons.length">
              {{ seasons.length }} {{ seasons.length === 1 ? 'season' : 'seasons' }}
            </span>
          </div>
          <div class="mt-5 flex flex-wrap gap-2">
            <Badge
              v-for="(genre, index) in show.genres"
              :key="genre"
              :color-index="index"
              size="regular">
              {{ genre }}
            </Badge>
          </div>
          <div class="mt-7 flex flex-wrap items-center gap-3">
            <a
              :href="show.officialSite || show.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex min-h-11 items-center gap-4 rounded-full border border-sky-400 bg-sky-950/60! px-5 py-2.5 text-sm font-semibold text-sky-100 shadow-lg shadow-sky-500/20 hover:bg-sky-900/70!">
              {{ show.officialSite ? 'Official website' : 'View on TVmaze' }}
              <span aria-hidden="true">↗</span>
            </a>
            <button
              :aria-pressed="favorite"
              class="inline-flex min-h-11 items-center gap-3 rounded-full border px-5 py-2.5 text-sm! font-semibold backdrop-blur-sm transition-colors"
              :class="
                favorite
                  ? 'border-pink-400/70 bg-pink-950/40 text-pink-200'
                  : 'border-slate-400/50 bg-slate-950/40 text-slate-200 hover:border-pink-300'
              "
              @click="toggleFavorite">
              <span aria-hidden="true">{{ favorite ? '♥' : '♡' }}</span>
              {{ favorite ? 'Saved to favorites' : 'Add to favorites' }}
            </button>
          </div>
          <p role="status" class="mt-3! min-h-4 text-xs text-slate-400">
            {{ favoriteMessage }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import type { Show, Season } from '@/types'
import Badge from '@/components/base/Badge.vue'
import DetailImage from '@/components/base/DetailImage.vue'
import IMDbBadge from '@/components/base/IMDbBadge.vue'

interface Props {
  show: Show
  backdrop: string
  seasons?: Season[]
  favorite?: boolean
  favoriteMessage?: string
}
const props = withDefaults(defineProps<Props>(), {
  seasons: () => [],
  favorite: false,
  favoriteMessage: '',
})

const years = computed(() => {
  const start = props.show.premiered?.slice(0, 4)
  const end = props.show.ended?.slice(0, 4)
  return start
    ? `${start}${end && end !== start ? `–${end}` : !end && props.show.status === 'Running' ? '–present' : ''}`
    : ''
})
function toggleFavorite() {
  //TODO
  console.log('EEEEERRRRRRORRRRRRR TODO HERE')
}
</script>
