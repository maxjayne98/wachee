<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Show } from '@/types'
import Badge from '@/components/Badge.vue'

interface Props {
  show: Show
  isFavorite?: boolean
  tagline?: string
}

const props = withDefaults(defineProps<Props>(), {
  isFavorite: false,
  tagline: '',
})

const emit = defineEmits<{
  (e: 'click', show: Show): void
  (e: 'favorite', show: Show, isFavorite: boolean): void
  (e: 'share', show: Show): void
}>()

const isFav = ref(props.isFavorite)

const posterUrl = computed(() => {
  return props.show.image?.original || props.show.image?.medium || ''
})

const premiereYear = computed(() => {
  if (!props.show.premiered) return ''
  const date = new Date(props.show.premiered)
  return isNaN(date.getFullYear())
    ? props.show.premiered.slice(0, 4)
    : date.getFullYear().toString()
})

const networkName = computed(() => {
  return props.show.network?.name || props.show.type || 'TV'
})

const formattedRating = computed(() => {
  const avg = props.show.rating?.average
  return avg !== undefined && avg !== null ? avg.toFixed(1) : 'N/A'
})

const displayedGenres = computed(() => {
  return props.show.genres?.slice(0, 3) || []
})

const formattedTagline = computed(() => {
  if (props.tagline) {
    const text = props.tagline.replace(/<[^>]*>/g, '').trim()
    if (text.length > 45) {
      const dotIndex = text.indexOf('.')
      if (dotIndex > 0 && dotIndex <= 45) {
        return text.slice(0, dotIndex)
      }
      return text.slice(0, 42) + '...'
    }
    return text
  }
  return 'BRILLIANT MINDS\nA DARKER WORLD'
})

function handleFavorite(event: MouseEvent) {
  event.stopPropagation()
  isFav.value = !isFav.value
  emit('favorite', props.show, isFav.value)
}

function handleShare(event: MouseEvent) {
  event.stopPropagation()
  emit('share', props.show)
}

function handleCardClick() {
  emit('click', props.show)
}
</script>

