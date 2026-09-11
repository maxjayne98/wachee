import { ref, watch, type Ref } from 'vue'
import { searchShowsByName } from '@/api/request'
import type { Show } from '@/types'

export function useShowSearch(query: Ref<string>) {
  const searchResult = ref<Show[]>([])
  const isLoading = ref(false)
  const error = ref('')
  const reload = ref(0)

  watch(
    [query, reload],
    async ([value], _, onCleanup) => {
      const controller = new AbortController()
      onCleanup(() => controller.abort())

      const trimmed = value.trim()
      searchResult.value = []
      error.value = ''

      if (!trimmed) {
        isLoading.value = false
        return
      }

      isLoading.value = true
      try {
        const result = await searchShowsByName(trimmed, controller.signal)
        if (!controller.signal.aborted) {
          searchResult.value = Object.values(result).map(r => r.show)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Error fetching search results:', err)
          error.value = err instanceof Error ? err.message : 'Search is temporarily unavailable.'
        }
      } finally {
        if (!controller.signal.aborted) {
          isLoading.value = false
        }
      }
    },
    { immediate: true }
  )

  return {
    searchResult,
    isLoading,
    error,
    retry: () => reload.value++,
  }
}
