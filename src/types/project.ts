export type Status = 'Planning' | 'Active' | 'Paused' | 'Complete' | 'Scrapped' | 'Idea'

export interface ProjectMeta {
  status: Status
  tags: string[]
  started: string
  lastUpdated: string
}

export interface Project {
  slug: string
  name: string
  description: string
  meta: ProjectMeta
}
