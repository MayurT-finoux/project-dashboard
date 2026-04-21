'use client'

import { useEffect, useState } from 'react'
import type { Project } from '@/types/project'
import ProjectGrid from '@/components/ProjectGrid'
import AddProjectModal from '@/components/AddProjectModal'

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      if (res.ok) {
        const data = (await res.json()) as Project[]
        setProjects(data)
      }
    } catch (err) {
      console.error('Failed to load projects:', err)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    const handleProjectUpdated = () => {
      loadProjects()
    }

    window.addEventListener('projectUpdated', handleProjectUpdated)
    return () => window.removeEventListener('projectUpdated', handleProjectUpdated)
  }, [])

  const handleAddProject = async (newProject: {
    name: string;
    description: string;
    tags: string[];
    status: any;
  }) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newProject),
      })

      if (!res.ok) {
        const error = await res.json()
        console.error('Failed to create project:', error)
        return
      }

      setIsModalOpen(false)
      await loadProjects()
    } catch (err) {
      console.error('Failed to create project:', err)
    }
  }

  const stats = {
    Active: projects.filter((p) => p.meta.status === 'Active').length,
    Paused: projects.filter((p) => p.meta.status === 'Paused').length,
    Complete: projects.filter((p) => p.meta.status === 'Complete').length,
    Abandoned: projects.filter((p) => p.meta.status === 'Abandoned').length,
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      <nav
        className="border-b sticky top-0 z-40"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border)',
          height: '64px',
        }}
      >
        <div className="max-w-[1152px] mx-auto px-8 h-full flex items-center justify-between">
          <h1
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            Project Dashboard
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: '#fafafa',
              color: '#0a0a0a',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            + Add Project
          </button>
        </div>
      </nav>

      <div className="max-w-[1152px] mx-auto px-8 py-6">
        <div
          className="flex items-center gap-6 mb-6 py-4"
          style={{
            fontSize: '14px',
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--text-secondary)' }}>Active:</span>
            <span
              style={{ color: 'var(--text-primary)', fontWeight: 600 }}
            >
              {stats.Active}
            </span>
          </div>
          <div className="w-px h-4 bg-zinc-700" />
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--text-secondary)' }}>Paused:</span>
            <span
              style={{ color: 'var(--text-primary)', fontWeight: 600 }}
            >
              {stats.Paused}
            </span>
          </div>
          <div className="w-px h-4 bg-zinc-700" />
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--text-secondary)' }}>Complete:</span>
            <span
              style={{ color: 'var(--text-primary)', fontWeight: 600 }}
            >
              {stats.Complete}
            </span>
          </div>
          <div className="w-px h-4 bg-zinc-700" />
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--text-secondary)' }}>Abandoned:</span>
            <span
              style={{ color: 'var(--text-primary)', fontWeight: 600 }}
            >
              {stats.Abandoned}
            </span>
          </div>
        </div>

        <ProjectGrid projects={projects} />
      </div>

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProject}
      />
    </div>
  )
}
