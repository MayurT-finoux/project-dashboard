import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { PROJECTS_DIR } from '@/lib/config'
import { createProjectPlan, parsePlanMeta, readPlanFile } from '@/lib/markdown'
import { updateDashboardRow } from '@/lib/dashboard'
import { commitNewProject, updateParentSubmodulePointer } from '@/lib/git'
import type { Project, Status } from '@/types/project'

export async function GET() {
  const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true })
  const projects: Project[] = []

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue
    }

    const slug = entry.name
    const planPath = path.join(PROJECTS_DIR, slug, 'plan.md')

    try {
      const content = await readPlanFile(planPath)
      const { name, description, meta } = parsePlanMeta(content)

      projects.push({
        slug,
        name,
        description,
        meta,
      })
    } catch (error) {
      console.warn(`Unable to read plan for ${slug}:`, error)
    }
  }

  projects.sort((a, b) => (a.meta.lastUpdated < b.meta.lastUpdated ? 1 : -1))
  return NextResponse.json(projects)
}

const VALID_STATUSES = ['Planning', 'Active', 'Paused', 'Complete', 'Abandoned'] as const

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null)
  if (!payload || typeof payload.name !== 'string' || typeof payload.description !== 'string') {
    return NextResponse.json({ error: 'Missing required payload fields' }, { status: 400 })
  }

  const name = payload.name.trim()
  const description = payload.description.trim()
  const started = payload.started?.trim() || new Date().toISOString().slice(0, 10)
  const tags = typeof payload.tags === 'string'
    ? payload.tags.split(/[,\s]+/).map((tag: string) => tag.trim()).filter(Boolean)
    : Array.isArray(payload.tags)
      ? payload.tags.map((tag: string) => tag.trim()).filter(Boolean)
      : []
  const status = VALID_STATUSES.includes(payload.status) ? payload.status : 'Planning'
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  if (!slug) {
    return NextResponse.json({ error: 'Project name must contain letters or numbers' }, { status: 400 })
  }

  try {
    const project = await createProjectPlan({ slug, name, description, status, tags, started })
    await updateDashboardRow(slug, status, project.meta.lastUpdated, description, started)
    await commitNewProject(slug)
    await updateParentSubmodulePointer()
    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
