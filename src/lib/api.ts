import type { StoredFile, WeatherFile, WeatherInput } from '../types'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

interface ApiErrorBody {
  message?: string
  detail?: string
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  if (!response.ok) {
    let body: ApiErrorBody = {}
    try {
      body = await response.json()
    } catch {
      // The fallback below is more useful than a JSON parse error.
    }
    throw new Error(body.message || body.detail || `Request failed (${response.status})`)
  }
  return response.json() as Promise<T>
}

export const api = {
  storeWeather: (input: WeatherInput) =>
    request<{ status: 'ok'; file: string }>('/store-weather-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  listFiles: () => request<{ files: StoredFile[] }>('/list-weather-files'),
  getFile: (name: string) =>
    request<WeatherFile>(`/weather-file-content/${encodeURIComponent(name)}`),
}
