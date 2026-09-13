import type {
  Show,
  ShowDetail,
  SearchResult,
  CastMember,
  Season,
  Episode,
  ShowImage,
} from '@/types'

async function get<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(import.meta.env.VITE_API_BASE_URL + url, { signal })
  if (!response.ok) {
    let errorData
    try {
      errorData = await response.json()
    } catch {
      // Ignore if response is not JSON
    }
    if (errorData) {
      throw new Error(errorData.message || JSON.stringify(errorData))
    }
    throw new Error(
      response.status === 404 ? 'Show not found' : response.statusText || 'Request failed'
    )
  }
  const result = (await response.json()) as T
  return result
}

export async function fetchShowsPage(page: number, signal?: AbortSignal): Promise<Show[]> {
  return get<Show[]>(`/shows?page=${page}`, signal)
}

export async function fetchShowById(id: number, signal?: AbortSignal): Promise<Show> {
  return get<Show>(`/shows/${id}`, signal)
}

export async function fetchShowDetail(id: number, signal?: AbortSignal): Promise<ShowDetail> {
  return get<ShowDetail>(`/shows/${id}?embed[]=cast&embed[]=seasons&embed[]=images`, signal)
}

export async function searchShowsByName(
  query: string,
  signal?: AbortSignal
): Promise<Record<number, SearchResult>> {
  return get<Record<number, SearchResult>>(`/search/shows?q=${encodeURIComponent(query)}`, signal)
}

export function fetchShowCast(id: number, signal?: AbortSignal) {
  return get<CastMember[]>(`/shows/${id}/cast`, signal)
}

export function fetchShowSeasons(id: number, signal?: AbortSignal) {
  return get<Season[]>(`/shows/${id}/seasons`, signal)
}

export function fetchSeasonEpisodes(id: number, signal?: AbortSignal) {
  return get<Episode[]>(`/seasons/${id}/episodes`, signal)
}

export function fetchShowImages(id: number, signal?: AbortSignal) {
  return get<ShowImage[]>(`/shows/${id}/images`, signal)
}

export { get }
