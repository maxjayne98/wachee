export async function get<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(import.meta.env.VITE_API_BASE_URL + url, { signal })
  if (!response.ok) {
    let errorData
    try {
      errorData = await response.json()
    } catch {
      // Ignore if response is not JSON
    }
    const message = errorData ? (errorData.message || JSON.stringify(errorData)) : (response.statusText || 'Request failed')
    throw Object.assign(new Error(message), { status: response.status })
  }
  const result = (await response.json()) as T
  return result
}
