'use client'

import { useState, useRef, useEffect } from 'react'
import type { Status } from '@/types/project'

const statusConfig = {
  Active: { emoji: '🟢', bg: 'var(--status-active-bg)', text: 'var(--status-active-text)' },
  Paused: { emoji: '🟡', bg: 'var(--status-paused-bg)', text: 'var(--status-paused-text)' },
  Planning: { emoji: '🔵', bg: 'var(--status-planning-bg)', text: 'var(--status-planning-text)' },
  Complete: { emoji: '✅', bg: 'var(--status-complete-bg)', text: 'var(--status-complete-text)' },
  Scrapped: { emoji: '❌', bg: 'var(--status-scrapped-bg)', text: 'var(--status-scrapped-text)' },
  Idea: { emoji: '💡', bg: 'var(--status-idea-bg)', text: 'var(--status-idea-text)' },
}

interface StatusBadgeProps {
  status: Status
  onStatusChange?: (newStatus: Status) => void
}

export default function StatusBadge({ status, onStatusChange }: StatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const config = statusConfig[status]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleStatusSelect = (newStatus: Status) => {
    onStatusChange?.(newStatus)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full px-2.5 py-1 transition-opacity hover:opacity-80"
        style={{
          backgroundColor: config.bg,
          color: config.text,
          fontSize: '12px',
          fontWeight: 500,
        }}
      >
        {config.emoji} {status}
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-[180px] rounded-lg border shadow-lg z-10"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          {(Object.keys(statusConfig) as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => handleStatusSelect(s)}
              className="w-full h-9 px-3 flex items-center justify-between hover:bg-zinc-800 transition-colors first:rounded-t-lg last:rounded-b-lg"
              style={{
                fontSize: '14px',
                color: 'var(--text-primary)',
              }}
            >
              <span>
                {statusConfig[s].emoji} {s}
              </span>
              {s === status && <span>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
