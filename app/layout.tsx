import type { Metadata } from 'next'
import AppProviders from '@/components/providers/AppProviders'
import './globals.css'

export const metadata: Metadata = {
  title: 'Final Team Project',
  description: 'Frontend workspace for the final team project'
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
