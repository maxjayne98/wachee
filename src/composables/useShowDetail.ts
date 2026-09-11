import { computed, ref, watch, type Ref } from 'vue'
import {
  fetchShowById,
  fetchShowCast,
  fetchShowSeasons,
  fetchShowImages,
  fetchSeasonEpisodes,
} from '@/api/request'
import type { Show, CastMember, Season, Episode, ShowImage } from '@/types'

export function useShowDetail(id: Ref<number>) {
  const show = ref<Show | null>(null)
  const cast = ref<CastMember[]>([])
  const seasons = ref<Season[]>([])
  const images = ref<ShowImage[]>([])
  const episodes = ref<Episode[]>([])
  const selectedSeason = ref<number | null>(null)
  const loading = ref(true)
  const error = ref('')
  const castError = ref(false)
  const seasonsError = ref(false)
  const episodesLoading = ref(false)
  const episodesError = ref(false)
  const reload = ref(0)
  const reloadEpisodes = ref(0)

  watch(
    [id, reload],
    async ([showId], _, onCleanup) => {
      const controller = new AbortController()
      onCleanup(() => controller.abort())
      show.value = null
      cast.value = []
      seasons.value = []
      images.value = []
      selectedSeason.value = null
      error.value = ''
      castError.value = false
      seasonsError.value = false
      loading.value = true
      if (!Number.isSafeInteger(showId) || showId < 1) {
        error.value = 'Show not found'
        loading.value = false
        return
      }
      const signal = controller.signal
      const [main, people, seasonList, artwork] = await Promise.allSettled([
        fetchShowById(showId, signal),
        fetchShowCast(showId, signal),
        fetchShowSeasons(showId, signal),
        fetchShowImages(showId, signal),
      ])
      if (signal.aborted) return
      if (main.status === 'fulfilled') show.value = main.value
      else
        error.value =
          main.reason instanceof Error ? main.reason.message : 'Unable to load this show'
      if (people.status === 'fulfilled') cast.value = people.value
      else castError.value = true
      if (seasonList.status === 'fulfilled') {
        seasons.value = seasonList.value
        selectedSeason.value = seasonList.value[0]?.id ?? null
      } else seasonsError.value = true
      if (artwork.status === 'fulfilled') images.value = artwork.value
      loading.value = false
    },
    { immediate: true }
  )

  watch(
    [selectedSeason, reloadEpisodes],
    async ([seasonId], _, onCleanup) => {
      const controller = new AbortController()
      onCleanup(() => controller.abort())
      episodes.value = []
      episodesError.value = false
      episodesLoading.value = seasonId !== null
      if (seasonId === null) return
      try {
        const data = await fetchSeasonEpisodes(seasonId, controller.signal)
        if (!controller.signal.aborted) episodes.value = data
      } catch {
        if (!controller.signal.aborted) episodesError.value = true
      } finally {
        if (!controller.signal.aborted) episodesLoading.value = false
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
    castError,
    seasonsError,
    episodesLoading,
    episodesError,
    retry: () => reload.value++,
    retryEpisodes: () => reloadEpisodes.value++,
  }
}
