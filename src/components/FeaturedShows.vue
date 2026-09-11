<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Show } from '@/types'
import Badge from '@/components/Badge.vue'
import IMDbBadge from '@/components/IMDbBadge.vue'
import DetailImage from '@/components/DetailImage.vue'

const props = defineProps<{ shows: Show[]; loading: boolean; error: string }>()
const emit = defineEmits<{ retry: [] }>()
const DURATION = 10_000
const activeIndex = ref(0)
const picks = ref<HTMLElement | null>(null)
const progress = ref(0)
const failedImages = ref(new Set<string>())
const activeShow = computed(() => props.shows[activeIndex.value])
const summary = computed(() => {
  const html = activeShow.value?.summary
  return html ? new DOMParser().parseFromString(html, 'text/html').body.textContent || '' : ''
})
const imageFor = (show: Show) => show.image?.original || show.image?.medium || ''
const hasImage = (show: Show) => imageFor(show) && !failedImages.value.has(imageFor(show))
let timer: ReturnType<typeof setInterval> | undefined
let lastTick = 0

function select(index: number) {
  if (!props.shows.length) return
  activeIndex.value = (index + props.shows.length) % props.shows.length
  progress.value = 0
  lastTick = Date.now()
}

watch(
  () => props.shows,
  () => select(0)
)
watch(
  activeIndex,
  () => {
    const container = picks.value
    const selected = container?.children[activeIndex.value] as HTMLElement | undefined
    if (!container || !selected) return
    const left = selected.offsetLeft - container.offsetLeft
    if (
      left < container.scrollLeft ||
      left + selected.offsetWidth > container.scrollLeft + container.clientWidth
    ) {
      container.scrollTo({
        left: Math.max(0, left - container.clientWidth / 2 + selected.offsetWidth / 2),
        behavior: 'instant',
      })
    }
  },
  { flush: 'post' }
)
function resetTick() {
  lastTick = Date.now()
}
onMounted(() => {
  resetTick()
  document.addEventListener('visibilitychange', resetTick)
  timer = setInterval(() => {
    const now = Date.now()
    const elapsed = now - lastTick
    lastTick = now
    if (document.hidden || props.shows.length < 2) return
    progress.value += elapsed / DURATION
    if (progress.value >= 1) select(activeIndex.value + 1)
  }, 100)
})
onUnmounted(() => {
  clearInterval(timer)
  document.removeEventListener('visibilitychange', resetTick)
})
</script>

