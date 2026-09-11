import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'
import { validateInput } from '../lib/validation'

describe('validateInput', () => {
  it('accepts an inclusive 31-day range', () => {
    expect(validateInput({ latitude: 90, longitude: -180, start_date: '2025-01-01', end_date: '2025-01-31' })).toBeNull()
  })
  it('rejects a 32-day range', () => {
    expect(validateInput({ latitude: 0, longitude: 0, start_date: '2025-01-01', end_date: '2025-02-01' })).toMatch(/31 days/)
  })
  it('rejects invalid coordinates', () => {
    expect(validateInput({ latitude: 91, longitude: 0, start_date: '2025-01-01', end_date: '2025-01-01' })).toMatch(/Latitude/)
  })
})
