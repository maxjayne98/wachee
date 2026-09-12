<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Badge from '@/components/base/Badge.vue'
import IMDbBadge from '@/components/base/IMDbBadge.vue'
import type { Show } from '@/types'

const props = defineProps<{ show: Show }>()
const imageFailed = ref(false)
const posterUrl = computed(() => props.show.image?.original || props.show.image?.medium || '')
const summary = computed(() => {
  if (!props.show.summary) return 'No synopsis available for this show yet.'
  return new DOMParser().parseFromString(props.show.summary, 'text/html').body.textContent || ''
})
watch(posterUrl, () => {
  imageFailed.value = false
})
</script>

<template>
  <article
    class="group min-w-0 rounded-3xl bg-linear-to-br from-cyan-500 via-purple-500 to-orange-500 p-px shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-1 hover:shadow-purple-500/20 motion-reduce:transition-none">
    <router-link
      class="block h-full rounded-3xl bg-transparent! no-underline focus-visible:outline-2 focus-visible:outline-sky-300 focus-visible:outline-offset-4"
      :aria-label="`Explore ${show.name}`"
      :to="{ name: 'show-detail', params: { id: show.id } }">
      <div class="relative flex h-full min-w-0 overflow-hidden rounded-3xl bg-slate-950">
        <div class="relative w-28 shrink-0 overflow-hidden bg-slate-900 sm:w-40">
          <img
            v-if="posterUrl && !imageFailed"
            :src="posterUrl"
            :alt="show.name"
            loading="lazy"
            class="absolute inset-0 size-full object-cover object-top transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
            @error="imageFailed = true" />
          <div
            v-else
            class="flex h-full min-h-56 items-center justify-center bg-linear-to-br from-slate-800 to-slate-950 p-4 text-center text-sm text-slate-400">
            No poster available
          </div>
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
        </div>
        <div class="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-6">
          <div class="flex flex-wrap items-center gap-3">
            <IMDbBadge :score="show.rating.average" />
            <span class="text-xs text-slate-400">{{ show.type }}</span>
          </div>
          <div>
            <h2
              class="m-0! text-xl! leading-tight font-bold text-white! sm:text-2xl! [overflow-wrap:anywhere]">
              {{ show.name }}
            </h2>
            <p class="mt-2! flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
              <span v-if="show.premiered">{{ show.premiered.slice(0, 4) }}</span>
              <span v-if="show.network?.name">{{ show.network.name }}</span>
              <span v-if="show.runtime">· {{ show.runtime }} min</span>
              <span v-if="show.language">· {{ show.language }}</span>
            </p>
          </div>
          <p class="line-clamp-3 text-sm leading-relaxed text-slate-400">{{ summary }}</p>
          <div v-if="show.genres.length" class="flex flex-wrap gap-2">
            <Badge v-for="(genre, index) in show.genres" :key="genre" :color-index="index">
              {{ genre }}
            </Badge>
          </div>
          <span
            class="mt-auto inline-flex min-h-10 items-center gap-3 self-start rounded-full border border-sky-400/30 bg-sky-950/40 px-4 py-2 text-xs font-semibold text-sky-100 no-underline transition-colors hover:border-sky-300/70 hover:bg-sky-900/50 focus-visible:outline-2 focus-visible:outline-sky-300 focus-visible:outline-offset-2">
            Explore show
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </router-link>
  </article>
</template>
