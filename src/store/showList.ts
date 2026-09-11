import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { fetchShowsPage, searchShowsByName } from '@/api/request'
import type { Show, NestedKeyOf } from '@/types'
import { sortShowsByRating, get, pickTwoRandom, shuffle } from '@/utils'

export type Filter =
  | { type: 'equal'; field: NestedKeyOf<Show>; value: string | number | boolean }
  | {
      type: 'range'
      field: NestedKeyOf<Show>
      value: { min: number; max: number; minExclusive?: boolean; maxExclusive?: boolean }
    }

export const useShowListStore = defineStore('showList', () => {
  const allShows = ref<Show[]>([])
  const error = ref<string>('')
  const isLoading = ref<boolean>(false)
  const filters = ref<Filter[]>([])
  const topPickedShows = ref<Show[]>([])

  const visibleShows = computed(() => {
    return allShows.value.filter(show => {
      return filters.value.every(filter => {
        const value =
          filter.field === 'runtime'
            ? (show.runtime ?? show.averageRuntime)
            : get(show, filter.field)
        if (value == null) return false

        if (filter.type === 'equal') {
          return value === filter.value
        }
        if (filter.type === 'range') {
          const num = Number(value)
          return (
            Number.isFinite(num) &&
            (filter.value.minExclusive ? num > filter.value.min : num >= filter.value.min) &&
            (filter.value.maxExclusive ? num < filter.value.max : num <= filter.value.max)
          )
        }
        return true
      })
    })
  })

  const showsById = computed(() => {
    return new Map(allShows.value.map(show => [show.id, show]))
  })

  function calculateTopPicksShows(shows: Show[]) {
    const genres = Object.keys(getShowsByGeneres(shows))
    const selected: Show[] = []
    const selectedIds = new Set<number>()

    for (const genre of genres) {
      const showsOfGenre = getShowsByGeneres(shows)[genre]
      const availableShows = showsOfGenre.filter(show => !selectedIds.has(show.id))
      const randomShows = pickTwoRandom(availableShows, 4)

      for (const show of randomShows) {
        selected.push(show)
        selectedIds.add(show.id)
      }
    }

    return shuffle(selected).slice(0, 6)
  }

  function getShowsByGeneres(shows: Show[]) {
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

  const showsByGenres = computed(() => {
    return getShowsByGeneres(visibleShows.value)
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
        topPickedShows.value = calculateTopPicksShows(allShows.value)
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
    } catch (err) {
      console.error('Error fetching shows:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch shows'
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
    topPickedShows,
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
    topPickedShows,
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
    topPickedShows,
    searchShowsByQuery,
  }
}

export type UseShowListReturn = ReturnType<typeof useShowList>
