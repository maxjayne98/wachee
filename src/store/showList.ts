import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { fetchShowsPage } from '@/api/request'
import type { Show } from '@/types'
import { sortShowsByRating } from '@/utils'

export const showListStore = defineStore('showList', () => {
  const shows = ref<Show[]>([])
  const error = ref<string>('')
  const isLoading = ref<boolean>(false)

  const showsById = computed(() => {
    return shows.value.reduce((acc, show) => {
      acc.set(show.id, show)
      return acc
    }, new Map<number, Show>())
  })

  const showsByGenres = computed(() => {
    const sortedShows = sortShowsByRating(shows.value)
    return sortedShows.reduce(
      (acc, show) => {
        show.genres.forEach(genre => {
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
      const existingIds = new Set(shows.value.map(s => s.id))
      const newShows: Show[] = []

      for (let i = 0; i < data.length; i++) {
        const pageShows = data[i]
        for (let j = 0; j < pageShows.length; j++) {
          const element = pageShows[j]
          if (!existingIds.has(element.id)) {
            existingIds.add(element.id)
            newShows.push(element)
          }
        }
      }

      if (newShows.length > 0) {
        shows.value.push(...newShows)
      }
    } catch (err) {
      console.error('Error fetching shows:', err)
      error.value = err as string
    } finally {
      isLoading.value = false
    }
  }

  return {
    shows,
    fetchShows,
    showsByGenres,
    showsById,
  }
})

export function useShowList() {
  const store = showListStore()

  const { shows, showsByGenres, showsById } = storeToRefs(store)
  const { fetchShows } = store

  return { shows, fetchShows, showsByGenres, showsById }
}

export type UseShowListReturn = ReturnType<typeof useShowList>
