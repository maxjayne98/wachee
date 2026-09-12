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

function pickRandomPair<T>(items: T[], poolLimit = 6): T[] {
  const limit = Math.min(items.length, poolLimit || 6)

  if (limit < 2) {
    return items.slice(0, limit)
  }

  const firstIndex = Math.floor(Math.random() * limit)

  let secondIndex: number
  do {
    secondIndex = Math.floor(Math.random() * limit)
  } while (secondIndex === firstIndex)

  return [items[firstIndex], items[secondIndex]]
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

function plainText(html?: string | null): string {
  return html
    ? new DOMParser()
        .parseFromString(html.replace(/<\/(p|div)>/gi, '$&\n\n'), 'text/html')
        .body.textContent?.trim() || ''
    : ''
}

function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delay = 300) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: Args) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }
    timeoutId = undefined
  }

  return debounced
}

export {
  sortShowsByRating,
  capitalizeFirstLetter,
  get,
  pickRandomPair,
  shuffle,
  plainText,
  debounce,
}
