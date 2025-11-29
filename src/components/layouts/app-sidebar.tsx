"use client";

import * as React from "react";
import {
  LayoutGrid,
  Plus,
  Clock,
  Watch,
  ShoppingBag,
  Wallet,
  Vote,
  ShieldAlert,
} from "lucide-react";
import { useAccount } from "wagmi";
import { NavMain, NavBrand } from "@/components/layouts/nav";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Navigation data for HoroloFi - Fractional Watch Ownership Platform
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutGrid,
    },
    {
      title: "Launchpad",
      url: "/launchpad",
      icon: Watch,
    },
    {
      title: "My Portfolio",
      url: "/portfolio",
      icon: Wallet,
    },
    {
      title: "Secondary Market",
      url: "/marketplace",
      icon: ShoppingBag,
    },
    {
      title: "Tokenize Watch",
      url: "/assets/register",
      icon: Plus,
    },
    {
      title: "My Asset Requests",
      url: "/assets/my-requests",
      icon: Clock,
    },
    {
      title: "Governance",
      url: "/governance",
      icon: Vote,
    },
    {
      title: "Admin Dashboard",
      url: "/admin/assets",
      icon: ShieldAlert,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { address } = useAccount();
  const ADMIN_ADDRESS = "0x81e677affc980bfdb2f89d2f2284c8ea902bdbf0";

  const filteredNavMain = data.navMain.filter((item) => {
    const isAdmin = address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

    if (isAdmin) {
      // Admin sees ONLY Admin Dashboard
      return item.title === "Admin Dashboard";
    } else {
      // Non-admin sees everything EXCEPT Admin Dashboard
      return item.title !== "Admin Dashboard";
    }
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavBrand />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
