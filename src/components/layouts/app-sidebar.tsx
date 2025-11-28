"use client";

import * as React from "react";
import {
  LayoutGrid,
  Package,
  Plus,
  Clock,
  CheckCircle2,
  Watch,
  TrendingUp,
  ShoppingBag,
  Wallet,
  Vote,
  ShieldAlert,
} from "lucide-react";
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
      title: "Rental Earnings",
      url: "/earnings",
      icon: TrendingUp,
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
      title: "Verify Asset",
      url: "/assets/verify",
      icon: CheckCircle2,
    },
    {
      title: "Redeem",
      url: "/redeem",
      icon: Package,
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavBrand />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
