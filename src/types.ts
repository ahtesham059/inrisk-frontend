export interface WeatherInput {
  latitude: number
  longitude: number
  start_date: string
  end_date: string
}

export interface StoredFile {
  name: string
  size: number
  created_at: string
}

export interface DailyWeather {
  time: string[]
  temperature_2m_max: Array<number | null>
  temperature_2m_min: Array<number | null>
  apparent_temperature_max: Array<number | null>
  apparent_temperature_min: Array<number | null>
}

export interface WeatherFile {
  latitude: number
  longitude: number
  elevation?: number
  timezone?: string
  timezone_abbreviation?: string
  daily_units?: Record<string, string>
  daily: DailyWeather
}

export interface WeatherRow {
  date: string
  max: number | null
  min: number | null
  apparentMax: number | null
  apparentMin: number | null
}
