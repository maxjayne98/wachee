import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  sortShowsByRating,
  capitalizeFirstLetter,
  pickRandomPair,
  shuffle,
  plainText,
  debounce,
} from '@/utils'
import { mockShowsList } from '@/mocks/shows'
import type { Show } from '@/types'

describe('utils/index', () => {
  let shows: Show[]

  describe('sortShowsByRating', () => {
    beforeEach(() => {
      shows = sortShowsByRating(mockShowsList)
    })

    it('All shows are returned', () => {
      expect(shows.length).toEqual(mockShowsList.length)
    })

    it('Shows are sorted in descending order of rating', () => {
      for (let i = 0; i < shows.length - 1; i++) {
        const currentRating = shows[i].rating?.average ?? 0
        const nextRating = shows[i + 1].rating?.average ?? 0
        expect(currentRating).toBeGreaterThanOrEqual(nextRating)
      }
    })

    it('Shows with same rating are sorted alphabetically', () => {
      const sameRatingShows = shows.filter(show => show.rating?.average === 9)
      for (let i = 0; i < sameRatingShows.length - 1; i++) {
        const currentShow = sameRatingShows[i]
        const nextShow = sameRatingShows[i + 1]
        expect(currentShow.name.localeCompare(nextShow.name)).toBeLessThanOrEqual(0)
      }
    })

    it('Handles empty input', () => {
      const sorted = sortShowsByRating([])
      expect(sorted).toEqual([])
    })

    it('Handles shows with no rating', () => {
      const showsWithNoRating = mockShowsList.map(show => ({
        ...show,
        rating: { average: undefined },
      }))
      const sorted = sortShowsByRating(showsWithNoRating)
      expect(sorted.every(show => show.rating?.average === undefined)).toBe(true)
    })
  })

  describe('capitalizeFirstLetter', () => {
    it('capitalizes the first letter of a string', () => {
      expect(capitalizeFirstLetter('test')).toEqual('Test')
    })

    it('Handles empty string', () => {
      expect(capitalizeFirstLetter('')).toEqual('')
    })
  })

  describe('pickRandomPair', () => {
    it('Returns a pair of items', () => {
      const pair = pickRandomPair([1, 2, 3, 4, 5], 2)
      expect(pair.length).toEqual(2)
    })

    it('Returns unique items', () => {
      const pair = pickRandomPair([1, 2, 3, 4, 5])
      expect(pair[0]).not.toEqual(pair[1])
    })

    it('Returns items from the pool', () => {
      const pair = pickRandomPair([1, 2, 3, 4, 5], 4)
      expect(pair).not.include(5)
    })
  })

  describe('shuffle', () => {
    it('Returns a shuffled array', () => {
      const shuffled = shuffle([1, 2, 3, 4, 5])
      expect(shuffled.length).toEqual(5)
      expect(shuffled).not.toEqual([1, 2, 3, 4, 5])
    })

    it('Returns unique items', () => {
      const shuffled = shuffle([1, 2, 3, 4, 5])
      expect(shuffled[0]).not.toEqual(shuffled[1])
    })

    it('Handles empty input', () => {
      const shuffled = shuffle([])
      expect(shuffled).toEqual([])
    })
  })

  describe('plainText', () => {
    it('Extracts text from html', () => {
      expect(plainText('<p>test</p>')).toEqual('test')
    })

    it('Handles empty string', () => {
      expect(plainText('')).toEqual('')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('Calls function after delay', () => {
      const func = vi.fn()
      const debounced = debounce(func, 100)
      debounced()
      expect(func).not.toHaveBeenCalled()
      vi.advanceTimersByTime(100)
      expect(func).toHaveBeenCalled()
    })

    it('Cancels pending calls', () => {
      const func = vi.fn()
      const debounced = debounce(func, 100)
      debounced()
      debounced.cancel()
      vi.advanceTimersByTime(100)
      expect(func).not.toHaveBeenCalled()
    })
  })
})
