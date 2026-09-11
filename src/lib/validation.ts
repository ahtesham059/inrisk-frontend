import type { WeatherInput } from '../types'

export function validateInput(input: WeatherInput): string | null {
  if (!Number.isFinite(input.latitude) || input.latitude < -90 || input.latitude > 90)
    return 'Latitude must be between −90 and 90.'
  if (!Number.isFinite(input.longitude) || input.longitude < -180 || input.longitude > 180)
    return 'Longitude must be between −180 and 180.'
  if (!input.start_date || !input.end_date) return 'Choose both dates.'
  const start = new Date(`${input.start_date}T00:00:00Z`)
  const end = new Date(`${input.end_date}T00:00:00Z`)
  if (start > end) return 'Start date must be before or equal to end date.'
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1
  if (days > 31) return 'Choose a range of 31 days or fewer.'
  if (end > new Date()) return 'End date cannot be in the future.'
  return null
}
