import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { fetchShowsPage } from '@/api/shows'
import type { Show } from '@/types'
import { sortShowsByRating, pickRandomPair, shuffle } from '@/utils'

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
  const featuredShows = ref<Show[]>([])

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

  function selectFeaturedShows(shows: Show[]) {
    const showsByGenre = groupShowsByGenre(shows)
    const genres = Object.keys(showsByGenre)
    const selected: Show[] = []
    const selectedIds = new Set<number>()

    for (const genre of genres) {
      const genreShows = showsByGenre[genre] ?? []
      const availableShows = genreShows.filter(show => !selectedIds.has(show.id))
      const randomShows = pickRandomPair(availableShows, 4)

      for (const show of randomShows) {
        selected.push(show)
        selectedIds.add(show.id)
      }
    }

    return shuffle(selected).slice(0, 6)
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
    isLoading.value = true
    try {
      const data = await Promise.all(pages.map((page: number) => fetchShowsPage(page)))
      const existingIds = new Set(allShows.value.map(s => s.id))

      const newShows = data.flat().filter(show => {
        if (existingIds.has(show.id)) return false
        existingIds.add(show.id)
        return true
      })

      if (newShows.length > 0) {
        allShows.value.push(...newShows)
        featuredShows.value = selectFeaturedShows(allShows.value)
      }
    } catch (err) {
      console.error('Error fetching shows:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch shows'
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
    visibleShows: filteredShows,
    isLoading,
    error,
    filters,
    resetFilters,
    fetchShows,
    showsByGenre,
    showsByGenres: showsByGenre,
    showsById,
    featuredShows,
    topPickedShows: featuredShows,
  }
})

// Export aliases for flexibility and backward compatibility
export const useShowListStore = useShowsStore
export const showListStore = useShowsStore

export function useShows() {
  const store = useShowsStore()

  const {
    allShows,
    filteredShows,
    visibleShows,
    isLoading,
    error,
    filters,
    showsByGenre,
    showsByGenres,
    showsById,
    featuredShows,
    topPickedShows,
  } = storeToRefs(store)
  const { fetchShows, resetFilters } = store

  return {
    allShows,
    filteredShows,
    visibleShows,
    isLoading,
    error,
    filters,
    resetFilters,
    fetchShows,
    showsByGenre,
    showsByGenres,
    showsById,
    featuredShows,
    topPickedShows,
  }
}

export const useShowList = useShows
export type UseShowsReturn = ReturnType<typeof useShows>
export type UseShowListReturn = UseShowsReturn
