<script setup lang="ts">
import { computed } from 'vue'
import type { Show } from '@/types'
import Badge from '@/components/Badge.vue'
import IMDbBadge from '@/components/IMDbBadge.vue'

const props = defineProps<{
  show: Show
  index?: number
  total?: number
}>()

const summary = computed(() => {
  const html = props.show.summary
  return html ? new DOMParser().parseFromString(html, 'text/html').body.textContent || '' : ''
})

const ariaLabel = computed(() => {
  if (props.index !== undefined && props.total !== undefined) {
    return `${props.index + 1} of ${props.total}: ${props.show.name}`
  }
  return props.show.name
})
</script>

<template>
  <div
    class="max-w-170 flex-1 pt-5 pb-6 max-md:pt-6"
    role="group"
    aria-roledescription="slide"
    :aria-label="ariaLabel">
    <div class="mb-3.5 flex flex-wrap gap-2">
      <Badge
        v-for="(genre, genreIndex) in show.genres.slice(0, 3)"
        :key="genre"
        :color-index="genreIndex"
        size="regular"
        :name="genre">
        {{ genre }}
      </Badge>
      <Badge v-if="!show.genres.length" :name="show.type" size="regular">
        {{ show.type }}
      </Badge>
    </div>
    <h1
      class="m-0! mb-4 text-5xl! sm:text-6xl! lg:text-7xl! leading-tight! min-h-48 font-extrabold! tracking-tighter! text-balance text-white! wrap-anywhere">
      {{ show.name }}
    </h1>
    <div class="flex flex-wrap items-center gap-5 text-sm text-slate-300">
      <IMDbBadge :score="show.rating.average" />
      <span v-if="show.premiered">{{ show.premiered.slice(0, 4) }}</span>
      <span v-if="show.runtime">{{ show.runtime }} min</span>
      <span v-if="show.language">{{ show.language }}</span>
    </div>
    <p class="mt-5! line-clamp-2 max-w-140 text-base leading-8! min-h-16 text-slate-300">
      {{
        summary ||
        'Your next great story starts here. Discover this pick and find something new to love.'
      }}
    </p>
    <div class="mt-5 flex flex-wrap items-center gap-6.5">
      <router-link
        :to="{ name: 'show-detail', params: { id: show.id } }"
        class="inline-flex cursor-pointer items-center justify-center gap-8 rounded-full border-4 border-transparent gradient-border! px-5.5 py-3 text-base! font-bold text-violet-100 shadow-lg shadow-purple-500/20 transition-[background] duration-200 hover:shadow-xl hover:shadow-purple-500/40">
        Explore show
        <span aria-hidden="true">→</span>
      </router-link>
    </div>
  </div>
</template>
