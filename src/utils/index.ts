import type { Show } from '@/types'

function sortShowsByRating(shows: Iterable<Show>): Show[] {
  return [...shows].sort((a, b) => {
    const ratingA = a.rating?.average ?? 0
    const ratingB = b.rating?.average ?? 0
    if (ratingA === ratingB) {
      return a.name.localeCompare(b.name)
    }
    return ratingB - ratingA
  })
}

export { sortShowsByRating }
