"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Sparkles, SearchIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { GlareCard } from "@/components/ui/glare-card";
import { useTokenizeAsset } from "@/hooks/use-tokenize-asset";
import { TokenizedAsset } from "@/types";
import { useEffect, useState } from "react";

export default function LaunchpadPage() {
  const { getAllTokenizedAssets, isLoading } = useTokenizeAsset();
  const [assets, setAssets] = useState<TokenizedAsset[]>([]);

  useEffect(() => {
    getAllTokenizedAssets().then((data) => {
      // Filter for APPROVED assets (Launchpad)
      const approvedAssets = data.filter(asset => asset.status === 'APPROVED');
      setAssets(approvedAssets);
    });
  }, [getAllTokenizedAssets]);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (
    <MainLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Launchpad", href: "/launchpad" },
      ]}
    >
      <div className="space-y-6 my-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border bg-card">
          <div className="absolute inset-0 bg-linear-to-br from-accent/10 via-primary/5 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative p-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-6 w-6 text-accent" />
                <h1 className="text-4xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                  Watch Launchpad
                </h1>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Discover fractional investment opportunities in luxury
                timepieces. Own shares, earn rental yields, and trade on
                secondary markets.
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <InputGroup>
          <InputGroupInput placeholder="Search by brand, model, or offering ID..." />
          <InputGroupAddon>
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>

        {/* All Offerings */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Offerings</h2>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
              <p className="text-muted-foreground">Loading assets...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <GlassCard
                  key={asset.id}
                  className="overflow-hidden group cursor-pointer hover:border-accent/50 transition-all"
                >
                  {/* Compact Image */}
                  <div className="relative h-48 overflow-hidden">
                    <GlareCard className="w-full h-full">
                      <img
                        alt={asset.brand}
                        className="h-full w-full object-cover object-center"
                        src={asset.imageUrls ? `${baseUrl}/${asset.imageUrls}` : "https://placehold.co/800x600?text=No+Image"}
                      />
                    </GlareCard>
                    <Badge className="absolute top-3 left-3 bg-success text-xs z-10">
                      <Shield className="h-3 w-3" />
                    </Badge>
                    <Badge
                      className="absolute top-3 right-3 text-xs z-10"
                      variant="default"
                    >
                      Active
                    </Badge>
                  </div>

                  {/* Compact Content */}
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{asset.brand}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                      {asset.model}
                    </p>

                    {/* Compact Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-0.5">Price/Unit</p>
                        <p className="font-semibold">${asset.price}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-0.5">APY</p>
                        <p className="font-semibold text-success">
                          12.5%
                        </p>
                      </div>
                    </div>

                    {/* Compact CTA */}
                    <Button
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link href={`/launchpad/${asset.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </GlassCard>
              ))}
              {assets.length === 0 && (
                <div className="col-span-3 text-center py-12 text-muted-foreground">
                  No approved assets found in Launchpad.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Banner */}
        <GlassCard className="p-6 bg-linear-to-br from-primary/5 to-accent/5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-accent/10 shrink-0">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">How It Works</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground mb-1">
                    1. Browse & Invest
                  </p>
                  <p>
                    Choose from verified luxury watch offerings and purchase
                    fractional units.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">
                    2. Earn Yields
                  </p>
                  <p>
                    Receive rental income from watch rentals proportional to
                    your ownership.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">
                    3. Trade or Redeem
                  </p>
                  <p>
                    Sell units on secondary market or redeem physical watch at
                    100% ownership.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
}
