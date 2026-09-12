<template>
  <section class="page-shell text-slate-300">
    <FeaturedShows :shows="topPickedShows" :loading="isLoading" :error="error" @retry="fetchShows(INITIAL_PAGES)" />
    <div class="mx-auto min-w-0 max-w-328 scroll-mt-25 px-8 pt-7 pb-16 text-left max-md:px-6 max-md:py-8">
      <div class="mb-7">
        <span class="text-base tracking-widest text-violet-300">FIND YOUR NEXT FAVORITE</span>
        <h2 class="mt-3! text-4xl! md:text-5xl! text-slate-100!">Explore the collection</h2>
      </div>
      <ShowFilters />
      <nav
        v-if="Object.keys(showsByGenres).length"
        class="mt-2 flex! flex-wrap gap-2 border-b border-white/10 pt-5.5 pb-7"
        aria-label="Browse by genre">
        <Badge
          v-for="(genre, index) in Object.keys(showsByGenres)"
          :key="genre"
          :color-index="index"
          size="regular"
          :href="`#${genreId(genre)}`"
          @click.prevent="scrollToGenre(genre)"
          >{{ genre }}</Badge
        >
      </nav>
      <section
        v-for="(shows, genre) in showsByGenres"
        :id="genreId(genre)"
        :key="genre"
        class="scroll-mt-25 focus:outline-none focus-visible:[&>h3]:underline focus-visible:[&>h3]:decoration-purple-500 focus-visible:[&>h3]:underline-offset-8 [content-visibility:auto] [contain-intrinsic-size:auto_560px]"
        tabindex="-1"
        :aria-label="genre">
        <h3 class="mt-8! mb-4! text-left text-3xl! font-bold text-slate-100!">
          {{ genre }}
        </h3>
        <div class="flex h-140 flex-row justify-start gap-4 overflow-x-auto p-2">
          <VirtualCarousel :items="shows">
            <template #default="{ item }">
              <ShowCard :show="item" :tagline="item.summary ?? ''" />
            </template>
          </VirtualCarousel>
        </div>
      </section>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useShowList } from '@/store/showList'
import ShowCard from '@/components/ShowCard.vue'
import ShowFilters from '@/components/ShowFilters.vue'
import VirtualCarousel from '@/components/VirtualCarousel.vue'
import FeaturedShows from '@/components/FeaturedShows.vue'
import Badge from '@/components/Badge.vue'

const INITIAL_PAGES = [1, 2, 3, 4, 5]
const { fetchShows, showsByGenres, topPickedShows, isLoading, error } = useShowList()

const genreId = (genre: string) => `genre-${encodeURIComponent(genre)}`
function scrollToGenre(genre: string) {
  const section = document.getElementById(genreId(genre))
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
