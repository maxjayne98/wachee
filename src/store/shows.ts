import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { fetchShowsPage } from '@/api/shows'
import type { Show } from '@/types'
import { sortShowsByRating, shuffle } from '@/utils'

export interface ShowFiltersState {
  language: string
  runtime: string
  rating: number
}

const DEFAULT_FILTERS: ShowFiltersState = {
  language: '',
  runtime: '',
  rating: 1,
}

export const useShowsStore = defineStore('shows', () => {
  const allShows = ref<Show[]>([])
  const error = ref<string>('')
  const isLoading = ref<boolean>(false)
  const filters = ref<ShowFiltersState>({ ...DEFAULT_FILTERS })
  const featuredShows = computed(() => selectFeaturedShows(allShows.value))
  const loadedPages = new Set<number>()

  const filteredShows = computed(() => {
    const { language, runtime, rating } = filters.value
    const hasRatingFilter = rating > 1

    if (!language && !runtime && !hasRatingFilter) {
      return allShows.value
    }

    return allShows.value.filter(show => {
      if (language && show.language !== language) {
        return false
      }

      if (runtime) {
        const time = show.runtime ?? show.averageRuntime ?? 0
        if (runtime === 'short' && time >= 30) return false
        if (runtime === 'medium' && (time < 30 || time > 60)) return false
        if (runtime === 'long' && time <= 60) return false
      }

      if (hasRatingFilter) {
        const score = show.rating?.average
        if (score == null || score < rating) {
          return false
        }
      }

      return true
    })
  })

  const showsById = computed(() => {
    return new Map(allShows.value.map(show => [show.id, show]))
  })

  function selectFeaturedShows(shows: Show[]): Show[] {
    const candidateLimitPerGenre = 4
    const picksPerGenre = 2
    const featuredLimit = 6

    const showsByGenre = groupShowsByGenre(shows)
    const selected: Show[] = []
    const selectedIds = new Set<number>()

    for (const genreShows of Object.values(showsByGenre)) {
      const availableShows = genreShows.filter(show => !selectedIds.has(show.id))
      const topCandidates = availableShows.slice(0, candidateLimitPerGenre)
      const genrePicks = shuffle(topCandidates).slice(0, picksPerGenre)

      for (const show of genrePicks) {
        selected.push(show)
        selectedIds.add(show.id)
      }
    }

    return shuffle(selected).slice(0, featuredLimit)
  }

  function groupShowsByGenre(shows: Show[]) {
    return sortShowsByRating(shows).reduce(
      (acc, show) => {
        new Set(show.genres).forEach(genre => {
          if (!acc[genre]) {
            acc[genre] = []
          }
          acc[genre].push(show)
        })
        return acc
      },
      {} as Record<string, Show[]>
    )
  }

  const showsByGenre = computed(() => {
    return groupShowsByGenre(filteredShows.value)
  })

  async function fetchShows(pages: number[]) {
    const pagesToFetch = [...new Set(pages)].filter(page => !loadedPages.has(page))
    if (pagesToFetch.length === 0) return

    isLoading.value = true
    error.value = ''

    try {
      const results = await Promise.allSettled(pagesToFetch.map(page => fetchShowsPage(page)))
      const existingIds = new Set(allShows.value.map(show => show.id))
      const newShows: Show[] = []

      for (const [index, result] of results.entries()) {
        if (result.status === 'rejected') {
          error.value = result.reason?.message || 'Failed to fetch shows'
          continue
        }

        loadedPages.add(pagesToFetch[index]!)

        for (const show of result.value) {
          if (existingIds.has(show.id)) continue
          existingIds.add(show.id)
          newShows.push(show)
        }
      }

      if (newShows.length > 0) {
        allShows.value.push(...newShows)
      }
    } catch (err) {
      error.value = (err as { message?: string })?.message || 'Failed to fetch shows'
    } finally {
      isLoading.value = false
    }
  }

  function resetFilters() {
    filters.value = { ...DEFAULT_FILTERS }
  }

  return {
    allShows,
    filteredShows,
    isLoading,
    error,
    filters,
    resetFilters,
    fetchShows,
    showsByGenre,
    showsById,
    featuredShows,
  }
})

export const useShowListStore = useShowsStore
export const showListStore = useShowsStore

export function useShows() {
  const store = useShowsStore()

  const {
    allShows,
    filteredShows,
    isLoading,
    error,
    filters,
    showsByGenre,
    showsById,
    featuredShows,
  } = storeToRefs(store)
  const { fetchShows, resetFilters } = store

  return {
    allShows,
    filteredShows,
    isLoading,
    error,
    filters,
    resetFilters,
    fetchShows,
    showsByGenre,
    showsById,
    featuredShows,
  }
}

export const useShowList = useShows
export type UseShowsReturn = ReturnType<typeof useShows>
export type UseShowListReturn = UseShowsReturn
