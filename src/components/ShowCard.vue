<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Show } from '@/types'
import Badge from '@/components/Badge.vue'
import ShareIcon from '@/components/icons/Share.vue'
import DetailImage from '@/components/DetailImage.vue'
import IMDbBadge from '@/components/IMDbBadge.vue'
import Heart from '@/components/icons/Heart.vue'

interface Props {
  show: Show
  isFavorite?: boolean
  tagline?: string
}
const props = withDefaults(defineProps<Props>(), { isFavorite: false, tagline: '' })
const emit = defineEmits<{
  (e: 'click', show: Show): void
  (e: 'favorite', show: Show, isFavorite: boolean): void
  (e: 'share', show: Show): void
}>()
const isFav = ref(props.isFavorite)
watch(
  () => props.isFavorite,
  value => {
    isFav.value = value
  }
)
const posterUrl = computed(() => props.show.image?.original || props.show.image?.medium || '')
const premiereYear = computed(() => props.show.premiered?.slice(0, 4))
const networkName = computed(
  () => props.show.network?.name || props.show.webChannel?.name || props.show.type || 'TV'
)
const displayedGenres = computed(() => props.show.genres?.slice(0, 3) || [])
const description = computed(() =>
  (props.tagline || props.show.summary || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
)
function toggleFavorite() {
  isFav.value = !isFav.value
  emit('favorite', props.show, isFav.value)
}
</script>

<template>
  <article
    class="group relative isolate box-border flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950 text-left shadow-lg shadow-black/20 transition-colors duration-300 hover:border-sky-300/40 hover:ring-1 hover:ring-inset hover:ring-sky-300/20 focus-within:border-sky-300/60 motion-reduce:transform-none motion-reduce:transition-none"
  >
    <div class="relative aspect-4/5 overflow-hidden">
      <DetailImage
        :src="posterUrl"
        :alt="show.name"
        class="size-full transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
      />
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-black/20"
      />
      <IMDbBadge :score="show.rating?.average" class="absolute top-4 left-4" />
      <div
        v-if="description"
        class="absolute inset-x-5 bottom-12 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transition-none"
      >
        <p class="m-0! line-clamp-3 text-sm leading-relaxed text-slate-200">{{ description }}</p>
      </div>
    </div>
    <div
      class="relative -mt-8 flex flex-1 flex-col rounded-t-3xl border-t border-sky-200/15 bg-linear-to-br from-slate-800/85 via-slate-900/95 to-slate-950 px-5 pt-5 pb-4 backdrop-blur-xl"
    >
      <div class="mb-2 flex min-w-0 items-center gap-2 text-xs font-medium text-slate-400">
        <span class="truncate text-sky-200/80">{{ networkName }}</span>
        <template v-if="premiereYear">
          <span aria-hidden="true" class="size-1 shrink-0 rounded-full bg-slate-600" />
          <span class="shrink-0">
            {{ premiereYear }}
          </span>
        </template>
      </div>
      <h3 class="m-0! mb-3! min-h-14 text-xl! leading-7! font-semibold! tracking-tight text-white!">
        <router-link
          :to="{ name: 'show-detail', params: { id: show.id } }"
          :aria-label="`Explore ${show.name}`"
          class="line-clamp-2 text-inherit! no-underline! outline-none after:absolute after:inset-0 after:z-10 after:rounded-3xl focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-sky-300"
          @click="emit('click', show)"
        >
          {{ show.name }}
        </router-link>
      </h3>
      <div class="flex flex-wrap gap-1.5 pb-4">
        <Badge
          v-for="(genre, index) in displayedGenres"
          :key="genre"
          :color-index="index"
          class="min-w-0! border! shadow-none! text-xs!"
          >{{ genre }}</Badge
        >
      </div>
      <div class="mt-auto flex items-center justify-between border-t border-white/10 pt-3">
        <span
          aria-hidden="true"
          class="inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition-colors group-hover:text-sky-200"
          >Discover show
          <span class="transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            ↗
          </span>
        </span>
        <button
          type="button"
          :aria-label="`${isFav ? 'Remove' : 'Add'} ${show.name} ${isFav ? 'from' : 'to'} favorites`"
          :aria-pressed="isFav"
          class="relative z-20 flex size-10 cursor-pointer items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          :class="
            isFav
              ? 'border-sky-300/60 bg-sky-400/20 text-sky-200'
              : 'border-white/10 bg-white/5 text-slate-400 hover:border-sky-300/50 hover:text-sky-200'
          "
          @click="toggleFavorite"
        >
          <Heart :fill="isFav ? 'currentColor' : 'none'" />
        </button>
      </div>
    </div>
    <router-link
      :to="{ name: 'show-detail', params: { id: show.id } }"
      tabindex="-1"
      aria-hidden="true"
      class="absolute inset-x-0 top-0 z-10 aspect-4/5"
      @click="emit('click', show)"
    />
    <button
      type="button"
      :aria-label="`Share ${show.name}`"
      class="absolute top-3 right-3 z-20 flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-slate-950/50 text-white backdrop-blur-xl transition-colors hover:bg-sky-900/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      @click="emit('share', show)"
    >
      <ShareIcon />
    </button>
  </article>
</template>
