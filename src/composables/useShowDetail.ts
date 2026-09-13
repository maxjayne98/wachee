import { ref, computed, watch, type Ref } from 'vue'
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

  const selectedSeason = ref<number | null>(null)

  let detailController: AbortController | null = null
  let episodesController: AbortController | null = null

  async function fetchDetail() {
    detailController?.abort()
    detailController = new AbortController()
    const signal = detailController.signal
    const showId = id.value

    show.value = null
    selectedSeason.value = null
    error.value = ''
    loading.value = true

    try {
      const data = await fetchShowDetail(showId, signal)
      if (signal.aborted) return

      show.value = data

      if (seasons.value.length > 0) {
        selectedSeason.value = seasons.value[0]?.id ?? null
      }
    } catch (err) {
      if (!signal.aborted) {
        if ((err as any)?.status === 404) {
          error.value = 'Show not found'
        } else {
          error.value = err instanceof Error ? err.message : 'Unable to load this show'
        }
      }
    } finally {
      if (!signal.aborted) {
        loading.value = false
      }
    }
  }

  async function fetchEpisodes() {
    episodesController?.abort()
    episodesController = new AbortController()
    const signal = episodesController.signal
    const seasonId = selectedSeason.value

    episodes.value = []
    episodesError.value = null
    episodesLoading.value = seasonId !== null

    if (seasonId === null) return

    try {
      const data = await fetchSeasonEpisodes(seasonId, signal)
      if (!signal.aborted) {
        episodes.value = data
      }
    } catch (err) {
      if (!signal.aborted) {
        episodesError.value = err instanceof Error ? err.message : 'Failed to load episodes'
      }
    } finally {
      if (!signal.aborted) {
        episodesLoading.value = false
      }
    }
  }

  watch(id, fetchDetail, { immediate: true })
  watch(selectedSeason, fetchEpisodes, { immediate: true })

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
    retry: fetchDetail,
    retryEpisodes: fetchEpisodes,
  }
}
