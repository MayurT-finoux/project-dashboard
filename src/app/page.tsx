import ProjectGrid from '@/components/ProjectGrid'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl py-10 px-4 sm:px-6 lg:px-8">
        <header className="mb-10 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Project Dashboard</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Status-driven project planning from markdown.
          </h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            Read the `project_plans` repo, show project cards, and prepare the dashboard for status updates.
          </p>
        </header>

        <ProjectGrid />
      </div>
    </main>
  )
}
