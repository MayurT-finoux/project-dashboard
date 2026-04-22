import { NextResponse } from 'next/server'
import { parsePlanMeta, readPlanFile, writeStatusToPlan } from '@/lib/markdown'
import { updateDashboardRow } from '@/lib/dashboard'

const VALID_STATUSES = ['Planning', 'Active', 'Paused', 'Complete', 'Scrapped', 'Idea'] as const

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
    const projectContent = await readPlanFile(`projects/${params.slug}/plan.md`)
    const { meta, name, description } = parsePlanMeta(projectContent)
    await updateDashboardRow(params.slug, status, meta.lastUpdated, description, meta.started)
    return NextResponse.json({ ok: true, slug: params.slug, status, name })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
