import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { WeatherRow } from '../types'
import { formatDate } from '../lib/weather'

export function WeatherChart({ rows, unit }: { rows: WeatherRow[]; unit: string }) {
  return (
    <div className="h-[320px] w-full min-w-0 overflow-hidden" aria-label={`Daily maximum and minimum temperature chart in ${unit}`}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={rows} margin={{ top: 10, right: 10, left: -14, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dce6e2" vertical={false} />
          <XAxis dataKey="date" tickFormatter={(value) => formatDate(value).slice(0, 5)} tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis unit={unit} tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip labelFormatter={(value) => formatDate(String(value))} formatter={(value) => [`${value ?? '—'} ${unit}`]} contentStyle={{ borderRadius: 12, border: '1px solid #dce6e2' }} />
          <Legend />
          <Line type="monotone" dataKey="max" name="Daily max" stroke="#e96b4b" strokeWidth={3} dot={{ r: 2 }} connectNulls={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="min" name="Daily min" stroke="#0f6b57" strokeWidth={3} dot={{ r: 2 }} connectNulls={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
