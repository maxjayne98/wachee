import type { Show, ShowDetail, SearchResult, Episode } from '@/types'

import { get } from './client'

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

export function fetchSeasonEpisodes(id: number, signal?: AbortSignal) {
  return get<Episode[]>(`/seasons/${id}/episodes`, signal)
}
