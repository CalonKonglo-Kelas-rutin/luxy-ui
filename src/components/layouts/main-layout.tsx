"use client";

import { AppSidebar } from "@/components/layouts/app-sidebar";
import { AppHeader } from "@/components/layouts/app-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ReactNode, useEffect } from "react";
import { useAccount } from "wagmi";
import { usePathname, useRouter } from "next/navigation";

interface MainLayoutProps {
  children: ReactNode;
  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
}

const ADMIN_ADDRESS = "0xE6E3bAF4E19E56E8339B2d7008eea70eC0ab1566";

export function MainLayout({ children, breadcrumbs }: MainLayoutProps) {
  const { address } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
      // If admin is on a non-admin path, redirect to admin dashboard
      if (!pathname.startsWith("/admin")) {
        router.push("/admin/assets");
      }
    }
  }, [address, pathname, router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader breadcrumbs={breadcrumbs} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:mx-12">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
