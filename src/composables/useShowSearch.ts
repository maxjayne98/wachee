import { ref, watch, type Ref } from 'vue'
import { searchShowsByName } from '@/api/shows'
import type { Show } from '@/types'

export function useShowSearch(query: Ref<string>) {
  const searchResult = ref<Show[]>([])
  const isLoading = ref(false)
  const error = ref('')
  let controller: AbortController | null = null

  async function fetchSearch() {
    controller?.abort()
    controller = new AbortController()
    const signal = controller.signal

    const trimmed = query.value.trim()
    searchResult.value = []
    error.value = ''

    if (!trimmed) {
      isLoading.value = false
      return
    }

    isLoading.value = true
    try {
      const result = await searchShowsByName(trimmed, signal)
      if (!signal.aborted) {
        searchResult.value = Object.values(result).map(r => r.show)
      }
    } catch (err) {
      if (!signal.aborted) {
        console.error('Error fetching search results:', err)
        error.value = err instanceof Error ? err.message : 'Search is temporarily unavailable.'
      }
    } finally {
      if (!signal.aborted) {
        isLoading.value = false
      }
    }
  }

  watch(query, fetchSearch, { immediate: true })

  return {
    searchResult,
    isLoading,
    error,
    retry: fetchSearch,
  }
}
