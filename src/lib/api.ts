import type { LoginResponse, StoredFile, WeatherFile, WeatherInput } from '../types'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

interface ApiErrorBody {
  message?: string
  detail?: string
}

async function request<T>(path: string, options?: RequestInit, authenticated = true): Promise<T> {
  const headers = new Headers(options?.headers)
  const token = sessionStorage.getItem('inrisk_access_token')
  if (authenticated && token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  if (!response.ok) {
    let body: ApiErrorBody = {}
    try {
      body = await response.json()
    } catch {
      // The fallback below is more useful than a JSON parse error.
    }
    if (response.status === 401 && authenticated) {
      sessionStorage.removeItem('inrisk_access_token')
      window.dispatchEvent(new Event('inrisk:unauthorized'))
    }
    throw new Error(body.message || body.detail || `Request failed (${response.status})`)
  }
  return response.json() as Promise<T>
}

export const api = {
  login: (username: string, password: string) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }, false),
  me: () => request<{ username: string }>('/auth/me'),
  storeWeather: (input: WeatherInput) =>
    request<{ status: 'ok'; file: string }>('/store-weather-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  listFiles: () => request<{ files: StoredFile[] }>('/list-weather-files'),
  getFile: (name: string) =>
    request<WeatherFile>(`/weather-file-content/${encodeURIComponent(name)}`),
  deleteFile: (name: string) =>
    request<{ status: 'ok'; file: string }>(`/weather-file-content/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    }),
}
