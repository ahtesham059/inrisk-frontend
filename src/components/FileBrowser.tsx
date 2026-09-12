import { Cloud, FileJson2, LoaderCircle, RefreshCw, Trash2 } from 'lucide-react'
import type { StoredFile } from '../types'

interface Props {
  files: StoredFile[]
  selected: string | null
  loading: boolean
  error: string | null
  deleting: string | null
  onRefresh: () => void
  onSelect: (name: string) => void
  onDelete: (name: string) => void
}

const size = (bytes: number) => bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`

export function FileBrowser({ files, selected, loading, error, deleting, onRefresh, onSelect, onDelete }: Props) {
  function confirmDelete(name: string) {
    if (window.confirm(`Delete ${name}? This cannot be undone.`)) onDelete(name)
  }

  return (
    <section className="min-w-0 rounded-3xl bg-ink p-6 text-white shadow-card sm:p-8" aria-labelledby="files-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><p className="mb-1 text-xs font-bold uppercase tracking-[.18em] text-emerald-300">Cloud archive</p><h2 id="files-heading" className="font-display text-2xl">Stored weather files</h2></div>
        <button onClick={onRefresh} disabled={loading} aria-label="Refresh stored files" className="rounded-xl border border-white/15 p-3 text-emerald-200 hover:bg-white/10 disabled:opacity-50"><RefreshCw size={19} className={loading ? 'animate-spin' : ''} /></button>
      </div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-950/60 px-4 py-3 text-sm text-red-200">{error}</p>}
      {loading && files.length === 0 ? <div className="flex min-h-48 items-center justify-center text-slate-300"><LoaderCircle className="mr-2 animate-spin" /> Loading archive…</div> : null}
      {!loading && files.length === 0 ? <div className="flex min-h-48 flex-col items-center justify-center text-center text-slate-400"><Cloud size={34} className="mb-3 text-emerald-300"/><p className="font-medium text-white">No saved files yet</p><p className="mt-1 text-sm">Your first weather request will appear here.</p></div> : null}
      <div className="max-h-[310px] space-y-2 overflow-y-auto pr-1">
        {files.map((file) => (
          <div key={file.name} className={`flex w-full items-center rounded-xl border transition ${selected === file.name ? 'border-emerald-300 bg-emerald-300/10' : 'border-white/10 hover:bg-white/5'}`}>
            <button onClick={() => onSelect(file.name)} className="min-w-0 flex-1 p-3 text-left">
              <span className="flex items-center gap-3"><FileJson2 size={20} className="shrink-0 text-emerald-300"/><span className="min-w-0"><span className="block truncate text-sm font-medium">{file.name}</span><span className="mt-1 block text-xs text-slate-400">{size(file.size)} · {file.created_at ? new Date(file.created_at).toLocaleString() : 'Unknown date'}</span></span></span>
            </button>
            <button
              onClick={() => confirmDelete(file.name)}
              disabled={Boolean(deleting)}
              aria-label={`Delete ${file.name}`}
              title="Delete file"
              className="mr-2 shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-500/15 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting === file.name
                ? <LoaderCircle size={18} className="animate-spin"/>
                : <Trash2 size={18}/>
              }
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
