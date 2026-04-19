import { promises as fs } from 'fs'
import { DASHBOARD_PATH } from '@/lib/config'
import type { Status } from '@/types/project'

const STATUS_SYMBOLS: Record<Status, string> = {
  Planning: '🔵',
  Active: '🟢',
  Paused: '🟡',
  Complete: '✅',
  Abandoned: '❌',
}

function formatTableRow(slug: string, status: Status, description: string, started: string, lastUpdated: string) {
  return `| ${STATUS_SYMBOLS[status]} | [${slug}](projects/${slug}/plan.md) | ${description} | ${started} | ${lastUpdated} |`
}

function countStatuses(lines: string[]) {
  const counts: Record<Status, number> = {
    Planning: 0,
    Active: 0,
    Paused: 0,
    Complete: 0,
    Abandoned: 0,
  }

  for (const line of lines) {
    const parts = line.split('|').map((cell) => cell.trim())
    if (parts.length < 6 || !parts[1]) continue
    const symbol = parts[1]
    const status = (Object.entries(STATUS_SYMBOLS).find(([, emoji]) => emoji === symbol)?.[0] ?? null) as Status | null
    if (status) {
      counts[status] += 1
    }
  }

  return counts
}

function buildStatsBlock(counts: Record<Status, number>) {
  return [
    '## Stats',
    '',
    `- **Active:** ${counts.Active}`,
    `- **Paused:** ${counts.Paused}`,
    `- **Complete:** ${counts.Complete}`,
    `- **Abandoned:** ${counts.Abandoned}`,
  ].join('\n')
}

export async function updateDashboardRow(slug: string, status: Status, lastUpdated: string, description: string, started: string) {
  const raw = await fs.readFile(DASHBOARD_PATH, 'utf8')
  const lines = raw.split('\n')
  const headerLine = lines.findIndex((line) => line.trim() === '| Status | Project | Description | Started | Last Updated |')
  const separatorLine = lines.findIndex((line, index) => index > headerLine && line.trim().startsWith('|---'))
  const tableEnd = lines.findIndex((line, index) => index > separatorLine && line.trim() === '---')

  if (headerLine === -1 || separatorLine === -1) {
    throw new Error('DASHBOARD.md project table not found')
  }

  const rowStart = separatorLine + 1
  const projectRowIndex = lines.findIndex((line, index) => {
    if (index < rowStart || (tableEnd !== -1 && index >= tableEnd)) {
      return false
    }
    return new RegExp(`^\|\s*${STATUS_SYMBOLS[status]}\s*\|\s*\[${slug}\]\(projects/${slug}/plan.md\)`).test(line) ||
      new RegExp(`^\|\s*[^|]+\s*\|\s*\[${slug}\]\(projects/${slug}/plan.md\)`).test(line)
  })

  if (projectRowIndex >= 0) {
    const existingCells = lines[projectRowIndex].split('|').map((cell) => cell.trim())
    const currentDescription = existingCells[3] || description
    const currentStarted = existingCells[4] || started
    lines[projectRowIndex] = formatTableRow(slug, status, currentDescription, currentStarted, lastUpdated)
  } else {
    const newRow = formatTableRow(slug, status, description, started, lastUpdated)
    lines.splice(tableEnd === -1 ? lines.length : tableEnd, 0, newRow)
  }

  const bodyRows = lines.slice(rowStart, tableEnd === -1 ? lines.length : tableEnd).filter((line) => line.trim().startsWith('|'))
  const counts = countStatuses(bodyRows)
  const statsStart = lines.findIndex((line) => line.trim() === '## Stats')
  const updatedLines = statsStart >= 0 ? lines.slice(0, statsStart) : lines
  const result = [...updatedLines, buildStatsBlock(counts)].join('\n')

  await fs.writeFile(DASHBOARD_PATH, result, 'utf8')
}
