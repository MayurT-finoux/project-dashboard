import path from 'path'
import simpleGit from 'simple-git'
import { REPO_ROOT } from '@/lib/config'

const plansGit = simpleGit(REPO_ROOT)
const parentRoot = path.resolve(REPO_ROOT, '..', '..')
const parentGit = simpleGit(parentRoot)

export async function commitPlansRepoChange(files: string[], message: string) {
  await plansGit.add(files)
  await plansGit.commit(message)
}

export async function commitStatusChange(slug: string, status: string) {
  await commitPlansRepoChange([`projects/${slug}/plan.md`, 'DASHBOARD.md'], `chore: update ${slug} status → ${status}`)
}

export async function commitNewProject(slug: string) {
  await commitPlansRepoChange([`projects/${slug}/plan.md`, 'DASHBOARD.md'], `chore: add ${slug} project`)
}

export async function updateParentSubmodulePointer() {
  try {
    await parentGit.add(['docs/plans'])
    await parentGit.commit('chore: sync docs/plans submodule pointer')
  } catch (error) {
    console.warn('Could not update parent repository submodule pointer:', error)
  }
}
