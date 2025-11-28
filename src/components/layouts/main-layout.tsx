"use client";

import { AppSidebar } from "@/components/layouts/app-sidebar";
import { AppHeader } from "@/components/layouts/app-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
}

export function MainLayout({ children, breadcrumbs }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader breadcrumbs={breadcrumbs} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:mx-12">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
