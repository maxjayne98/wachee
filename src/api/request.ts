import type { Show } from '@/types'

async function get<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(import.meta.env.VITE_API_BASE_URL + url, { signal })
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const result = (await response.json()) as T
  return result
}

export async function fetchShowsPage(page: number, signal?: AbortSignal): Promise<Show[]> {
  return get<Show[]>(`/shows?page=${page}`, signal)
}

// export async function fetchShowById(id: number, signal?: AbortSignal): Promise<TVMazeShow> {
//   return apiGet<TVMazeShow>(`/shows/${id}`, signal);
// }

// export async function searchShowsByName(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
//   return apiGet<SearchResult[]>(`/search/shows?q=${encodeURIComponent(query)}`, signal);
// }

// export async function fetchShowCast(id: number, signal?: AbortSignal): Promise<TVMazeCastMember[]> {
//   return apiGet<TVMazeCastMember[]>(`/shows/${id}/cast`, signal);
// }

export { get }
