import { ref, computed, watch, onMounted, type Ref } from 'vue'
import { fetchShowDetail, fetchSeasonEpisodes } from '@/api/shows'
import type { Episode, ShowDetail } from '@/types'

export function useShowDetail(id: Ref<number>) {
  const show = ref<ShowDetail | null>(null)
  const cast = computed(() => show.value?._embedded?.cast ?? [])
  const seasons = computed(() => show.value?._embedded?.seasons ?? [])
  const images = computed(() => show.value?._embedded?.images ?? [])
  const loading = ref(true)
  const error = ref('')

  const episodes = ref<Episode[]>([])
  const episodesLoading = ref(false)
  const episodesError = ref<string | null>(null)
  const reload = ref(0)

  const reloadEpisodes = ref(0)
  const selectedSeason = ref<number | null>(null)

  watch(
    [id, reload],
    async ([showId], _, onCleanup) => {
      const controller = new AbortController()
      onCleanup(() => controller.abort())

      show.value = null
      selectedSeason.value = null
      error.value = ''
      loading.value = true

      if (!Number.isSafeInteger(showId) || showId < 1) {
        error.value = 'Show not found'
        loading.value = false
        return
      }

      try {
        const data = await fetchShowDetail(showId, controller.signal)
        if (controller.signal.aborted) return

        show.value = data

        if (seasons.value.length > 0) {
          selectedSeason.value = seasons.value[0]?.id ?? null
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          if ((err as any)?.status === 404) {
            error.value = 'Show not found'
          } else {
            error.value = err instanceof Error ? err.message : 'Unable to load this show'
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          loading.value = false
        }
      }
    },
    { immediate: true }
  )

  watch(
    [selectedSeason, reloadEpisodes],
    async ([seasonId], _, onCleanup) => {
      const controller = new AbortController()
      onCleanup(() => controller.abort())

      episodes.value = []
      episodesError.value = null
      episodesLoading.value = seasonId !== null

      if (seasonId === null) return

      try {
        const data = await fetchSeasonEpisodes(seasonId, controller.signal)
        if (!controller.signal.aborted) {
          episodes.value = data
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          episodesError.value = err instanceof Error ? err.message : 'Failed to load episodes'
        }
      } finally {
        if (!controller.signal.aborted) {
          episodesLoading.value = false
        }
      }
    },
    { immediate: true }
  )

  const backdrop = computed(() => {
    const backgrounds = images.value.filter(image => image.type === 'background')
    return (
      (backgrounds.find(image => image.main) || backgrounds[0])?.resolutions.original.url ||
      show.value?.image?.original ||
      show.value?.image?.medium ||
      ''
    )
  })

  return {
    show,
    cast,
    seasons,
    episodes,
    selectedSeason,
    backdrop,
    loading,
    error,
    episodesLoading,
    episodesError,
    retry: () => reload.value++,
    retryEpisodes: () => reloadEpisodes.value++,
  }
}
