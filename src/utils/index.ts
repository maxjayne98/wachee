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

function capitalizeFirstLetter(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function pickRandomPair<T>(items: T[], poolLimit = 6): T[] {
  const limit = Math.min(items.length, poolLimit ?? 6)

  if (limit < 2) {
    return items.slice(0, limit)
  }

  const pool = items.slice(0, limit)
  pool.sort(() => Math.random() - 0.5)

  return [pool[0]!, pool[1]!]
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

export type BadgeColor = 'sky' | 'purple' | 'orange' | 'pink' | 'amber'

function getBadgeColor(name: string): BadgeColor {
  const indexColors: BadgeColor[] = ['sky', 'purple', 'orange', 'pink']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const idx = Math.abs(hash) % indexColors.length
  return indexColors[idx]
}

export {
  sortShowsByRating,
  capitalizeFirstLetter,
  pickRandomPair,
  shuffle,
  plainText,
  debounce,
  getBadgeColor,
}
