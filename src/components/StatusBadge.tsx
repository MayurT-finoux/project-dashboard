import type { Status } from '@/types/project'

const STATUS_STYLES: Record<Status, string> = {
  Planning: 'bg-sky-500/15 text-sky-200 ring-sky-500/30',
  Active: 'bg-emerald-500/15 text-emerald-200 ring-emerald-500/30',
  Paused: 'bg-amber-400/15 text-amber-200 ring-amber-400/30',
  Complete: 'bg-lime-400/15 text-lime-200 ring-lime-400/30',
  Abandoned: 'bg-rose-500/15 text-rose-200 ring-rose-500/30',
}

export default function StatusBadge({ status }: { status: Status }) {
  const labelMap: Record<Status, string> = {
    Planning: '🔵 Planning',
    Active: '🟢 Active',
    Paused: '🟡 Paused',
    Complete: '✅ Complete',
    Abandoned: '❌ Abandoned',
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium ring-1 ${STATUS_STYLES[status]}`}>
      {labelMap[status]}
    </span>
  )
}
