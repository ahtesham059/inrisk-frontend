import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from '../lib/weather'
import type { WeatherRow } from '../types'

const value = (number: number | null, unit: string) => number == null ? '—' : `${number.toFixed(1)} ${unit}`

export function WeatherTable({ rows, unit, fileName }: { rows: WeatherRow[]; unit: string; fileName: string }) {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  useEffect(() => setPage(1), [fileName, pageSize])
  const shown = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [rows, page, pageSize])
  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th>Date</th><th>Max</th><th>Min</th><th>Feels max</th><th>Feels min</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{shown.map((row) => <tr key={row.date} className="hover:bg-slate-50/60"><td className="font-semibold text-ink">{formatDate(row.date)}</td><td className="text-coral">{value(row.max, unit)}</td><td className="text-forest">{value(row.min, unit)}</td><td>{value(row.apparentMax, unit)}</td><td>{value(row.apparentMin, unit)}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <label>Rows <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="ml-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5">{[10, 20, 50].map((count) => <option key={count}>{count}</option>)}</select></label>
        <div className="flex items-center gap-3"><span>Page {page} of {pages}</span><button aria-label="Previous page" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="page-button"><ChevronLeft size={17}/></button><button aria-label="Next page" disabled={page === pages} onClick={() => setPage((p) => p + 1)} className="page-button"><ChevronRight size={17}/></button></div>
      </div>
    </div>
  )
}
