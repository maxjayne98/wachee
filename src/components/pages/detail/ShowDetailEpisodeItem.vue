<script setup lang="ts">
import { computed } from 'vue'
import type { Episode } from '@/types'
import { plainText } from '@/utils'
import DetailImage from '@/components/base/DetailImage.vue'

interface Props {
  episode: Episode
}

const props = defineProps<Props>()

const description = computed(
  () => plainText(props.episode.summary) || 'No episode description available.'
)
const episodeNumber = computed(() => props.episode.number ?? 'SP')
const posterUrl = computed(() => props.episode.image?.medium || props.episode.image?.original)
</script>

<template>
  <article
    class="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-900 sm:flex-row">
    <DetailImage
      :src="posterUrl"
      :alt="episode.name"
      class="aspect-video w-full shrink-0 sm:aspect-auto sm:min-h-28 sm:w-44" />
    <div class="flex min-w-0 flex-1 items-start gap-4 p-4 sm:items-center sm:p-5 text-left">
      <span
        class="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-600/50 text-sm text-slate-300">
        {{ episodeNumber }}
      </span>
      <div class="min-w-0 flex-1">
        <h3 class="m-0! text-base! font-semibold text-white">{{ episode.name }}</h3>
        <p class="mt-1! line-clamp-2 text-sm leading-relaxed text-slate-400">
          {{ description }}
        </p>
        <p v-if="episode.airdate" class="mt-2! text-xs text-slate-500">
          {{ episode.airdate }}
        </p>
      </div>
      <div class="flex shrink-0 flex-col items-center gap-2 sm:flex-row sm:gap-4">
        <span v-if="episode.runtime" class="text-xs text-slate-400">{{ episode.runtime }} min</span>
      </div>
    </div>
  </article>
</template>
