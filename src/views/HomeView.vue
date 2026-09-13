<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useShows } from '@/store/shows'
import ShowCard from '@/components/shared/ShowCard.vue'
import ShowCardSkeleton from '@/components/shared/ShowCardSkeleton.vue'
import ShowFilters from '@/components/pages/home/ShowFilters.vue'
import VirtualCarousel from '@/components/pages/home/VirtualCarousel.vue'
import FeaturedShows from '@/components/pages/home/FeaturedShows.vue'
import Badge from '@/components/base/Badge.vue'
import StateMessage from '@/components/shared/StateMessage.vue'

const INITIAL_PAGES = [1, 2, 3, 4, 5]
const { fetchShows, showsByGenre, featuredShows, isLoading, error } = useShows()

const genreSections = computed(() =>
  Object.entries(showsByGenre.value)
    .sort(([genreA], [genreB]) => genreA.localeCompare(genreB))
    .map(([genre, shows], index) => ({
      genre,
      colorIndex: index,
      shows,
      id: `genre-${encodeURIComponent(genre)}`,
      href: `#genre-${encodeURIComponent(genre)}`,
    }))
)

function scrollToSection(id: string) {
  const section = document.getElementById(id)
  if (!section) return
  section.focus({ preventScroll: true })
  section.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'start',
  })
}

onMounted(async () => {
  await fetchShows(INITIAL_PAGES)
})
</script>

<template>
  <main class="page-shell text-slate-300">
    <FeaturedShows
      :shows="featuredShows"
      :loading="isLoading"
      :error="error"
      @retry="fetchShows(INITIAL_PAGES)" />
    <div class="page-container scroll-mt-25 pt-7 pb-16 text-left max-md:py-8">
      <div class="mb-7">
        <h2 class="mt-3! text-4xl! md:text-5xl! text-slate-100!">Explore the collection</h2>
      </div>
      <ShowFilters />
      <div v-if="isLoading" class="space-y-10">
        <section v-for="i in 2" :key="i" class="scroll-mt-25">
          <div class="mt-8 mb-4 h-8 w-44 rounded-lg bg-slate-800/80 animate-pulse" />
          <div class="flex gap-4 overflow-hidden p-2">
            <div v-for="j in 5" :key="j" class="w-60 shrink-0">
              <ShowCardSkeleton />
            </div>
          </div>
        </section>
      </div>

      <StateMessage
        v-else-if="error && !genreSections.length"
        class="mt-8"
        title="Unable to load shows"
        :message="error"
        @retry="fetchShows(INITIAL_PAGES)" />

      <StateMessage v-else-if="!genreSections.length" class="mt-8" title="No shows found" />

      <template v-else>
        <TransitionGroup
          tag="nav"
          class="relative mt-2 flex! flex-wrap gap-2 border-b border-white/10 pt-5.5 pb-7"
          aria-label="Browse by genre"
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-300 ease-in"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
          move-class="transition-transform duration-300 ease-out">
          <Badge
            v-for="section in genreSections"
            :key="section.genre"
            :color-index="section.colorIndex"
            size="regular"
            :href="section.href"
            @click.prevent="scrollToSection(section.id)">
            {{ section.genre }}
          </Badge>
        </TransitionGroup>
        <section
          v-for="section in genreSections"
          :id="section.id"
          :key="section.genre"
          class="scroll-mt-25 focus:outline-none focus-visible:[&>h3]:underline focus-visible:[&>h3]:decoration-purple-500 focus-visible:[&>h3]:underline-offset-8 [content-visibility:auto] [contain-intrinsic-size:auto_560px]"
          tabindex="-1"
          :aria-label="section.genre">
          <h3 class="mt-8! mb-4! text-left text-3xl! font-bold text-slate-100!">
            {{ section.genre }}
          </h3>
          <div class="flex h-125 flex-row justify-start gap-4 overflow-x-auto p-2">
            <VirtualCarousel :items="section.shows">
              <template #default="{ item }">
                <ShowCard :show="item" :tagline="item.summary ?? ''" />
              </template>
            </VirtualCarousel>
          </div>
        </section>
      </template>
    </div>
  </main>
</template>
