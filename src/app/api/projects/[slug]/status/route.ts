import path from 'path'
import { NextResponse } from 'next/server'
import { commitStatusChange, updateParentSubmodulePointer } from '@/lib/git'
import { parsePlanMeta, readPlanFile, writeStatusToPlan } from '@/lib/markdown'
import { updateDashboardRow } from '@/lib/dashboard'
import { REPO_ROOT } from '@/lib/config'

const VALID_STATUSES = ['Planning', 'Active', 'Paused', 'Complete', 'Abandoned'] as const

type Status = (typeof VALID_STATUSES)[number]

export async function PATCH(request: Request, { params }: { params: { slug: string } }) {
  const payload = await request.json().catch(() => null)

  if (!payload || typeof payload.status !== 'string') {
    return NextResponse.json({ error: 'Missing status' }, { status: 400 })
  }

  const status = payload.status as Status
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  try {
    await writeStatusToPlan(params.slug, status)
    const planPath = path.join(REPO_ROOT, 'projects', params.slug, 'plan.md')
    const projectContent = await readPlanFile(planPath)
    const { meta, name, description } = parsePlanMeta(projectContent)
    await updateDashboardRow(params.slug, status, meta.lastUpdated, description, meta.started)
    await commitStatusChange(params.slug, status)
    await updateParentSubmodulePointer()
    return NextResponse.json({ ok: true, slug: params.slug, status, name })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
