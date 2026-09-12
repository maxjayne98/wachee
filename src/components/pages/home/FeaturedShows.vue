<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Show } from '@/types'
import DetailImage from '@/components/base/DetailImage.vue'
import FeaturedShowsPicker from './FeaturedShowsPicker.vue'
import ShowHero from '@/components/shared/ShowHero.vue'
import ArrowRight from '@/components/base/icons/ArrowRight.vue'

const props = defineProps<{ shows: Show[]; loading: boolean; error: string }>()
const emit = defineEmits<{ retry: [] }>()
const DURATION = 10_000
const activeIndex = ref(0)
const failedImages = ref(new Set<string>())
const activeShow = computed(() => props.shows[activeIndex.value])
const imageFor = (show: Show) => show.image?.original || show.image?.medium || ''
const hasImage = (show: Show) => imageFor(show) && !failedImages.value.has(imageFor(show))
let timer: ReturnType<typeof setInterval> | undefined

function select(index: number) {
  if (!props.shows.length) return
  activeIndex.value = (index + props.shows.length) % props.shows.length
}

watch(
  () => props.shows,
  () => select(0)
)

onMounted(() => {
  timer = setInterval(() => {
    if (!document.hidden && props.shows.length > 1) {
      select(activeIndex.value + 1)
    }
  }, DURATION)
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <section
    class="relative isolate min-h-0 overflow-hidden bg-slate-950 text-left text-white [&_a]:no-underline after:absolute after:inset-x-0 after:bottom-0 after:h-px after:gradient-spectrum after:shadow-lg after:shadow-purple-500/40 after:content-['']"
    aria-label="Top picks for you"
    aria-roledescription="carousel">
    <Transition
      enter-active-class="transition-opacity duration-1200 ease-in-out"
      leave-active-class="transition-opacity duration-1200 ease-in-out"
      enter-from-class="opacity-0!"
      leave-to-class="opacity-0!">
      <DetailImage
        v-if="activeShow && hasImage(activeShow)"
        :key="activeShow.id"
        class="absolute! inset-0 size-full from-slate-800 to-slate-950 opacity-70"
        image-class="object-[center_25%]!"
        :src="imageFor(activeShow)"
        alt=""
        eager
        @error="failedImages.add(imageFor(activeShow))" />
    </Transition>
    <div class="absolute inset-0 hero-overlay" />
    <div
      class="relative m-auto flex min-h-0 max-w-360 flex-col items-stretch px-12 pt-26 pb-5 max-md:px-6 max-md:pt-25">
      <template v-if="activeShow">
        <div
          class="flex items-center gap-2.5 text-xs font-bold tracking-widest text-slate-400 md:text-base">
          <span class="size-1.75 rounded-full bg-violet-300 shadow-lg shadow-violet-400/60" />
          THE WACHEE SPOTLIGHT
        </div>
        <Transition
          mode="out-in"
          enter-active-class="transition-opacity duration-250 ease-in-out"
          leave-active-class="transition-opacity duration-250 ease-in-out"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0">
          <ShowHero
            :key="activeShow.id"
            :show="activeShow"
            role="group"
            aria-roledescription="slide"
            :aria-label="`${activeIndex + 1} of ${shows.length}: ${activeShow.name}`">
            <template #actions>
              <router-link :to="{ name: 'show-detail', params: { id: activeShow.id } }">
                Explore show
                <ArrowRight class="size-5" />
              </router-link>
            </template>
          </ShowHero>
        </Transition>
        <FeaturedShowsPicker v-model="activeIndex" :shows="shows" />
      </template>
      <div
        v-else
        class="my-auto max-w-175 lg:max-w-250 py-12.5 [&_h1]:mt-3.5! [&_p]:text-slate-400"
        role="status">
        <span class="text-xs font-bold tracking-widest text-slate-400 md:text-base">
          THE WACHEE SPOTLIGHT
        </span>
        <h1
          class="m-0! mb-4! text-5xl! sm:text-6xl! lg:text-7xl! leading-tight font-bold! tracking-tighter! text-balance text-white! wrap-anywhere">
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
          @click="emit('retry')">
          Try again
        </button>
      </div>
    </div>
  </section>
</template>
