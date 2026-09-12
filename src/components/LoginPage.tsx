import { FormEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { CloudSun, KeyRound, LoaderCircle, LockKeyhole, UserRound } from 'lucide-react'

import { api } from '../lib/api'

export function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const login = useMutation({
    mutationFn: () => api.login(username, password),
    onSuccess: (response) => onLogin(response.access_token),
  })

  function submit(event: FormEvent) {
    event.preventDefault()
    if (username.trim() && password) login.mutate()
  }

  return (
    <main className="grid min-h-screen bg-cream lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-ink p-16 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full border-[90px] border-emerald-300/5" />
        <div className="relative flex items-center gap-3">
          <span className="rounded-xl bg-emerald-300 p-2.5 text-ink"><CloudSun size={24}/></span>
          <span className="font-bold tracking-wide">InRisk Labs</span>
        </div>
        <div className="relative max-w-xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[.2em] text-emerald-300">Protected weather archive</p>
          <h1 className="font-display text-6xl leading-tight">Climate records,<br/><em className="font-normal text-emerald-200">kept under control.</em></h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">Sign in to fetch historical weather, store raw observations, and explore saved datasets.</p>
        </div>
        <p className="relative text-sm text-slate-400">Historical data powered by Open-Meteo</p>
      </section>
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-card sm:p-10">
          <div className="mb-8 lg:hidden"><span className="inline-flex rounded-xl bg-mint p-2.5 text-forest"><CloudSun size={24}/></span></div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-forest">Authorized access</p>
          <h2 className="font-display text-4xl text-ink">Welcome back</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Use the reviewer credentials supplied with this demo.</p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold text-slate-700">
              <span className="mb-2 flex items-center gap-2"><UserRound size={16}/>Username</span>
              <span className="field flex items-center"><input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required /></span>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              <span className="mb-2 flex items-center gap-2"><LockKeyhole size={16}/>Password</span>
              <span className="field flex items-center"><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></span>
            </label>
            {login.isError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{login.error.message}</p>}
            <button disabled={login.isPending || !username.trim() || !password} className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3.5 font-semibold text-white transition hover:bg-forest disabled:cursor-not-allowed disabled:opacity-60">
              {login.isPending ? <LoaderCircle className="animate-spin" size={18}/> : <KeyRound size={18}/>}
              {login.isPending ? 'Signing in…' : 'Sign in securely'}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-slate-400">Access expires automatically after a short session.</p>
        </div>
      </section>
    </main>
  )
}
