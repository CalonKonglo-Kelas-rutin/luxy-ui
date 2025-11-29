"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Package,
  Wallet,
  Plus,
  Sparkles,
  Shield,
  Activity,
  Users,
  Watch,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useWallet } from "@/hooks/use-wallet";
import { Spotlight } from "@/components/ui/spotlight-new";
import { useAppKit } from "@reown/appkit/react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { motion } from "motion/react";

// Mock data for fractional ownership dashboard
const stats = {
  totalPortfolioValue: 24750,
  totalInvestments: 3,
  claimableYield: 156,
  totalYieldEarned: 342,
};

const myOwnerships = [
  {
    id: "OWN-001",
    assetName: "Rolex Submariner 116610LN",
    brand: "Rolex",
    unitsOwned: 25,
    totalUnits: 100,
    ownershipPercentage: 25,
    currentValue: 9375,
    purchasePrice: 8750,
    unrealizedGain: 625,
    claimableYield: 78,
    apy: 8.5,
    image: "/api/placeholder/300/200",
  },
  {
    id: "OWN-002",
    assetName: "Patek Philippe Nautilus 5711/1A",
    brand: "Patek Philippe",
    unitsOwned: 10,
    totalUnits: 200,
    ownershipPercentage: 5,
    currentValue: 12500,
    purchasePrice: 12000,
    unrealizedGain: 500,
    claimableYield: 62,
    apy: 6.2,
    image: "/api/placeholder/300/200",
  },
  {
    id: "OWN-003",
    assetName: "Audemars Piguet Royal Oak 15400ST",
    brand: "Audemars Piguet",
    unitsOwned: 8,
    totalUnits: 150,
    ownershipPercentage: 5.3,
    currentValue: 2875,
    purchasePrice: 3000,
    unrealizedGain: -125,
    claimableYield: 16,
    apy: 7.8,
    image: "/api/placeholder/300/200",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "yield-claim",
    description: "Claimed rental yield",
    assetName: "Rolex Submariner",
    amount: 78,
    timestamp: "2024-11-24",
  },
  {
    id: 2,
    type: "primary-purchase",
    description: "Purchased fractional units",
    assetName: "Patek Philippe Nautilus",
    amount: 12000,
    units: 10,
    timestamp: "2024-11-20",
  },
  {
    id: 3,
    type: "yield-distribution",
    description: "Yield distributed",
    assetName: "Audemars Piguet Royal Oak",
    amount: 16,
    timestamp: "2024-11-19",
  },
];

export default function Page() {
  const { isConnected } = useWallet();
  const { open } = useAppKit();

  if (!isConnected) {
    return (
      <div className="h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight />
        <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
              Welcome to <br /> Luxy.
            </h1>
            <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
              The premier marketplace for fractional ownership of luxury timepieces.
              Invest, trade, and earn yields on the world's most exclusive watches.
            </p>

            <div className="mt-8 flex justify-center">
              <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 cursor-pointer"
                onClick={() => open()}
              >
                <Wallet className="h-5 w-5 mr-4" />
                Connect Wallet
              </HoverBorderGradient>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout breadcrumbs={[{ label: "Dashboard", href: "/" }]}>
      <div className="space-y-6 my-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border bg-card">
          <div className="absolute inset-0 bg-linear-to-br from-accent/10 via-primary/5 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative p-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                Welcome to Luxy
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Own fractions of luxury watches and earn yields
              </p>
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 gap-2"
                  asChild
                >
                  <Link href="/launchpad">
                    <Watch className="h-5 w-5" />
                    Explore Offerings
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/assets/register">
                    <Plus className="h-5 w-5" />
                    Tokenize Your Watch
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          <GlassCard hover className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Wallet className="h-5 w-5 text-accent" />
              </div>
              <Badge variant="secondary" className="text-xs">
                Portfolio
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Value</p>
            <p className="text-3xl font-bold text-accent">
              ${stats.totalPortfolioValue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">+7.1% all-time</p>
          </GlassCard>

          <GlassCard hover className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="text-xs">
                Active
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">My Investments</p>
            <p className="text-3xl font-bold">{stats.totalInvestments}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Across {stats.totalInvestments} watches
            </p>
          </GlassCard>

          <GlassCard hover className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <Badge variant="secondary" className="text-xs">
                Claimable
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Available Yield
            </p>
            <p className="text-3xl font-bold text-success">
              ${stats.claimableYield.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Ready to claim</p>
          </GlassCard>

          <GlassCard hover className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-info/10">
                <Sparkles className="h-5 w-5 text-info" />
              </div>
              <Badge variant="secondary" className="text-xs">
                Lifetime
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Total Yield Earned
            </p>
            <p className="text-3xl font-bold">
              ${stats.totalYieldEarned.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              From rental income
            </p>
          </GlassCard>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Portfolio Summary */}
          <div className="lg:col-span-2">
            <GlassCard gradient className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Portfolio</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/portfolio">
                    View Full Portfolio <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg border bg-card/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Total Assets
                    </span>
                  </div>
                  <div className="text-2xl font-bold">{stats.totalInvestments}</div>
                </div>

                <div className="p-4 rounded-lg border bg-card/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-success/10">
                      <TrendingUp className="h-5 w-5 text-success" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Total Yield
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-success">
                    ${stats.totalYieldEarned.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Top Holdings
                </h3>
                <div className="space-y-3">
                  {myOwnerships.slice(0, 3).map((ownership) => (
                    <div
                      key={ownership.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-background flex items-center justify-center">
                          <Watch className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {ownership.assetName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {ownership.brand}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          ${ownership.currentValue.toLocaleString()}
                        </p>
                        <p
                          className={`text-xs ${ownership.unrealizedGain >= 0
                              ? "text-success"
                              : "text-destructive"
                            }`}
                        >
                          {ownership.unrealizedGain >= 0 ? "+" : ""}$
                          {ownership.unrealizedGain.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <GlassCard className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href="/launchpad">
                    <Watch className="h-4 w-4" />
                    Browse Offerings
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href="/assets/register">
                    <Plus className="h-4 w-4" />
                    Tokenize Watch
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href="/marketplace">
                    <Package className="h-4 w-4" />
                    Secondary Market
                  </Link>
                </Button>
              </div>
            </GlassCard>

            {/* Recent Activity */}
            <GlassCard className="p-6">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="p-1.5 rounded-lg bg-accent/10 mt-0.5">
                      <Activity className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    {activity.amount > 0 && (
                      <span className="text-xs font-semibold text-success">
                        ${activity.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Platform Info */}
            <GlassCard className="p-6 bg-linear-to-br from-primary/5 to-accent/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-semibold">Why HoroloFi?</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>Fractional ownership of luxury watches</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>Earn rental yield from watch rentals</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>Trade on secondary marketplace</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>Redeem physical watch at 100%</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
