<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useShowDetail } from '@/composables/useShowDetail'
import Tabs from '@/components/base/Tabs.vue'
import ShowDetailOverview from '@/components/pages/detail/ShowDetailOverview.vue'
import ShowDetailCast from '@/components/pages/detail/ShowDetailCast.vue'
import ShowDetailEpisodes from '@/components/pages/detail/ShowDetailEpisodes.vue'
import ShowHero from '@/components/shared/ShowHero.vue'
import DetailImage from '@/components/base/DetailImage.vue'
import ArrowRight from '@/components/base/icons/ArrowRight.vue'
import StateMessage from '@/components/shared/StateMessage.vue'

const route = useRoute()
const id = computed(() => Number(route.params.id))
const {
  show,
  cast,
  seasons,
  episodes,
  selectedSeason,
  backdrop,
  loading,
  error,
  episodesLoading,
  episodesError,
  retry,
  retryEpisodes,
} = useShowDetail(id)
const activeSection = ref('overview')
const sections = computed(() => [
  { label: 'overview', href: 'detail-overview' },
  { label: 'episodes', href: 'detail-episodes' },
  { label: 'cast', href: 'detail-cast' },
])

watch(
  () => show.value?.id,
  () => {
    activeSection.value = 'overview'
  }
)
</script>

<template>
  <main class="page-shell">
    <div v-if="loading" class="page-container pt-32 pb-20">
      <div
        aria-hidden="true"
        class="flex animate-pulse flex-col gap-8 sm:flex-row motion-reduce:animate-none">
        <div class="h-80 w-52 rounded-3xl bg-slate-800" />
        <div class="flex flex-1 flex-col gap-6 py-6">
          <div class="h-12 w-2/3 rounded-xl bg-slate-800" />
          <div class="h-6 w-1/3 rounded-xl bg-slate-800" />
          <div class="h-24 rounded-xl bg-slate-800/50" />
        </div>
      </div>
    </div>
    <div v-else-if="error || !show" class="mx-auto max-w-2xl px-6 pt-40 pb-20">
      <StateMessage
        :title="error === 'Show not found' ? 'Show not found' : 'Unable to load show'"
        :retry-label="error !== 'Show not found' ? 'Try again' : undefined"
        @retry="error !== 'Show not found' ? retry() : undefined">
        <template #actions>
          <router-link
            to="/"
            class="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-5 py-2 text-sm font-semibold text-slate-200 shadow-sm transition hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-violet-300 focus-visible:outline-2 focus-visible:outline-violet-400">
            Back to discover
          </router-link>
        </template>
      </StateMessage>
    </div>
    <template v-else>
      <section class="relative isolate overflow-hidden">
        <DetailImage
          :src="backdrop"
          alt=""
          eager
          class="absolute! inset-0 size-full opacity-70"
          image-class="object-[center_25%]!" />
        <div aria-hidden="true" class="absolute inset-0 hero-overlay" />
        <div class="page-container relative pt-26 pb-5 max-md:pt-25">
          <div
            class="flex items-center gap-2.5 text-xs font-bold tracking-widest text-slate-400 md:text-base">
            <span class="size-1.75 rounded-full bg-violet-300 shadow-lg shadow-violet-400/60" />
            Discover {{ show.name }}
          </div>
          <ShowHero :show="show" :show-summary="false">
            <template #actions>
              <a
                :href="show.officialSite || show.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-sm! font-medium text-slate-300 transition-colors hover:border-white/30 hover:bg-white/5 hover:text-white">
                {{ show.officialSite ? 'Official website' : 'View on TVmaze' }}
                <ArrowRight class="size-5 -rotate-45" />
              </a>
            </template>
          </ShowHero>
        </div>
      </section>
      <div class="page-container pb-16">
        <nav aria-label="Show sections" class="mb-8 flex! gap-6 border-b border-white/10 sm:gap-8">
          <Tabs v-model="activeSection" :sections="sections" />
        </nav>
        <ShowDetailOverview id="detail-overview" :show="show" />
        <ShowDetailCast id="detail-cast" :cast="cast" />
        <ShowDetailEpisodes
          id="detail-episodes"
          v-model:selected-season="selectedSeason"
          :seasons="seasons"
          :episodes="episodes"
          :episodes-error="episodesError"
          :episodes-loading="episodesLoading"
          @retry-episodes="retryEpisodes" />
      </div>
    </template>
  </main>
</template>
