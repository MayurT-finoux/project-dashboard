import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Project Dashboard',
  description: 'A local dashboard for managing project status and plan metadata.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
