<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Show } from '@/types'
import Badge from '@/components/Badge.vue'

const props = defineProps<{ shows: Show[]; loading: boolean; error: string }>()
const emit = defineEmits<{ retry: [] }>()
const DURATION = 10_000
const activeIndex = ref(0)
const picks = ref<HTMLElement | null>(null)
const progress = ref(0)
const paused = ref(false)
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
    if (paused.value || document.hidden || props.shows.length < 2) return
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
    class="featured relative isolate min-h-0 overflow-hidden bg-[#090b12] text-left text-white [&_a]:no-underline [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-[#e5d5ff] [&_button:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-[#e5d5ff] [&_a:focus-visible]:outline-offset-4 motion-reduce:[&_*]:transition-none! after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-[linear-gradient(90deg,#0070f3,#7928ca_40%,#c026d3_70%,#ff5722)] after:shadow-[0_0_16px_#a855f770] after:content-['']"
    aria-label="Top picks for you"
    aria-roledescription="carousel"
  >
    <Transition
      enter-active-class="transition-opacity duration-1200 ease-in-out"
      leave-active-class="transition-opacity duration-1200 ease-in-out"
      enter-from-class="opacity-0!"
      leave-to-class="opacity-0!"
    >
      <img
        v-if="activeShow && hasImage(activeShow)"
        :key="activeShow.id"
        class="featured__backdrop absolute inset-0 size-full object-cover object-[center_25%] opacity-70"
        :src="imageFor(activeShow)"
        alt=""
        fetchpriority="high"
        @error="failedImages.add(imageFor(activeShow))"
      />
    </Transition>
    <div
      class="featured__shade absolute inset-0 bg-[linear-gradient(90deg,#090b12f5,#090b1299_45%,#090b1214),linear-gradient(0deg,#090b12_0%,transparent_65%,#090b12a6)] max-[701px]:bg-[linear-gradient(90deg,#090b12c9,#090b124d),linear-gradient(0deg,#090b12_3%,#090b1240_80%,#090b12a6)]"
    />
    <div
      class="featured__inner relative m-auto box-border flex min-h-0 max-w-[1440px] flex-col items-stretch px-[48px] pt-[104px] pb-[20px] max-[701px]:px-[24px] max-[701px]:pt-[100px]"
    >
      <template v-if="activeShow">
        <div
          class="featured__eyebrow flex items-center gap-[10px] text-[1rem] font-bold tracking-[0.24em] text-[#b9b7c5]"
        >
          <span class="size-[7px] rounded-full bg-[#c6adff] shadow-[0_0_18px_#b48cff]" /> THE WACHEE
          SPOTLIGHT
        </div>
        <Transition
          mode="out-in"
          enter-active-class="transition-[opacity,transform] duration-250 ease-in-out"
          leave-active-class="transition-[opacity,transform] duration-250 ease-in-out"
          enter-from-class="opacity-0 translate-y-[10px]"
          leave-to-class="opacity-0 -translate-y-[10px]"
        >
          <div
            :key="activeShow.id"
            class="featured__details max-w-[680px] flex-1 pt-[20px] pb-[24px] max-[701px]:pt-[24px]"
            role="group"
            aria-roledescription="slide"
            :aria-label="`${activeIndex + 1} of ${shows.length}: ${activeShow.name}`"
          >
            <div class="featured__genres mb-[14px] flex flex-wrap gap-[8px]">
              <Badge
                v-for="(genre, index) in activeShow.genres.slice(0, 3)"
                :key="genre"
                :color-index="index"
                size="regular"
                >{{ genre }}</Badge
              >
              <Badge v-if="!activeShow.genres.length" size="regular">{{ activeShow.type }}</Badge>
            </div>
            <h1
              class="m-0! mb-[16px]! text-[clamp(3.6rem,4vw,5.6rem)]! leading-[1.02] font-[750]! tracking-[-0.045em]! text-balance text-white! [overflow-wrap:anywhere]"
            >
              {{ activeShow.name }}
            </h1>
            <div
              class="featured__meta flex flex-wrap items-center gap-[20px] text-[1.3rem] text-[#d5d3df]"
            >
              <span
                v-if="activeShow.rating.average != null"
                class="featured__rating inline-flex items-center gap-[7px] rounded-full border border-[#ff9900d9] bg-[#0f121a] py-[4px] pr-[10px] pl-[4px] font-bold text-white shadow-[0_0_14px_#ff990059]"
                ><span
                  class="featured__rating-label inline-flex size-[22px] items-center justify-center rounded-full bg-[#f5c518] text-[#080a10]"
                  >★</span
                >
                {{ activeShow.rating.average.toFixed(1) }}
                <small class="font-normal text-[#aaa7b6]">/ 10</small></span
              >
              <span v-if="activeShow.premiered">{{ activeShow.premiered.slice(0, 4) }}</span>
              <span v-if="activeShow.runtime">{{ activeShow.runtime }} min</span>
              <span v-if="activeShow.language">{{ activeShow.language }}</span>
            </div>
            <p
              class="featured__summary mt-[14px]! line-clamp-2 max-w-[560px] text-[1.6rem] leading-[1.6] text-[#c0bfcb]"
            >
              {{
                summary ||
                'Your next great story starts here. Discover this pick and find something new to love.'
              }}
            </p>
            <div class="featured__actions mt-[18px] flex flex-wrap items-center gap-[26px]">
              <a
                :href="activeShow.url"
                target="_blank"
                rel="noopener noreferrer"
                class="featured__primary inline-flex cursor-pointer items-center justify-center gap-[32px] rounded-full border-[1.5px] border-transparent [background:linear-gradient(#151022,#151022)_padding-box,linear-gradient(135deg,#0070f3,#7928ca_40%,#c026d3_70%,#ff5722)_border-box]! px-[22px] py-[12px] text-[1.4rem]! font-[750] text-[#f1eaff] shadow-[0_0_18px_#a855f735] transition-[background] duration-200 hover:shadow-[0_0_24px_#a855f770]"
                >Explore show <span aria-hidden="true">↗</span></a
              >
              <a
                href="#browse-shows"
                class="featured__browse inline-flex gap-[16px] text-[1.3rem] text-[#e3e0ec]"
                >Browse collection <span aria-hidden="true">↓</span></a
              >
            </div>
          </div>
        </Transition>
        <div class="featured__selection mt-auto min-w-0">
          <div
            class="featured__selection-heading mb-[12px] flex items-center justify-between gap-[16px] max-[701px]:[&_.featured__eyebrow]:text-[0.8rem] max-[701px]:[&_.featured__eyebrow]:tracking-[0.12em]"
          >
            <div>
              <span
                class="featured__eyebrow flex items-center gap-[10px] text-[1rem] font-bold tracking-[0.24em] text-[#b9b7c5]"
                >CURATED FOR YOUR NEXT OBSESSION</span
              >
              <h2
                class="m-0! mt-[9px]! flex flex-wrap items-center gap-[20px] text-[2.3rem]! text-white! max-[701px]:gap-[10px] max-[701px]:text-[1.8rem]!"
              >
                Top picks for you<span
                  class="featured__count text-[1.1rem] tracking-[0.1em] text-[#9894a6]"
                  >{{ String(activeIndex + 1).padStart(2, '0') }} /
                  {{ String(shows.length).padStart(2, '0') }}</span
                >
              </h2>
            </div>
            <div
              v-if="shows.length > 1"
              class="featured__controls flex gap-[8px] max-[701px]:gap-[5px]"
            >
              <button
                class="size-[40px] cursor-pointer rounded-full border border-[#ffffff26] bg-[#ffffff09] text-white hover:bg-[#ffffff20] max-[701px]:size-[34px]"
                aria-label="Previous pick"
                @click="select(activeIndex - 1)"
              >
                ←
              </button>
              <button
                class="size-[40px] cursor-pointer rounded-full border border-[#ffffff26] bg-[#ffffff09] text-white hover:bg-[#ffffff20] max-[701px]:size-[34px]"
                :aria-label="paused ? 'Resume slideshow' : 'Pause slideshow'"
                :aria-pressed="paused"
                @click="paused = !paused"
              >
                {{ paused ? '▶' : 'Ⅱ' }}
              </button>
              <button
                class="size-[40px] cursor-pointer rounded-full border border-[#ffffff26] bg-[#ffffff09] text-white hover:bg-[#ffffff20] max-[701px]:size-[34px]"
                aria-label="Next pick"
                @click="select(activeIndex + 1)"
              >
                →
              </button>
            </div>
          </div>
          <div
            ref="picks"
            class="featured__picks flex gap-[12px] overflow-x-auto px-[3px] pt-[3px] pb-[12px] [scrollbar-width:thin] [scrollbar-color:#51495e_transparent]"
          >
            <button
              v-for="(show, index) in shows"
              :key="show.id"
              class="featured__pick relative h-[72px] flex-[0_0_164px] cursor-pointer overflow-hidden rounded-[18px] border text-left text-white hover:border-[#d9c7ff] max-[701px]:basis-[140px] after:absolute after:inset-0 after:bg-[linear-gradient(0deg,#090b12ed,#090b1233)] after:content-['']"
              :class="
                index === activeIndex
                  ? 'border-transparent [background:linear-gradient(#080a10,#080a10)_padding-box,linear-gradient(135deg,#0070f3,#7928ca_40%,#c026d3_70%,#ff5722)_border-box] shadow-[0_0_12px_#a855f74d]'
                  : 'border-[#ffffff26] bg-[#1c1b28]'
              "
              :aria-pressed="index === activeIndex"
              :aria-label="`Show ${show.name}`"
              @click="select(index)"
            >
              <img
                v-if="hasImage(show)"
                class="size-full object-cover object-[center_25%]"
                :class="index === activeIndex ? 'opacity-100' : 'opacity-60'"
                :src="imageFor(show)"
                alt=""
                loading="lazy"
                @error="failedImages.add(imageFor(show))"
              />
              <span
                class="featured__pick-number absolute top-[10px] left-[12px] z-1 text-[1rem] text-[#ded5ed]"
                >{{ String(index + 1).padStart(2, '0') }}</span
              >
              <span
                class="featured__pick-title absolute right-[10px] bottom-[15px] left-[12px] z-1 truncate text-[1.2rem] font-[650]"
                >{{ show.name }}</span
              >
              <span
                v-if="index === activeIndex"
                class="featured__progress absolute inset-x-0 bottom-0 z-2 h-[3px] bg-[#ffffff30]"
                ><span
                  class="block h-full origin-left bg-[#d9c7ff] transition-transform duration-100 ease-linear"
                  :style="{ transform: `scaleX(${progress})` }"
              /></span>
            </button>
          </div>
        </div>
      </template>
      <div
        v-else
        class="featured__empty my-auto max-w-[700px] py-[50px] [&_h1]:mt-[14px]! [&_p]:mb-[24px] [&_p]:text-[#b9b7c5]"
        role="status"
      >
        <span
          class="featured__eyebrow flex items-center gap-[10px] text-[1rem] font-bold tracking-[0.24em] text-[#b9b7c5]"
          >THE WACHEE SPOTLIGHT</span
        >
        <h1
          class="m-0! mb-[16px]! text-[clamp(3.6rem,4vw,5.6rem)]! leading-[1.02] font-[750]! tracking-[-0.045em]! text-balance text-white! [overflow-wrap:anywhere]"
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
          class="featured__primary inline-flex cursor-pointer items-center justify-center gap-[32px] rounded-full border-[1.5px] border-transparent [background:linear-gradient(#151022,#151022)_padding-box,linear-gradient(135deg,#0070f3,#7928ca_40%,#c026d3_70%,#ff5722)_border-box]! px-[22px] py-[12px] text-[1.4rem]! font-[750] text-[#f1eaff] shadow-[0_0_18px_#a855f735] transition-[background] duration-200 hover:shadow-[0_0_24px_#a855f770]"
          @click="emit('retry')"
        >
          Try again ↗
        </button>
        <a
          v-else-if="!loading"
          href="#browse-shows"
          class="featured__browse inline-flex gap-[16px] text-[1.3rem] text-[#e3e0ec]"
          >Adjust filters ↓</a
        >
      </div>
    </div>
  </section>
</template>
