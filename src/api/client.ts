export async function get<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(import.meta.env.VITE_API_BASE_URL + url, { signal })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw {
      ...error,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      headers: response.headers,
    }
  }
  const result = (await response.json()) as T
  return result
}
