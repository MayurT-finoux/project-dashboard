'use client'

import { useState } from 'react'
import type { Project, Status } from '@/types/project'

const STATUS_OPTIONS: Status[] = ['Planning', 'Active', 'Paused', 'Complete', 'Abandoned']

export default function AddProjectForm({ onAdded }: { onAdded: (project: Project) => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [started, setStarted] = useState(new Date().toISOString().slice(0, 10))
  const [status, setStatus] = useState<Status>('Planning')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, description, tags, started, status }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload?.error ?? 'Unable to create project')
      }

      onAdded(payload)
      setSuccess('Project created successfully.')
      setName('')
      setDescription('')
      setTags('')
      setStarted(new Date().toISOString().slice(0, 10))
      setStatus('Planning')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300">New Project</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Add a project to the plans repo</h2>
        </div>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-slate-100">
          <span className="text-sm font-medium">Project name</span>
          <input
            required
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className="grid gap-2 text-slate-100">
          <span className="text-sm font-medium">Project goal</span>
          <textarea
            required
            rows={3}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-2 text-slate-100">
            <span className="text-sm font-medium">Status</span>
            <select
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
              value={status}
              onChange={(event) => setStatus(event.target.value as Status)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-slate-100">
            <span className="text-sm font-medium">Tags</span>
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
              placeholder="#dashboard #web"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-slate-100">
            <span className="text-sm font-medium">Started</span>
            <input
              type="date"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
              value={started}
              onChange={(event) => setStarted(event.target.value)}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Creating...' : 'Create project'}
        </button>

        {success ? <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</p> : null}
        {error ? <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
      </form>
    </section>
  )
}
