<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Show } from '@/types'

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

// Palette styles for genre badge glowing borders
const genreColorClasses = ['badge-cyan', 'badge-purple', 'badge-orange', 'badge-pink']

function getGenreClass(index: number) {
  return genreColorClasses[index % genreColorClasses.length]
}

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
  <article class="show-card" @click="handleCardClick">
    <!-- Card Outer Glow Border Container -->
    <div class="show-card__inner">
      <!-- Top Action Buttons (Overlay) -->
      <div class="show-card__top-actions">
        <button
          type="button"
          class="show-card__action-btn show-card__action-btn--share"
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
          class="show-card__action-btn show-card__action-btn--favorite"
          :class="{ 'is-active': isFav }"
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
      <div class="show-card__poster-wrapper">
        <img
          v-if="posterUrl"
          :src="posterUrl"
          :alt="show.name"
          class="show-card__poster"
          loading="lazy"
        />
        <div v-else class="show-card__poster-placeholder">
          <span>{{ show.name }}</span>
        </div>
        <div class="show-card__poster-overlay" />
      </div>

      <!-- Body / Details Section -->
      <div class="show-card__content">
        <!-- Big Textured Poster Title -->
        <h2 class="show-card__poster-title" :title="show.name">
          {{ show.name }}
        </h2>

        <!-- Rating Pill & Tagline Row -->
        <div class="show-card__rating-tagline-row">
          <div class="show-card__imdb-pill">
            <div class="show-card__imdb-badge">IMDb</div>
            <span class="show-card__imdb-score">{{ formattedRating }}</span>
          </div>

          <div v-if="formattedTagline" class="show-card__tagline-text">
            {{ formattedTagline }}
          </div>
        </div>

        <!-- Show Title & Network/Year Subtitle -->
        <div class="show-card__details">
          <h3 class="show-card__title">{{ show.name }}</h3>
          <p class="show-card__meta">
            <span>{{ networkName }}</span>
            <span v-if="premiereYear" class="show-card__meta-dot">•</span>
            <span v-if="premiereYear">{{ premiereYear }}</span>
          </p>
        </div>

        <!-- Genre Glowing Badges -->
        <div v-if="displayedGenres.length > 0" class="show-card__genres">
          <span
            v-for="(genre, index) in displayedGenres"
            :key="genre"
            class="show-card__genre-pill"
            :class="getGenreClass(index)"
          >
            {{ genre }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.show-card {
  position: relative;
  width: 280px;
  border-radius: 28px;
  flex-shrink: 0;
  padding: 1.5px;
  background: linear-gradient(135deg, #0070f3 0%, #7928ca 40%, #c026d3 70%, #ff5722 100%);
  box-shadow:
    0 20px 40px -10px rgba(0, 0, 0, 0.7),
    0 0 25px -5px rgba(0, 112, 243, 0.25),
    0 0 25px -5px rgba(255, 87, 34, 0.2);
  user-select: none;
  cursor: pointer;
  box-sizing: border-box;
  transition:
    transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 0.35s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow:
      0 28px 55px -10px rgba(0, 0, 0, 0.85),
      0 0 35px 2px rgba(0, 112, 243, 0.4),
      0 0 35px 2px rgba(255, 87, 34, 0.35);

    .show-card__poster {
      transform: scale(1.04);
    }
  }

  // Inner container with dark background
  &__inner {
    position: relative;
    width: 100%;
    height: 100%;
    background: #080a10;
    border-radius: 26.5px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  // Top Action Icons
  &__top-actions {
    position: absolute;
    top: 18px;
    right: 18px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__action-btn {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(10, 14, 24, 0.65);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.14);
    color: #e2e8f0;
    cursor: pointer;
    padding: 0;
    transition: all 0.25s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      transform: scale(1.08);
    }

    &--favorite {
      background: rgba(28, 14, 45, 0.7);
      border: 1px solid rgba(168, 85, 247, 0.6);
      box-shadow: 0 0 12px rgba(168, 85, 247, 0.35);

      &:hover {
        background: rgba(45, 18, 75, 0.85);
        border-color: rgba(217, 70, 239, 0.9);
        box-shadow: 0 0 18px rgba(217, 70, 239, 0.6);
      }

      &.is-active {
        box-shadow: 0 0 18px rgba(236, 72, 153, 0.7);
      }
    }
  }

  // Poster Image & Seamless Fade
  &__poster-wrapper {
    position: relative;
    width: 100%;
    height: 330px;
    background: #0d111a;
    overflow: hidden;
  }

  &__poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 15%;
    display: block;
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  }

  &__poster-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #131825 0%, #080a10 100%);
    color: #64748b;
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
    padding: 1.5rem;
  }

  &__poster-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(8, 10, 16, 0.1) 0%,
      rgba(8, 10, 16, 0) 35%,
      rgba(8, 10, 16, 0.5) 65%,
      rgba(8, 10, 16, 0.92) 88%,
      #080a10 100%
    );
    pointer-events: none;
  }

  // Content Area
  &__content {
    position: relative;
    padding: 0 1.5rem 1.6rem;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    margin-top: -3.6rem;
    z-index: 2;
  }

  // Poster Title (Large & Distressed / Stylized)
  &__poster-title {
    margin: 0;
    font-size: 2.2rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #f1f5f9;
    line-height: 1.1;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow:
      0 4px 14px rgba(0, 0, 0, 0.95),
      0 0 25px rgba(255, 255, 255, 0.2);
  }

  // IMDb Pill + Tagline Row
  &__rating-tagline-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__imdb-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    background: #0f121a;
    border: 1px solid rgba(255, 153, 0, 0.85);
    box-shadow: 0 0 14px rgba(255, 153, 0, 0.35);
    border-radius: 9999px;
    padding: 0.3rem 0.9rem 0.3rem 0.35rem;
    flex-shrink: 0;
  }

  &__imdb-badge {
    background: #f5c518;
    color: #000000;
    font-size: 0.72rem;
    font-weight: 900;
    padding: 0.15rem 0.45rem;
    border-radius: 9999px;
    letter-spacing: -0.02em;
    line-height: 1.2;
    display: inline-block;
  }

  &__imdb-score {
    color: #ffffff;
    font-size: 1.15rem;
    font-weight: 700;
    line-height: 1;
  }

  &__tagline-text {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: #64748b;
    text-transform: uppercase;
    line-height: 1.35;
    white-space: pre-line;
  }

  // Show Details (Name + Network/Year)
  &__details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    text-align: left;
  }

  &__title {
    margin: 0;
    font-size: 1.55rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.01em;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 500;
    color: #71717a;
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  &__meta-dot {
    color: #52525b;
  }

  // Genre Badges (Glowing Pill Badges)
  &__genres {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.65rem;
    margin-top: 0.2rem;
  }

  &__genre-pill {
    padding: 0.45rem 1.15rem;
    border-radius: 9999px;
    background: rgba(12, 16, 26, 0.75);
    font-size: 0.8rem;
    font-weight: 600;
    color: #e2e8f0;
    letter-spacing: 0.02em;
    text-transform: capitalize;
    white-space: nowrap;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }

    &.badge-cyan {
      border: 1.5px solid #0099ff;
      box-shadow: 0 0 10px rgba(0, 153, 255, 0.35);
    }

    &.badge-purple {
      border: 1.5px solid #a855f7;
      box-shadow: 0 0 10px rgba(168, 85, 247, 0.35);
    }

    &.badge-orange {
      border: 1.5px solid #ff5533;
      box-shadow: 0 0 10px rgba(255, 85, 51, 0.35);
    }

    &.badge-pink {
      border: 1.5px solid #ec4899;
      box-shadow: 0 0 10px rgba(236, 72, 153, 0.35);
    }
  }
}
</style>
