'use client'

import { useEffect, useState } from 'react'
import type { Project } from '@/types/project'
import AddProjectForm from './AddProjectForm'
import ProjectCard from './ProjectCard'

export default function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/projects')
      if (!res.ok) {
        throw new Error(`Failed to load projects (${res.status})`)
      }
      const data = (await res.json()) as Project[]
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleProjectAdded = (project: Project) => {
    setProjects((current) => [project, ...current])
  }

  if (loading) {
    return <p className="text-slate-300">Loading projects...</p>
  }

  if (error) {
    return <p className="text-red-400">{error}</p>
  }

  return (
    <div className="space-y-8">
      <AddProjectForm onAdded={handleProjectAdded} />

      {projects.length === 0 ? (
        <p className="text-slate-300">No projects found in the plans repository.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
