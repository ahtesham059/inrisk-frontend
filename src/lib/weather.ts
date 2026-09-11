import type { WeatherFile, WeatherRow } from '../types'

const fields = [
  'temperature_2m_max',
  'temperature_2m_min',
  'apparent_temperature_max',
  'apparent_temperature_min',
] as const

export function isWeatherFile(value: unknown): value is WeatherFile {
  if (!value || typeof value !== 'object') return false
  const daily = (value as WeatherFile).daily
  if (!daily || !Array.isArray(daily.time)) return false
  return fields.every((field) => Array.isArray(daily[field]) && daily[field].length === daily.time.length)
}

export function toRows(file: WeatherFile): WeatherRow[] {
  return file.daily.time.map((date, index) => ({
    date,
    max: file.daily.temperature_2m_max[index],
    min: file.daily.temperature_2m_min[index],
    apparentMax: file.daily.apparent_temperature_max[index],
    apparentMin: file.daily.apparent_temperature_min[index],
  }))
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}
