"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Shield,
  Plus,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { useAssetRegistration } from "@/hooks/use-asset-registration";
import { Asset } from "@/types/asset";
import Link from "next/link";
import { AssetCardHover } from "@/components/ui/asset-card-hover";

export default function VerificationResultPage() {
  const { address } = useWallet();
  const { getUserAssets, isLoading } = useAssetRegistration();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      // Don't fetch if wallet is not connected
      if (!address) {
        return;
      }

      try {
        setError(null);
        const data = await getUserAssets();
        setAssets(data);
      } catch (err) {
        console.error("Failed to fetch assets:", err);
        setError(err instanceof Error ? err.message : "Failed to load assets");
      }
    };

    fetchAssets();
  }, [address, getUserAssets]);



  return (
    <MainLayout
      breadcrumbs={[
        { label: "Assets", href: "/assets" },
        { label: "My Assets", href: "/assets/verification" },
      ]}
    >
      <div className="max-w-7xl mx-auto space-y-8 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              My Assets
            </h1>
            <p className="text-muted-foreground mt-1">
              Track the verification status of your registered assets
            </p>
          </div>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/assets/register">
              <Plus className="mr-2 h-4 w-4" />
              Register New Asset
            </Link>
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
            <p className="text-muted-foreground">Loading your assets...</p>
          </div>
        ) : !address ? (
          <GlassCard className="p-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connect Wallet</h3>
            <p className="text-muted-foreground mb-6">
              Please connect your wallet to view your registered assets.
            </p>
          </GlassCard>
        ) : error ? (
          <GlassCard className="p-8 border-destructive/20 bg-destructive/5 text-center">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
            <p className="text-destructive font-medium mb-2">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </GlassCard>
        ) : assets.length === 0 ? (
          <GlassCard className="p-12 text-center border-dashed">
            <div className="p-4 rounded-full bg-accent/10 w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Assets Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't registered any assets yet. Start by registering your luxury watch to unlock liquidity.
            </p>
            <Button asChild>
              <Link href="/assets/register">Register Your First Asset</Link>
            </Button>
          </GlassCard>
        ) : (
          <AssetCardHover assets={assets} />
        )}
      </div>
    </MainLayout>
  );
}
