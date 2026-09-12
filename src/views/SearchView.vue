<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Magnifier from '@/components/base/icons/Magnifier.vue'
import { useShowSearch } from '@/composables/useShowSearch'
import ShowCard from '@/components/shared/ShowCard.vue'

const route = useRoute()
const query = computed(() => {
  const value = route.query.q
  return (Array.isArray(value) ? (value[0] ?? '') : (value ?? '')).trim()
})

const { searchResult, isLoading, error, retry } = useShowSearch(query)
</script>

<template>
  <section class="page-shell text-left text-slate-200">
    <div class="mx-auto max-w-360 px-6 pt-28 pb-16 sm:px-12 lg:px-16">
      <div class="mt-6 mb-8 border-b border-white/10 pb-8">
        <h1
          class="mt-3! mb-4! text-3xl! font-bold text-white! sm:text-4xl! [overflow-wrap:anywhere]">
          {{ query ? `Results for “${query}”` : 'Find your next favorite' }}
        </h1>
        <p role="status" aria-live="polite" class="text-sm text-slate-400">
          {{
            isLoading
              ? 'Searching the collection…'
              : error
                ? 'Search is temporarily unavailable.'
                : query
                  ? `${searchResult.length} ${searchResult.length === 1 ? 'show' : 'shows'} found`
                  : 'Search for a show using the search bar above.'
          }}
        </p>
      </div>
      <div
        v-if="isLoading"
        aria-hidden="true"
        class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="item in 12"
          :key="item"
          class="relative box-border flex min-w-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950 text-left shadow-lg shadow-black/20 motion-reduce:animate-none">
          <div class="relative aspect-4/5 w-full overflow-hidden bg-slate-900 animate-pulse">
            <div
              class="size-full bg-linear-to-b from-slate-800/40 via-transparent to-slate-950/80" />
          </div>
          <div
            class="relative -mt-8 flex flex-1 flex-col rounded-t-3xl border-t border-sky-200/15 bg-linear-to-br from-slate-800/85 via-slate-900/95 to-slate-950 px-5 pt-5 pb-4 backdrop-blur-xl">
            <div class="mb-2 flex items-center gap-2">
              <div class="h-3 w-20 rounded-full bg-slate-700/60 animate-pulse" />
            </div>
            <div class="mb-3 min-h-14 flex flex-col gap-2">
              <div class="h-5 w-4/5 rounded-md bg-slate-700/70 animate-pulse" />
            </div>
            <div class="flex flex-wrap gap-1.5 pb-4">
              <div class="h-5 w-14 rounded-full bg-slate-800 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <div
        v-else-if="error"
        role="alert"
        class="rounded-3xl border border-sky-400/20 bg-slate-900/50 px-6 py-12 text-center">
        <h2 class="text-xl! text-white!">We couldn’t load your results</h2>
        <p class="mt-3! text-sm text-slate-400">Please try again in a moment.</p>
        <button
          class="mt-6 cursor-pointer rounded-full bg-sky-600 px-6 py-3 text-sm! font-semibold text-white hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-sky-200 focus-visible:outline-offset-2"
          @click="retry">
          Try again
        </button>
      </div>
      <div
        v-else-if="searchResult.length"
        class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <ShowCard v-for="show in searchResult" :key="show.id" :show="show" />
      </div>
      <div
        v-else
        class="rounded-3xl border border-white/10 bg-linear-to-br from-sky-950/30 to-slate-950 px-6 py-16 text-center">
        <Magnifier aria-hidden="true" class="mx-auto mb-6 size-10 stroke-sky-400" />
        <h2 class="text-xl! text-white!">
          {{ query ? 'No shows found' : 'Every great watch starts with a search' }}
        </h2>
        <p class="mx-auto mt-3! max-w-md text-sm leading-relaxed text-slate-400">
          {{
            query
              ? 'Try a different title or check the spelling in the search bar above.'
              : 'Enter a show title above to explore the collection.'
          }}
        </p>
      </div>
    </div>
  </section>
</template>
