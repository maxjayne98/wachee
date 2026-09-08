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

function pickTwoRandom<T>(arr: T[], count: number): T[] {
  const limit = Math.min(arr.length, count || 6)

  if (limit < 2) {
    return arr.slice(0, limit)
  }

  const first = Math.floor(Math.random() * limit)

  let second: number
  do {
    second = Math.floor(Math.random() * limit)
  } while (second === first)

  return [arr[first], arr[second]]
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

export { sortShowsByRating, capitalizeFirstLetter, get, pickTwoRandom, shuffle }
