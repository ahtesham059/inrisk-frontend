import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, BarChart3, CheckCircle2, CloudSun, LoaderCircle, MapPinned } from 'lucide-react'
import { FileBrowser } from './components/FileBrowser'
import { WeatherChart } from './components/WeatherChart'
import { WeatherForm } from './components/WeatherForm'
import { WeatherTable } from './components/WeatherTable'
import { api } from './lib/api'
import { isWeatherFile, toRows } from './lib/weather'
import type { WeatherInput } from './types'

export default function App() {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState<string | null>(null)
  const files = useQuery({ queryKey: ['files'], queryFn: api.listFiles, refetchOnWindowFocus: false })
  const content = useQuery({ queryKey: ['file', selected], queryFn: () => api.getFile(selected!), enabled: Boolean(selected), refetchOnWindowFocus: false })
  useEffect(() => {
    if (!selected && files.data?.files.length) setSelected(files.data.files[0].name)
  }, [files.data, selected])
  const save = useMutation({
    mutationFn: (input: WeatherInput) => api.storeWeather(input),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ['files'] })
      setSelected(result.file)
    },
  })
  const weather = content.data && isWeatherFile(content.data) ? content.data : null
  const rows = useMemo(() => weather ? toRows(weather) : [], [weather])
  const unit = weather?.daily_units?.temperature_2m_max || '°C'

  return (
    <div className="min-h-screen">
      <header className="relative overflow-hidden bg-ink text-white">
        <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full border-[70px] border-emerald-300/5" />
        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="mb-10 flex items-center gap-3"><span className="rounded-xl bg-emerald-300 p-2.5 text-ink"><CloudSun size={24}/></span><span className="font-bold tracking-wide">InRisk Labs</span></div>
          <div className="max-w-3xl"><p className="mb-3 text-sm font-bold uppercase tracking-[.2em] text-emerald-300">Historical weather archive</p><h1 className="font-display text-4xl leading-tight sm:text-6xl">Weather patterns,<br/><em className="font-normal text-emerald-200">made visible.</em></h1><p className="mt-5 max-w-xl text-base leading-7 text-slate-300">Fetch up to 31 days of historical temperature data, preserve the raw record in cloud storage, and explore it here.</p></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        {save.isSuccess && <div role="status" className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><CheckCircle2 className="mt-0.5 shrink-0" size={19}/><span><strong>Weather saved.</strong><span className="mt-0.5 block break-all text-emerald-700">{save.data.file}</span></span></div>}
        {save.isError && <div role="alert" className="mb-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertTriangle className="shrink-0" size={19}/><span><strong>Couldn’t save weather.</strong> {save.error.message}</span></div>}
        <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <WeatherForm pending={save.isPending} onSubmit={(input) => save.mutate(input)} />
          <FileBrowser files={files.data?.files ?? []} selected={selected} loading={files.isFetching} error={files.error?.message ?? null} onRefresh={() => files.refetch()} onSelect={setSelected} />
        </div>
        <section className="mt-8 min-w-0 rounded-3xl bg-white p-6 shadow-card sm:p-8" aria-labelledby="analysis-heading">
          <div className="mb-7 flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div><p className="mb-1 text-xs font-bold uppercase tracking-[.18em] text-forest">Selected dataset</p><h2 id="analysis-heading" className="font-display text-3xl text-ink">Temperature analysis</h2></div>
            {weather && <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600"><span className="meta"><MapPinned size={14}/>{weather.latitude.toFixed(3)}, {weather.longitude.toFixed(3)}</span><span className="meta">{weather.timezone || 'GMT'}</span><span className="meta">{rows.length} days</span></div>}
          </div>
          {content.isFetching && <div className="flex min-h-72 items-center justify-center text-slate-500"><LoaderCircle className="mr-2 animate-spin"/> Loading saved data…</div>}
          {content.isError && <div role="alert" className="flex min-h-72 flex-col items-center justify-center text-center text-red-700"><AlertTriangle size={32} className="mb-3"/><p className="font-semibold">Couldn’t open this file</p><p className="mt-1 text-sm">{content.error.message}</p></div>}
          {!selected && <div className="flex min-h-72 flex-col items-center justify-center text-center text-slate-400"><BarChart3 size={38} className="mb-3 text-forest"/><p className="font-semibold text-ink">Choose a stored weather file</p><p className="mt-1 max-w-sm text-sm">Its daily temperatures will appear here without another call to Open-Meteo.</p></div>}
          {selected && content.data && !weather && <div role="alert" className="min-h-72 text-center text-red-700">The stored file does not contain valid daily weather data.</div>}
          {weather && rows.length === 0 && <div className="min-h-72 text-center text-slate-500">This file contains no daily observations.</div>}
          {weather && rows.length > 0 && <div className="space-y-10"><WeatherChart rows={rows} unit={unit}/><div><h3 className="mb-4 font-display text-2xl text-ink">Daily observations</h3><WeatherTable rows={rows} unit={unit} fileName={selected!}/></div></div>}
        </section>
        <footer className="flex flex-col gap-2 py-8 text-center text-xs text-slate-500 sm:flex-row sm:justify-between"><span>Built for climate-risk exploration.</span><span>Weather data by <a className="font-semibold text-forest underline" href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a></span></footer>
      </main>
    </div>
  )
}