<template>
  <section
    class="relative isolate min-h-0 overflow-hidden bg-slate-950 text-left text-white [&_a]:no-underline [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-violet-200 [&_button:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-violet-200 [&_a:focus-visible]:outline-offset-4 motion-reduce:[&_*]:transition-none! after:absolute after:inset-x-0 after:bottom-0 after:h-px after:gradient-spectrum after:shadow-lg after:shadow-purple-500/40 after:content-['']"
    aria-label="Top picks for you"
    aria-roledescription="carousel"
  >
    <Transition
      enter-active-class="transition-opacity duration-1200 ease-in-out"
      leave-active-class="transition-opacity duration-1200 ease-in-out"
      enter-from-class="opacity-0!"
      leave-to-class="opacity-0!"
    >
      <DetailImage
        v-if="activeShow && hasImage(activeShow)"
        :key="activeShow.id"
        class="absolute! inset-0 size-full from-slate-800 to-slate-950 opacity-70"
        image-class="object-[center_25%]!"
        :src="imageFor(activeShow)"
        alt=""
        eager
        @error="failedImages.add(imageFor(activeShow))"
      />
    </Transition>
    <div class="absolute inset-0 hero-overlay" />
    <div
      class="relative m-auto box-border flex min-h-0 max-w-360 flex-col items-stretch px-12 pt-26 pb-5 max-md:px-6 max-md:pt-25"
    >
      <template v-if="activeShow">
        <div
          class="flex items-center gap-2.5 text-xs font-bold tracking-widest text-slate-400 md:text-base"
        >
          <span class="size-1.75 rounded-full bg-violet-300 shadow-lg shadow-violet-400/60" />
          THE WACHEE SPOTLIGHT
        </div>
        <Transition
          mode="out-in"
          enter-active-class="transition-opacity duration-250 ease-in-out"
          leave-active-class="transition-opacity duration-250 ease-in-out"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <div
            :key="activeShow.id"
            class="max-w-170 flex-1 pt-5 pb-6 max-md:pt-6"
            role="group"
            aria-roledescription="slide"
            :aria-label="`${activeIndex + 1} of ${shows.length}: ${activeShow.name}`"
          >
            <div class="mb-3.5 flex flex-wrap gap-2">
              <Badge
                v-for="(genre, index) in activeShow.genres.slice(0, 3)"
                :key="genre"
                :color-index="index"
                size="regular"
                :name="genre"
                >{{ genre }}</Badge
              >
              <Badge v-if="!activeShow.genres.length" :name="activeShow.type" size="regular">{{
                activeShow.type
              }}</Badge>
            </div>
            <h1
              class="m-0! mb-4 text-5xl! sm:text-6xl! lg:text-7xl! leading-tight! min-h-48 font-extrabold! tracking-tighter! text-balance text-white! wrap-anywhere"
            >
              {{ activeShow.name }}
            </h1>
            <div class="flex flex-wrap items-center gap-5 text-sm text-slate-300">
              <IMDbBadge :score="activeShow.rating.average" />
              <span v-if="activeShow.premiered">{{ activeShow.premiered.slice(0, 4) }}</span>
              <span v-if="activeShow.runtime">{{ activeShow.runtime }} min</span>
              <span v-if="activeShow.language">{{ activeShow.language }}</span>
            </div>
            <p class="mt-5! line-clamp-2 max-w-140 text-base leading-8! min-h-16 text-slate-300">
              {{
                summary ||
                'Your next great story starts here. Discover this pick and find something new to love.'
              }}
            </p>
            <div class="mt-5 flex flex-wrap items-center gap-6.5">
              <router-link
                :to="{ name: 'show-detail', params: { id: activeShow.id } }"
                class="inline-flex cursor-pointer items-center justify-center gap-8 rounded-full border-4 border-transparent gradient-border! px-5.5 py-3 text-base! font-bold text-violet-100 shadow-lg shadow-purple-500/20 transition-[background] duration-200 hover:shadow-xl hover:shadow-purple-500/40"
                >Explore show <span aria-hidden="true">→</span></router-link
              >
              <a href="#browse-shows" class="inline-flex gap-4 text-base text-slate-200"
                >Browse collection
              </a>
            </div>
          </div>
        </Transition>
        <div class="mt-auto min-w-0">
          <div class="mb-3 flex items-center justify-between gap-4">
            <div>
              <span class="text-xs font-bold tracking-widest text-slate-400 md:text-base"
                >CURATED FOR YOUR NEXT OBSESSION</span
              >
              <h2
                class="m-0! mt-2.25! flex flex-wrap items-center gap-5 text-2xl text-white! max-md:gap-2.5 max-md:text-2xl!"
              >
                Top picks for you<span class="text-base tracking-widest text-slate-400"
                  >{{ String(activeIndex + 1).padStart(2, '0') }} /
                  {{ String(shows.length).padStart(2, '0') }}</span
                >
              </h2>
            </div>
            <div v-if="shows.length > 1" class="flex gap-2 max-md:gap-1.25">
              <button
                class="w-14 cursor-pointer rounded-full glass-surface text-white hover:bg-white/15 max-md:w-12"
                aria-label="Previous pick"
                @click="select(activeIndex - 1)"
              >
                ←
              </button>

              <button
                class="w-14 cursor-pointer rounded-full glass-surface text-white hover:bg-white/15 max-md:w-12"
                aria-label="Next pick"
                @click="select(activeIndex + 1)"
              >
                →
              </button>
            </div>
          </div>
          <div ref="picks" class="flex gap-3 overflow-x-auto px-0.75 pt-0.75 pb-3">
            <button
              v-for="(show, index) in shows"
              :key="show.id"
              class="relative h-24 basis-41 shrink-0 cursor-pointer overflow-hidden rounded-2xl border text-left text-white hover:border-violet-200 max-md:basis-35 after:absolute after:inset-0 after:bg-linear-to-t after:from-slate-950/95 after:to-slate-950/20 after:content-['']"
              :class="
                index === activeIndex
                  ? 'border-transparent gradient-border shadow-md shadow-purple-500/30'
                  : 'border-white/15 bg-slate-900'
              "
              :aria-pressed="index === activeIndex"
              :aria-label="`Show ${show.name}`"
              @click="select(index)"
            >
              <DetailImage
                v-if="hasImage(show)"
                class="h-full from-slate-800 to-slate-950"
                :image-class="`size-full object-cover object-[center_25%] ${index === activeIndex ? 'opacity-100' : 'opacity-60'}`"
                :src="imageFor(show)"
                :alt="show.name"
                loading="lazy"
                @error="failedImages.add(imageFor(show))"
              />
              <span class="absolute top-2.5 left-3 z-1 text-sm">{{
                String(index + 1).padStart(2, '0')
              }}</span>
              <span
                class="absolute right-2.5 bottom-3.75 left-3 z-1 truncate text-base font-bold"
                >{{ show.name }}</span
              >
              <span
                v-if="index === activeIndex"
                class="absolute inset-x-0 bottom-0 z-2 h-0.75 bg-white/20"
                ><span
                  class="block h-full origin-left bg-violet-200 transition-transform duration-100 ease-linear"
                  :style="{ transform: `scaleX(${progress})` }"
              /></span>
            </button>
          </div>
        </div>
      </template>
      <div
        v-else
        class="my-auto max-w-175 lg:max-w-250 py-12.5 [&_h1]:mt-3.5! [&_p]:text-slate-400"
        role="status"
      >
        <span class="text-xs font-bold tracking-widest text-slate-400 md:text-base"
          >THE WACHEE SPOTLIGHT</span
        >
        <h1
          class="m-0! mb-4! text-5xl! sm:text-6xl! lg:text-7xl! leading-tight font-bold! tracking-tighter! text-balance text-white! wrap-anywhere"
        >
          {{
            loading
              ? 'Great stories await.'
              : error
                ? 'The spotlight is taking a break.'
                : 'A new story is out there.'
          }}
        </h1>
        <p>
          {{
            loading
              ? 'Finding your next favorite…'
              : error
                ? 'We couldn’t load the shows. Please try again.'
                : 'Try adjusting the filters below to discover more shows.'
          }}
        </p>
        <button
          v-if="error && !loading"
          class="inline-flex cursor-pointer text-lg mt-8 items-center justify-center gap-8 rounded-full border-2 border-transparent gradient-border! px-5.5 py-3 font-extrabold text-violet-100 shadow-lg shadow-purple-500/20 transition-[background] duration-200 hover:shadow-xl hover:shadow-purple-500/40"
          @click="emit('retry')"
        >
          Try again ↗
        </button>
      </div>
    </div>
  </section>
</template>
