'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, liskSepolia } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'Chain Credit',
  description: 'Chain Credit DApp',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://chaincredit.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the modal only once
let appKitInitialized = false
if (typeof window !== 'undefined' && !appKitInitialized) {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [mainnet, liskSepolia],
    defaultNetwork: liskSepolia,
    metadata: metadata,
    features: {
      analytics: false, // Disable to improve performance
    }
  })
  appKitInitialized = true
}

export function Providers({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
