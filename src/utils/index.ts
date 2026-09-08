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

function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1)
}

function get<T = unknown>(object: unknown, path: string, defaultValue?: T): T | undefined {
  const result = path.split('.').reduce<unknown>((current, key) => {
    if (current != null && typeof current === 'object') {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, object)

  return result === undefined ? defaultValue : (result as T)
}

export { sortShowsByRating, capitalizeFirstLetter, get }
