import { FormEvent, useState } from 'react'
import { CalendarDays, LoaderCircle, MapPin, Send } from 'lucide-react'
import type { WeatherInput } from '../types'
import { validateInput } from '../lib/validation'

interface Props {
  pending: boolean
  onSubmit: (input: WeatherInput) => void
}

function isoDaysAgo(days: number): string {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - days)
  return date.toISOString().slice(0, 10)
}

export function WeatherForm({ pending, onSubmit }: Props) {
  const [input, setInput] = useState<WeatherInput>({
    latitude: 28.6139,
    longitude: 77.209,
    start_date: isoDaysAgo(13),
    end_date: isoDaysAgo(7),
  })
  const [error, setError] = useState<string | null>(null)

  function submit(event: FormEvent) {
    event.preventDefault()
    const validation = validateInput(input)
    setError(validation)
    if (!validation) onSubmit(input)
  }

  return (
    <section className="min-w-0 rounded-3xl bg-white p-6 shadow-card sm:p-8" aria-labelledby="request-heading">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[.18em] text-forest">New request</p>
          <h2 id="request-heading" className="font-display text-2xl text-ink">Explore a place in time</h2>
        </div>
        <div className="rounded-2xl bg-mint p-3 text-forest"><MapPin size={22} /></div>
      </div>
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Latitude">
            <input type="number" step="any" value={input.latitude} onChange={(e) => setInput({ ...input, latitude: e.target.valueAsNumber })} />
          </Field>
          <Field label="Longitude">
            <input type="number" step="any" value={input.longitude} onChange={(e) => setInput({ ...input, longitude: e.target.valueAsNumber })} />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Start date" icon={<CalendarDays size={15} />}>
            <input type="date" value={input.start_date} max={input.end_date} onChange={(e) => setInput({ ...input, start_date: e.target.value })} />
          </Field>
          <Field label="End date" icon={<CalendarDays size={15} />}>
            <input type="date" value={input.end_date} min={input.start_date} max={isoDaysAgo(0)} onChange={(e) => setInput({ ...input, end_date: e.target.value })} />
          </Field>
        </div>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3.5 font-semibold text-white transition hover:bg-forest disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? <LoaderCircle className="animate-spin" size={18} /> : <Send size={18} />}
          {pending ? 'Fetching & storing…' : 'Fetch & store data'}
        </button>
        <p className="text-center text-xs text-slate-500">Historical daily data · maximum 31 days</p>
      </form>
    </section>
  )
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-slate-700"><span className="mb-2 flex items-center gap-1.5">{icon}{label}</span><span className="field block">{children}</span></label>
}
