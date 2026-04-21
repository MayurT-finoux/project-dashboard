'use client'

import { useState } from 'react'
import type { Project, Status } from '@/types/project'
import StatusBadge from './StatusBadge'

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
      // Trigger parent refresh
      window.dispatchEvent(new CustomEvent('projectUpdated'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="border rounded-lg p-5 transition-all hover:shadow-sm relative"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#404040';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <StatusBadge status={status} onStatusChange={handleStatusChange} />
        <button className="p-1 -mr-1 -mt-1 rounded hover:bg-zinc-800 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-secondary)' }}>
            <circle cx="12" cy="12" r="1"/>
            <circle cx="12" cy="5" r="1"/>
            <circle cx="12" cy="19" r="1"/>
          </svg>
        </button>
      </div>

      <h3
        className="mb-2 line-clamp-1"
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--text-primary)',
        }}
      >
        {project.name}
      </h3>

      <p
        className="mb-3 line-clamp-2"
        style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: '1.5',
        }}
      >
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.meta.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-2 py-0.5"
            style={{
              backgroundColor: '#27272a',
              color: '#a1a1aa',
              fontSize: '12px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        <div>Started: {project.meta.started}</div>
        <div>Updated: {project.meta.lastUpdated}</div>
      </div>

      {error && (
        <div
          className="absolute bottom-0 left-0 right-0 border-t px-3 py-2 flex items-center justify-between rounded-b-lg"
          style={{
            backgroundColor: '#450a0a',
            borderTopColor: '#7f1d1d',
            color: '#fca5a5',
            fontSize: '12px',
          }}
        >
          <span>Failed to update status. Changes reverted.</span>
          <button onClick={() => setError(null)} className="ml-2 hover:opacity-70">
            ×
          </button>
        </div>
      )}
    </div>
  )
}
