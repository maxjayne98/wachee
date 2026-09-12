import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useShowsStore } from './shows'
import { createMockShow } from '@/mocks/shows'

describe('store/shows', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty state and default filters', () => {
    const store = useShowsStore()
    expect(store.allShows).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe('')
    expect(store.filters.language).toBe('')
    expect(store.filters.runtime).toBe('')
    expect(store.filters.rating).toBe(1)
  })

  it('filters shows by language', () => {
    const store = useShowsStore()
    store.allShows = [
      createMockShow({ id: 1, name: 'English Show', language: 'English' }),
      createMockShow({ id: 2, name: 'Spanish Show', language: 'Spanish' }),
    ]

    store.filters.language = 'Spanish'
    expect(store.filteredShows).toHaveLength(1)
    expect(store.filteredShows[0]?.id).toBe(2)
  })

  it('filters shows by runtime bracket', () => {
    const store = useShowsStore()
    store.allShows = [
      createMockShow({ id: 1, name: 'Short Show', runtime: 20 }),
      createMockShow({ id: 2, name: 'Medium Show', runtime: 45 }),
      createMockShow({ id: 3, name: 'Long Show', runtime: 90 }),
    ]

    store.filters.runtime = 'short'
    expect(store.filteredShows.map(s => s.id)).toEqual([1])

    store.filters.runtime = 'medium'
    expect(store.filteredShows.map(s => s.id)).toEqual([2])

    store.filters.runtime = 'long'
    expect(store.filteredShows.map(s => s.id)).toEqual([3])
  })

  it('filters shows by rating bounds', () => {
    const store = useShowsStore()
    store.allShows = [
      createMockShow({ id: 1, name: 'Low Rated', rating: { average: 4.5 } }),
      createMockShow({ id: 2, name: 'Mid Rated', rating: { average: 7.5 } }),
      createMockShow({ id: 3, name: 'High Rated', rating: { average: 9.5 } }),
    ]

    store.filters.rating = 7.0
    expect(store.filteredShows.map(s => s.id)).toEqual([2, 3])
  })

  it('groups filtered shows by genre', () => {
    const store = useShowsStore()
    store.allShows = [
      createMockShow({ id: 1, name: 'Drama Show', genres: ['Drama'] }),
      createMockShow({ id: 2, name: 'Multi Genre Show', genres: ['Drama', 'Sci-Fi'] }),
      createMockShow({ id: 3, name: 'Comedy Show', genres: ['Comedy'] }),
    ]

    expect(store.showsByGenre['Drama']?.map(s => s.id)).toEqual([1, 2])
    expect(store.showsByGenre['Sci-Fi']?.map(s => s.id)).toEqual([2])
    expect(store.showsByGenre['Comedy']?.map(s => s.id)).toEqual([3])
  })

  it('resets filters back to defaults', () => {
    const store = useShowsStore()
    store.filters.language = 'French'
    store.filters.runtime = 'long'
    store.filters.rating = 6

    store.resetFilters()
    expect(store.filters.language).toBe('')
    expect(store.filters.runtime).toBe('')
    expect(store.filters.rating).toBe(1)
  })
})
