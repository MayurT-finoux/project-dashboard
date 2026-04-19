'use client'

import { useState } from 'react'
import type { Project, Status } from '@/types/project'
import StatusBadge from './StatusBadge'
import StatusDropdown from './StatusDropdown'

const VALID_STATUSES: Status[] = ['Planning', 'Active', 'Paused', 'Complete', 'Abandoned']

export default function ProjectCard({ project }: { project: Project }) {
  const [status, setStatus] = useState<Status>(project.meta.status)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStatusChange = async (newStatus: Status) => {
    if (newStatus === status) {
      return
    }

    setSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/projects/${project.slug}/status`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload?.error ?? 'Unable to update status')
      }

      setStatus(newStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">{project.meta.tags.join(' · ')}</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{project.name}</h2>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          <StatusDropdown status={status} disabled={saving} onChange={handleStatusChange} />
        </div>
      </div>

      <p className="mt-5 text-slate-300">{project.description}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Started</p>
          <p className="mt-2 font-medium text-slate-100">{project.meta.started}</p>
        </div>
        <div className="rounded-2xl bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Last Updated</p>
          <p className="mt-2 font-medium text-slate-100">{project.meta.lastUpdated}</p>
        </div>
      </div>

      {error ? <p className="mt-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
    </article>
  )
}
