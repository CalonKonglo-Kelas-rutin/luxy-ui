"use client";

import { wagmiAdapter, projectId } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, liskSepolia } from "@reown/appkit/networks";
import { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { Toaster } from "@/components/ui/sonner";
import { WalletRedirectProvider } from "./wallet-redirect-provider";

import { ThemeProvider } from "./theme-provider";

// Set up queryClient with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "Luxy",
  description: "Luxy DApp",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, liskSepolia],
  defaultNetwork: liskSepolia,
  metadata: metadata,
  features: {
    analytics: false,
  },
});

export function Providers({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletRedirectProvider>
            {children}
            <Toaster
              position="bottom-right"
              expand={false}
              richColors
            />
          </WalletRedirectProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
