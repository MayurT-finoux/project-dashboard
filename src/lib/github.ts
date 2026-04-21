import { Octokit } from '@octokit/rest'
import { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN } from '@/lib/config'

if (!GITHUB_TOKEN) {
  throw new Error('GITHUB_TOKEN is required in environment variables')
}

const octokit = new Octokit({ auth: GITHUB_TOKEN })

export interface GitHubFile {
  content: string
  sha: string
}

export async function getFile(path: string): Promise<GitHubFile> {
  const { data } = await octokit.repos.getContent({ owner: GITHUB_OWNER, repo: GITHUB_REPO, path })
  if (Array.isArray(data)) {
    throw new Error(`${path} is a directory`)
  }

  if (data.type !== 'file' || !('content' in data)) {
    throw new Error(`${path} is not a file`)
  }

  const content = Buffer.from(data.content, 'base64').toString('utf8')
  return { content, sha: data.sha }
}

export async function writeFile(path: string, content: string, message: string, sha?: string) {
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      ...(sha ? { sha } : {}),
    })
  } catch (error) {
    const status = (error as any).status
    const responseMessage = (error as any).message || JSON.stringify(error)
    throw new Error(`GitHub createOrUpdateFileContents failed${status ? ` (${status})` : ''}: ${responseMessage}`)
  }
}

export async function listDir(path: string) {
  const { data } = await octokit.repos.getContent({ owner: GITHUB_OWNER, repo: GITHUB_REPO, path })
  if (!Array.isArray(data)) {
    throw new Error(`${path} is not a directory`)
  }
  return data as Array<{ name: string; type: string; path: string; sha: string }>
}
