<template>
  <section
    class="home-view bg-[#090b12] text-[#c0bfcb] [#app:has(&)]:w-full! [#app:has(&)]:mt-0! [body:has(&)]:bg-[#090b12]!"
  >
    <FeaturedShows
      :shows="topPicksShows"
      :loading="isLoading"
      :error="error"
      @retry="fetchShows(INITIAL_PAGES)"
    />
    <div
      id="browse-shows"
      class="home-catalog mx-auto min-w-0 max-w-328 scroll-mt-25 px-8 pt-7 pb-16 text-left max-[701px]:px-6 max-[701px]:py-8 max-[701px]:[&_label]:min-w-0 max-[701px]:[&_label]:max-w-full"
    >
      <div class="catalog-heading mb-7">
        <span class="text-[1rem] tracking-[0.2em] text-[#b7a3d5]">FIND YOUR NEXT FAVORITE</span>
        <h2 class="mt-3! text-[3rem]! text-[#f5f2fc]!">Explore the collection</h2>
      </div>
      <ShowFilters />
      <nav
        v-if="Object.keys(showsByGenres).length"
        class="genre-navigation mt-2 flex! flex-wrap gap-2 border-b border-[#ffffff12] pt-[22px] pb-[28px]"
        aria-label="Browse by genre"
      >
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
        class="genre-section scroll-mt-25 focus:outline-none focus-visible:[&_.card-title]:underline focus-visible:[&_.card-title]:decoration-[#a855f7] focus-visible:[&_.card-title]:underline-offset-8"
        tabindex="-1"
        :aria-label="genre"
      >
        <div class="card-title mt-8 mb-4 text-left text-[2rem] font-bold text-[#f5f2fc]">
          {{ genre }}
        </div>
        <div
          class="show-card-container flex h-150 flex-row justify-start gap-4 overflow-x-auto p-2"
        >
          <VirtualCarousel :items="shows" :item-width="240" :gap="16">
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
const { fetchShows, showsByGenres, topPicksShows, isLoading, error } = useShowList()

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
