import { getFile, writeFile } from '@/lib/github'
import type { Status, ProjectMeta } from '@/types/project'

const STATUS_LABELS: Record<Status, string> = {
  Planning: '🔵 Planning',
  Active: '🟢 Active',
  Paused: '🟡 Paused',
  Complete: '✅ Complete',
  Abandoned: '❌ Abandoned',
}

const stripMarkdown = (text: string) => text.replace(/\n/g, ' ').replace(/\*\*|__|\*|_/g, '').trim()

function isNotFound(error: unknown) {
  return typeof error === 'object' && error !== null && 'status' in error && (error as any).status === 404
}

export function parsePlanMeta(content: string): { name: string; description: string; meta: ProjectMeta } {
  const name = content.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? 'Untitled Project'
  const description = content.match(/##\s*Goal\s*\n+([\s\S]+?)(\n##|\n#|$)/m)?.[1]?.trim().split(/\n\n/)[0]?.trim() ?? ''

  const statusText = content.match(/^\*\*Status:\*\*\s+(.+)$/m)?.[1]?.trim() ?? 'Planning'
  const tagsText = content.match(/^\*\*Tags:\*\*\s+(.+)$/m)?.[1]?.trim() ?? ''
  const started = content.match(/^\*\*Started:\*\*\s+(.+)$/m)?.[1]?.trim() ?? ''
  const lastUpdated = content.match(/^\*\*Last Updated:\*\*\s+(.+)$/m)?.[1]?.trim() ?? ''

  const status = Object.entries(STATUS_LABELS).find(([, label]) => label === statusText)?.[0] as Status | undefined

  return {
    name,
    description: stripMarkdown(description),
    meta: {
      status: status ?? 'Planning',
      tags: tagsText.split(/[,\s]+/).map((tag) => tag.trim()).filter(Boolean),
      started: started || '',
      lastUpdated: lastUpdated || '',
    },
  }
}

export async function readPlanFile(planPath: string) {
  const file = await getFile(planPath)
  return file.content
}

export async function writeStatusToPlan(slug: string, status: Status) {
  const filePath = `projects/${slug}/plan.md`
  const file = await getFile(filePath)
  const label = STATUS_LABELS[status]
  const updated = file.content
    .replace(/^\*\*Status:\*\*\s+.+$/m, `**Status:** ${label}`)
    .replace(/^\*\*Last Updated:\*\*\s+.+$/m, `**Last Updated:** ${new Date().toISOString().slice(0, 10)}`)

  await writeFile(filePath, updated, `chore: update ${slug} status → ${status}`, file.sha)
}

export async function createProjectPlan(input: {
  slug: string
  name: string
  description: string
  status: Status
  tags: string[]
  started: string
}) {
  const filePath = `projects/${input.slug}/plan.md`

  try {
    await getFile(filePath)
    throw new Error(`Project slug already exists: ${input.slug}`)
  } catch (error) {
    if (!isNotFound(error)) {
      throw error
    }
  }

  const template = await getFile('templates/project-plan.md')
  const now = new Date().toISOString().slice(0, 10)
  const tagsText = input.tags.map((tag) => tag.trim().replace(/^#?/, '#')).join(' ')

  const filled = template.content
    .replace(/^# Project Name$/m, `# ${input.name}`)
    .replace(/^\*\*Status:\*\*.*$/m, `**Status:** ${STATUS_LABELS[input.status]}`)
    .replace(/^\*\*Tags:\*\*.*$/m, `**Tags:** ${tagsText}`)
    .replace(/^\*\*Started:\*\*.*$/m, `**Started:** ${input.started}`)
    .replace(/^\*\*Last Updated:\*\*.*$/m, `**Last Updated:** ${now}`)
    .replace(/(## Goal\s*\n\n)[\s\S]*?(\n---)/m, `$1${input.description}\n\n$2`)

  await writeFile(filePath, filled, `chore: add ${input.slug} project`)

  return {
    slug: input.slug,
    name: input.name,
    description: input.description,
    meta: {
      status: input.status,
      tags: input.tags,
      started: input.started,
      lastUpdated: now,
    },
  }
}
