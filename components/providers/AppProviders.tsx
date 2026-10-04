'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'

type AppProvidersProps = Readonly<{ children: React.ReactNode }>

export default function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster toasterId="profile-edit" position="top-right" />
    </QueryClientProvider>
  )
}
