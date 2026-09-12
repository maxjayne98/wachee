<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useShowDetail } from '@/composables/useShowDetail'
import Tabs from '@/components/base/Tabs.vue'
import ShowDetailOverview from '@/components/pages/detail/ShowDetailOverview.vue'
import ShowDetailCastInfo from '@/components/pages/detail/ShowDetailCastInfo.vue'
import ShowDetailEpisodeInfo from '@/components/pages/detail/ShowDetailEpisodeInfo.vue'
import ShowHero from '@/components/shared/ShowHero.vue'
import DetailImage from '@/components/base/DetailImage.vue'
import ArrowRight from '@/components/base/icons/ArrowRight.vue'

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
  id,
  () => {
    activeSection.value = 'overview'
  },
  { immediate: true }
)
</script>

<template>
  <div
    class="show-detail min-h-svh bg-slate-950 text-left text-slate-200 [#app:has(&)]:mt-0! [#app:has(&)]:w-full! [body:has(&)]:bg-slate-950! [&_a]:no-underline [&_button]:cursor-pointer [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-sky-300 [&_button:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-sky-300 [&_a:focus-visible]:outline-offset-4">
    <div v-if="loading" class="page-container pt-32 pb-16" role="status">
      <p class="mb-8! text-sm text-sky-200">Loading the story…</p>
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
    <div
      v-else-if="error || !show"
      class="mx-auto max-w-2xl px-6 pt-40 pb-20 text-center"
      role="alert">
      <p class="text-sm text-sky-300">WACHEE</p>
      <h1 class="my-6! text-4xl! text-white!">
        {{ error === 'Show not found' ? 'Show not found' : 'This story couldn’t load' }}
      </h1>
      <p class="text-slate-400">
        {{
          error === 'Show not found'
            ? 'This show may have been removed, or the link is incorrect.'
            : 'Please try again in a moment.'
        }}
      </p>
      <div class="mt-8 flex justify-center gap-4">
        <button
          v-if="error !== 'Show not found'"
          class="rounded-full bg-sky-600 px-6 py-3 text-sm! text-white"
          @click="retry">
          Try again
        </button>
        <router-link
          to="/"
          class="rounded-full border border-slate-600 px-6 py-3 text-sm text-slate-200">
          Back to discover
        </router-link>
      </div>
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
          <ShowHero :show="show">
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
        <ShowDetailCastInfo id="detail-cast" :cast="cast" />
        <ShowDetailEpisodeInfo
          id="detail-episodes"
          v-model:selected-season="selectedSeason"
          :seasons="seasons"
          :episodes="episodes"
          :episodes-error="episodesError"
          :episodes-loading="episodesLoading"
          @retry-episodes="retryEpisodes" />
      </div>
    </template>
  </div>
</template>
