'use client'

import type { Status } from '@/types/project'

const STATUS_OPTIONS: Status[] = ['Planning', 'Active', 'Paused', 'Complete', 'Abandoned']

export default function StatusDropdown({
  status,
  onChange,
  disabled,
}: {
  status: Status
  onChange: (status: Status) => void
  disabled?: boolean
}) {
  return (
    <label className="grid gap-2 text-slate-100">
      <span className="sr-only">Status</span>
      <select
        className="rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-white outline-none transition focus:border-sky-500"
        value={status}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as Status)}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option} className="bg-slate-950 text-white">
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
