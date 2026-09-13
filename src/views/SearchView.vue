<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useShowSearch } from '@/composables/useShowSearch'
import ShowCard from '@/components/shared/ShowCard.vue'
import ShowCardSkeleton from '@/components/shared/ShowCardSkeleton.vue'
import StateMessage from '@/components/shared/StateMessage.vue'

const route = useRoute()
const query = computed(() => {
  const value = route.query.q
  return (Array.isArray(value) ? (value[0] ?? '') : (value ?? '')).trim()
})

const { searchResult, isLoading, error, retry } = useShowSearch(query)
</script>

<template>
  <main class="page-shell text-left text-slate-200">
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
        <ShowCardSkeleton v-for="item in 12" :key="item" />
      </div>
      <StateMessage
        v-else-if="error"
        title="Unable to load results"
        :message="error"
        @retry="retry" />
      <div
        v-else-if="searchResult.length"
        class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <ShowCard v-for="show in searchResult" :key="show.id" :show="show" />
      </div>
      <StateMessage
        v-else
        :title="query ? 'No shows found' : 'Search the collection'" />
    </div>
  </main>
</template>
