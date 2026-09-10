import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { fetchShowsPage, searchShowsByName } from '@/api/request'
import type { Show, NestedKeyOf } from '@/types'
import { sortShowsByRating, get, pickTwoRandom, shuffle } from '@/utils'

export type Filter =
  | { type: 'equal'; field: NestedKeyOf<Show>; value: string | number | boolean }
  | { type: 'range'; field: NestedKeyOf<Show>; value: { min: number; max: number } }

export const useShowListStore = defineStore('showList', () => {
  const allShows = ref<Show[]>([])
  const error = ref<string>('')
  const isLoading = ref<boolean>(false)
  const filters = ref<Filter[]>([])

  const visibleShows = computed(() => {
    return allShows.value.filter(show => {
      return filters.value.every(filter => {
        const value = get(show, filter.field)
        if (value == null) return false

        if (filter.type === 'equal') {
          return value === filter.value
        }
        if (filter.type === 'range') {
          const num = Number(value)
          return !Number.isNaN(num) && num >= filter.value.min && num <= filter.value.max
        }
        return true
      })
    })
  })

  const showsById = computed(() => {
    return new Map(allShows.value.map(show => [show.id, show]))
  })

  const topPicksShows = computed(() => {
    const genres = Object.keys(showsByGenres.value)
    const selected: Show[] = []
    const selectedIds = new Set<number>()

    for (const genre of genres) {
      const shows = showsByGenres.value[genre]
      const availableShows = shows.filter(show => !selectedIds.has(show.id))
      const randomShows = pickTwoRandom(availableShows, 4)

      for (const show of randomShows) {
        selected.push(show)
        selectedIds.add(show.id)
      }
    }

    return shuffle(selected).slice(0, 6)
  })

  const showsByGenres = computed(() => {
    return sortShowsByRating(visibleShows.value).reduce(
      (acc, show) => {
        // Use Set to ensure no duplicated genres on the same show
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
      }
    } catch (err) {
      console.error('Error fetching shows:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch shows'
    } finally {
      isLoading.value = false
    }
  }

  async function searchShowsByQuery(query: string, signal?: AbortSignal) {
    isLoading.value = true

    try {
      const result = await searchShowsByName(query, signal)
      allShows.value = result.map(({ show }) => show)
      console.log(result.map(({ show }) => show))
    } catch (error) {
      console.error('Error fetching shows:', error)
      error.value = error instanceof Error ? error.message : 'Failed to fetch shows'
    } finally {
      isLoading.value = false
    }
  }

  function updateFilters(newFilters: Filter[]) {
    filters.value = newFilters
  }

  return {
    allShows,
    visibleShows,
    isLoading,
    error,
    filters,
    fetchShows,
    showsByGenres,
    showsById,
    updateFilters,
    topPicksShows,
    searchShowsByQuery,
  }
})

// Keep backward compatibility if showListStore is imported directly
export const showListStore = useShowListStore

export function useShowList() {
  const store = useShowListStore()

  const {
    allShows,
    visibleShows,
    isLoading,
    error,
    filters,
    showsByGenres,
    showsById,
    topPicksShows,
  } = storeToRefs(store)
  const { fetchShows, updateFilters, searchShowsByQuery } = store

  return {
    allShows,
    visibleShows,
    isLoading,
    error,
    filters,
    fetchShows,
    showsByGenres,
    showsById,
    updateFilters,
    topPicksShows,
    searchShowsByQuery,
  }
}

export type UseShowListReturn = ReturnType<typeof useShowList>
