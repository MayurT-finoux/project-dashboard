export async function commitPlansRepoChange() {
  throw new Error('Local git operations are disabled when using GitHub API persistence.')
}

export async function commitStatusChange() {
  throw new Error('Local git operations are disabled when using GitHub API persistence.')
}

export async function commitNewProject() {
  throw new Error('Local git operations are disabled when using GitHub API persistence.')
}

export async function updateParentSubmodulePointer() {
  throw new Error('Local git operations are disabled when using GitHub API persistence.')
}
