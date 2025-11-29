"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Wallet, TrendingUp, DollarSign, PieChart } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@/hooks/use-wallet";

// Mock Data for Portfolio
const portfolioAssets = [
  {
    id: "1",
    name: "Patek Philippe Nautilus 5711",
    symbol: "PP-5711",
    quantity: 50,
    avgBuyPrice: 120,
    currentPrice: 135,
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&auto=format&fit=crop&q=60",
    apy: 12.5,
  },
  {
    id: "2",
    name: "Audemars Piguet Royal Oak",
    symbol: "AP-RO",
    quantity: 25,
    avgBuyPrice: 85,
    currentPrice: 92,
    image: "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?w=800&auto=format&fit=crop&q=60",
    apy: 10.2,
  },
  {
    id: "3",
    name: "Rolex Daytona Panda",
    symbol: "RLX-DTA",
    quantity: 100,
    avgBuyPrice: 45,
    currentPrice: 48,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&auto=format&fit=crop&q=60",
    apy: 8.5,
  },
];

export default function PortfolioPage() {
  const { isConnected } = useWallet();

  // Calculate Summary Stats
  const totalValue = portfolioAssets.reduce(
    (acc, asset) => acc + asset.quantity * asset.currentPrice,
    0
  );
  const totalInvested = portfolioAssets.reduce(
    (acc, asset) => acc + asset.quantity * asset.avgBuyPrice,
    0
  );
  const totalProfit = totalValue - totalInvested;
  const profitPercentage = (totalProfit / totalInvested) * 100;

  if (!isConnected) {
    return (
      <MainLayout
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "My Portfolio", href: "/portfolio" },
        ]}
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <div className="p-4 rounded-full bg-accent/10">
            <Wallet className="h-12 w-12 text-accent" />
          </div>
          <h1 className="text-2xl font-bold">Connect Wallet</h1>
          <p className="text-muted-foreground max-w-md">
            Please connect your wallet to view your portfolio and track your fractional ownership investments.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "My Portfolio", href: "/portfolio" },
      ]}
    >
      <div className="space-y-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Portfolio</h1>
            <p className="text-muted-foreground">
              Track your fractional watch ownership and performance
            </p>
          </div>
          <Button asChild>
            <Link href="/launchpad">
              Invest More <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Total Portfolio Value
              </span>
              <DollarSign className="h-4 w-4 text-accent" />
            </div>
            <div className="text-2xl font-bold">
              ${totalValue.toLocaleString()}
            </div>
            <div className="text-xs text-success flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              +{profitPercentage.toFixed(2)}% All time
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Total Assets Owned
              </span>
              <PieChart className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">{portfolioAssets.length}</div>
            <div className="text-xs text-muted-foreground">
              Across {portfolioAssets.length} different collections
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Est. Annual Yield
              </span>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="text-2xl font-bold text-success">
              $
              {portfolioAssets
                .reduce(
                  (acc, asset) =>
                    acc + (asset.quantity * asset.currentPrice * asset.apy) / 100,
                  0
                )
                .toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground">
              Based on current APY rates
            </div>
          </GlassCard>
        </div>

        {/* Assets Table */}
        <GlassCard className="overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-xl font-semibold">Your Assets</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg. Buy Price</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-right">APY</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolioAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={asset.image}
                          alt={asset.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {asset.symbol}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {asset.quantity}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    ${asset.avgBuyPrice}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${asset.currentPrice}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    ${(asset.quantity * asset.currentPrice).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-success border-success/20 bg-success/5">
                      {asset.apy}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/launchpad/${asset.id}`}>Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlassCard>
      </div>
    </MainLayout>
  );
}
