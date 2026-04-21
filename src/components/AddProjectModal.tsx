'use client'

import { useState } from 'react'
import type { Status } from '@/types/project'

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (project: {
    name: string
    description: string
    tags: string[]
    status: Status
  }) => void
}

export default function AddProjectModal({ isOpen, onClose, onSubmit }: AddProjectModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [status, setStatus] = useState<Status>('Planning')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const tagArray = tags
      .split(' ')
      .filter((tag) => tag.trim())
      .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))

    await new Promise((resolve) => setTimeout(resolve, 500))

    onSubmit({
      name,
      description,
      tags: tagArray,
      status,
    })

    setName('')
    setDescription('')
    setTags('')
    setStatus('Planning')
    setIsLoading(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="rounded-xl shadow-2xl w-full max-w-[480px] mx-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          padding: '28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            New Project
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 rounded transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-secondary)' }}>
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-1"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
              }}
            >
              Project Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. my-api-service"
              className="w-full px-3 border rounded-md focus:outline-none transition-colors"
              style={{
                height: '40px',
                borderColor: 'var(--border)',
                fontSize: '14px',
                backgroundColor: '#0a0a0a',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#525252'}
              onBlur={(e) => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block mb-1"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
              }}
            >
              Description
            </label>
            <textarea
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this project do? What does &quot;done&quot; look like?"
              rows={3}
              className="w-full px-3 py-2.5 border rounded-md resize-y focus:outline-none transition-colors"
              style={{
                borderColor: 'var(--border)',
                fontSize: '14px',
                backgroundColor: '#0a0a0a',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#525252'}
              onBlur={(e) => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="tags"
              className="block mb-1"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
              }}
            >
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="#web #api #python (space separated)"
              className="w-full px-3 border rounded-md focus:outline-none transition-colors"
              style={{
                height: '40px',
                borderColor: 'var(--border)',
                fontSize: '14px',
                backgroundColor: '#0a0a0a',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#525252'}
              onBlur={(e) => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="status"
              className="block mb-1"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
              }}
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full px-3 border rounded-md focus:outline-none transition-colors"
              style={{
                height: '40px',
                borderColor: 'var(--border)',
                fontSize: '14px',
                backgroundColor: '#0a0a0a',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#525252'}
              onBlur={(e) => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
            >
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Complete">Complete</option>
              <option value="Abandoned">Abandoned</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-zinc-800 transition-colors"
              style={{
                borderColor: 'var(--border)',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-md transition-opacity disabled:opacity-70 flex items-center gap-2"
              style={{
                backgroundColor: '#fafafa',
                color: '#0a0a0a',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {isLoading && (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}