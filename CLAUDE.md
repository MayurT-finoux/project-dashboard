# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Next.js dev server
npm run build     # production build
npm run lint      # ESLint
```

No test suite is configured.

## Architecture

Project Dashboard is a Next.js 14 app that uses a **GitHub repository as its database**. All project data lives in `MayurT-finoux/project_plans` (configurable via env vars); there is no local database or local git writing.

### Data flow

1. `GET /api/projects` — lists directories under `projects/` in the GitHub repo via Octokit, reads each `projects/{slug}/plan.md`, parses markdown frontmatter into `ProjectMeta`, returns array
2. `POST /api/projects` — creates `projects/{slug}/plan.md` from a template, updates `DASHBOARD.md` table
3. `PATCH /api/projects/[slug]/status` — rewrites the status line in `plan.md` and updates the `DASHBOARD.md` row

After a status change the client fires a `projectUpdated` custom event on `window`; `page.tsx` listens and re-fetches.

### Project plan format

Each project is a markdown file with a specific structure that `lib/markdown.ts` parses:

```markdown
# Project Name
**Status:** 🟢 Active
**Tags:** #tag1 #tag2
**Started:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD

## Goal
Description here...
```

`parsePlanMeta()` extracts these fields with regex. Status strings include emoji prefixes (e.g. `🟢 Active`, `🔵 Planning`). When writing status back, `updatePlanStatus()` rewrites the `**Status:**` line in the raw file content.

### Key libraries

| File | Role |
|------|------|
| `src/lib/config.ts` | Reads `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO` env vars |
| `src/lib/github.ts` | Octokit wrapper — `getFile`, `writeFile`, `listDir`; handles base64 encoding and SHA tracking for updates |
| `src/lib/markdown.ts` | Parses/writes `plan.md` frontmatter; creates plans from templates |
| `src/lib/dashboard.ts` | Reads and rewrites the `DASHBOARD.md` tracking table |
| `src/lib/git.ts` | Intentionally disabled — throws on all calls; local git is not used |

### Environment variables (`.env.local`)

```
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=MayurT-finoux
GITHUB_REPO=project_plans
```

### Submodule

`docs/plans` is a git submodule pointing to the same `project_plans` repo. Sync it before working on project data:

```bash
git submodule update --remote docs/plans
```

### Status values

Defined in `src/types/project.ts`. The five statuses are `Planning`, `Active`, `Paused`, `Complete`, `Abandoned` — each has an associated emoji and CSS color token in `globals.css`.

### Design prototype

`design/` is a standalone Vite project used for UI prototyping. It is not part of the Next.js app and has its own `package.json`.
