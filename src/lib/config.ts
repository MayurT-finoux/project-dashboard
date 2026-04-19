import fs from 'fs'
import path from 'path'

export const REPO_ROOT = process.env.PLANS_REPO_PATH
  ? path.resolve(process.env.PLANS_REPO_PATH)
  : path.resolve(process.cwd(), 'docs', 'plans')

export const PROJECTS_DIR = path.join(REPO_ROOT, 'projects')
export const DASHBOARD_PATH = path.join(REPO_ROOT, 'DASHBOARD.md')

if (!fs.existsSync(REPO_ROOT)) {
  throw new Error(
    `PLANS_REPO_PATH does not resolve to a valid directory: ${REPO_ROOT}`
  )
}
