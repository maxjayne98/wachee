<script setup lang="ts">
import { computed } from 'vue'
import type { Show } from '@/types'
import { plainText } from '@/utils'
import Badge from '@/components/base/Badge.vue'
import IMDbBadge from '@/components/base/IMDbBadge.vue'

interface Props {
  show: Show
  showSummary?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSummary: true,
})

const summary = computed(() => plainText(props.show.summary))

const years = computed(() => {
  const start = props.show.premiered?.slice(0, 4)
  const end = props.show.ended?.slice(0, 4)

  if (!start) return ''
  if (end && end !== start) return `${start}–${end}`
  if (!end && props.show.status === 'Running') return `${start}–present`
  return start
})

const runtime = computed(() => props.show.runtime ?? props.show.averageRuntime)
</script>

<template>
  <div class="min-w-0 max-w-170 flex-1 pt-5 pb-6 text-left max-md:pt-6">
    <div class="mb-3.5 flex flex-wrap gap-2">
      <Badge v-for="(genre, index) in show.genres" :key="genre" :color-index="index" size="regular">
        {{ genre }}
      </Badge>
      <Badge v-if="!show.genres.length" size="regular">{{ show.type }}</Badge>
    </div>
    <h1
      class="m-0! mb-4 text-5xl! sm:text-6xl! lg:text-7xl! leading-tight! min-h-48 font-extrabold! tracking-tighter! text-balance text-white! wrap-anywhere">
      {{ show.name }}
    </h1>
    <div class="flex flex-wrap items-center gap-5 text-sm text-slate-300">
      <IMDbBadge :score="show.rating.average" />
      <span v-if="years">{{ years }}</span>
      <span v-if="runtime">{{ runtime }} min</span>
      <span v-if="show.language">{{ show.language }}</span>
    </div>
    <p
      :class="[
        'mt-5! line-clamp-2 max-w-140 text-base leading-8! min-h-16 text-slate-300',
        { 'opacity-0': !showSummary },
      ]">
      {{
        summary ||
        'Your next great story starts here. Discover this pick and find something new to love.'
      }}
    </p>
    <div v-if="$slots.actions" class="mt-5 flex flex-wrap items-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>