<template>
  <article
    class="show-card group relative box-border w-[240px] shrink-0 cursor-pointer select-none rounded-[28px] bg-[linear-gradient(135deg,#0070f3_0%,#7928ca_40%,#c026d3_70%,#ff5722_100%)] p-[1.5px] shadow-[0_20px_40px_-10px_#000000b3,0_0_25px_-5px_#0070f340,0_0_25px_-5px_#ff572233] transition-[transform,box-shadow,filter] duration-350 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-[6px] hover:shadow-[0_28px_55px_-10px_#000000d9,0_0_35px_2px_#0070f366,0_0_35px_2px_#ff572259]"
    @click="handleCardClick"
  >
    <!-- Card Outer Glow Border Container -->
    <div
      class="show-card__inner relative box-border flex size-full flex-col overflow-hidden rounded-[26.5px] bg-[#080a10]"
    >
      <!-- Top Action Buttons (Overlay) -->
      <div
        class="show-card__top-actions absolute top-[18px] right-[18px] z-10 flex items-center gap-[12px]"
      >
        <button
          type="button"
          class="show-card__action-btn show-card__action-btn--share flex size-[42px] cursor-pointer items-center justify-center rounded-full border p-0 text-[#e2e8f0] backdrop-blur-[12px] transition-all duration-250 ease-in-out hover:scale-[1.08] hover:text-white border-white/14 bg-[#0a0e18]/65 hover:bg-white/15"
          aria-label="Share show"
          @click="handleShare"
        >
          <svg
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>

        <button
          type="button"
          class="show-card__action-btn show-card__action-btn--favorite flex size-[42px] cursor-pointer items-center justify-center rounded-full border p-0 text-[#e2e8f0] backdrop-blur-[12px] transition-all duration-250 ease-in-out hover:scale-[1.08] hover:text-white border-[#a855f7]/60 bg-[#1c0e2d]/70 hover:border-[#d946ef]/90 hover:bg-[#2d124b]/85"
          :class="
            isFav
              ? 'shadow-[0_0_18px_#ec4899b3]'
              : 'shadow-[0_0_12px_#a855f759] hover:shadow-[0_0_18px_#d946ef99]'
          "
          aria-label="Toggle favorite"
          @click="handleFavorite"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" class="favorite-icon">
            <defs>
              <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ff4b72" />
                <stop offset="50%" stop-color="#ff3366" />
                <stop offset="100%" stop-color="#ff8c37" />
              </linearGradient>
            </defs>
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              :fill="isFav ? 'url(#heartGradient)' : 'url(#heartGradient)'"
              stroke="none"
            />
          </svg>
        </button>
      </div>

      <!-- Poster Section with Seamless Bottom Fade -->
      <div class="show-card__poster-wrapper relative h-[330px] w-full overflow-hidden bg-[#0d111a]">
        <img
          v-if="posterUrl"
          :src="posterUrl"
          :alt="show.name"
          class="show-card__poster block size-full object-cover object-[center_15%] transition-transform duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div
          v-else
          class="show-card__poster-placeholder flex size-full items-center justify-center bg-[linear-gradient(135deg,#131825_0%,#080a10_100%)] p-[1.5rem] text-center text-[1.1rem] font-semibold text-[#64748b]"
        >
          <span>{{ show.name }}</span>
        </div>
        <div
          class="show-card__poster-overlay pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#080a101a_0%,#080a1000_35%,#080a1080_65%,#080a10eb_88%,#080a10_100%)]"
        />
      </div>

      <!-- Body / Details Section -->
      <div
        class="show-card__content relative z-2 -mt-[3.6rem] flex flex-col gap-[1.1rem] px-[1.5rem] pb-[1.6rem]"
      >
        <!-- Rating Pill & Tagline Row -->
        <div class="show-card__rating-tagline-row flex items-center gap-[1rem]">
          <div
            class="show-card__imdb-pill inline-flex shrink-0 items-center gap-[0.55rem] rounded-full border border-[#ff9900]/85 bg-[#0f121a] py-[0.3rem] pr-[0.9rem] pl-[0.35rem] shadow-[0_0_14px_#ff990059]"
          >
            <div
              class="show-card__imdb-badge inline-block rounded-full bg-[#f5c518] px-[0.45rem] py-[0.15rem] text-[0.72rem] leading-[1.2] font-black tracking-[-0.02em] text-black"
            >
              IMDb
            </div>
            <span class="show-card__imdb-score text-[1.15rem] leading-none font-bold text-white">{{
              formattedRating
            }}</span>
          </div>

          <div
            v-if="formattedTagline"
            class="show-card__tagline-text text-left text-[0.65rem] leading-[1.35] font-semibold tracking-[0.14em] whitespace-pre-line text-[#64748b] uppercase"
          >
            {{ formattedTagline }}
          </div>
        </div>

        <!-- Show Title & Network/Year Subtitle -->
        <div class="show-card__details flex flex-col gap-[0.25rem] text-left">
          <h3
            class="show-card__title m-0! truncate text-[2rem]! leading-[1.2] font-bold tracking-[-0.01em] text-white"
          >
            {{ show.name }}
          </h3>
          <p
            class="show-card__meta m-0 flex items-center gap-[0.45rem] text-[0.9rem] font-medium text-[#71717a]"
          >
            <span>{{ networkName }}</span>
            <span v-if="premiereYear" class="show-card__meta-dot text-[#52525b]">•</span>
            <span v-if="premiereYear">{{ premiereYear }}</span>
          </p>
        </div>

        <!-- Genre Glowing Badges -->
        <div
          v-if="displayedGenres.length > 0"
          class="show-card__genres mt-[0.2rem] flex flex-wrap items-center gap-[0.65rem]"
        >
          <Badge v-for="(genre, index) in displayedGenres" :key="genre" :color-index="index">
            {{ genre }}
          </Badge>
        </div>
      </div>
    </div>
  </article>
</template>
