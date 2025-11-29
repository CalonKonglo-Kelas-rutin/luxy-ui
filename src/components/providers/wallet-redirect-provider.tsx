"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useWallet } from "@/hooks/use-wallet";

export function WalletRedirectProvider({ children }: { children: React.ReactNode }) {
  const { isConnected, isConnecting } = useWallet();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not connected, not connecting, and not on the root page, redirect to root
    if (!isConnected && !isConnecting && pathname !== "/") {
      router.push("/");
    }
  }, [isConnected, isConnecting, pathname, router]);

  return <>{children}</>;
}
