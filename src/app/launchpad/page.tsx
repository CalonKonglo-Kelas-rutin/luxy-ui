import { MainLayout } from "@/components/layouts/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Watch,
  Users,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  Star
} from "lucide-react";
import Link from "next/link";

// Mock data for watch offerings
type OfferingStatus = "active" | "upcoming" | "sold-out";

interface Offering {
  id: string;
  assetName: string;
  brand: string;
  model: string;
  year: number;
  condition: string;
  totalUnits: number;
  pricePerUnit: number;
  soldUnits: number;
  availableUnits: number;
  soldPercentage: number;
  rentalYieldApy: number;
  totalValue: number;
  investors: number;
  status: OfferingStatus;
  authenticityVerified: boolean;
  featured: boolean;
  images: string[];
}

const featuredOfferings: Offering[] = [
  {
    id: "OFF-001",
    assetName: "Rolex Submariner 116610LN",
    brand: "Rolex",
    model: "Submariner Date 116610LN",
    year: 2020,
    condition: "Mint",
    totalUnits: 100,
    pricePerUnit: 350,
    soldUnits: 75,
    availableUnits: 25,
    soldPercentage: 75,
    rentalYieldApy: 8.5,
    totalValue: 35000,
    investors: 28,
    status: "active",
    authenticityVerified: true,
    featured: true,
    images: ["/api/placeholder/400/300"],
  },
  {
    id: "OFF-002",
    assetName: "Patek Philippe Nautilus 5711/1A",
    brand: "Patek Philippe",
    model: "Nautilus 5711/1A-010",
    year: 2021,
    condition: "Excellent",
    totalUnits: 200,
    pricePerUnit: 1200,
    soldUnits: 168,
    availableUnits: 32,
    soldPercentage: 84,
    rentalYieldApy: 6.2,
    totalValue: 240000,
    investors: 52,
    status: "active",
    authenticityVerified: true,
    featured: true,
    images: ["/api/placeholder/400/300"],
  },
];

const allOfferings: Offering[] = [
  ...featuredOfferings,
  {
    id: "OFF-003",
    assetName: "Audemars Piguet Royal Oak 15400ST",
    brand: "Audemars Piguet",
    model: "Royal Oak 15400ST.OO.1220ST.03",
    year: 2019,
    condition: "Very Good",
    totalUnits: 150,
    pricePerUnit: 383,
    soldUnits: 142,
    availableUnits: 8,
    soldPercentage: 94.7,
    rentalYieldApy: 7.8,
    totalValue: 57450,
    investors: 41,
    status: "active",
    authenticityVerified: true,
    featured: false,
    images: ["/api/placeholder/400/300"],
  },
  {
    id: "OFF-004",
    assetName: "Omega Speedmaster Moonwatch",
    brand: "Omega",
    model: "Speedmaster Professional Moonwatch",
    year: 2022,
    condition: "New",
    totalUnits: 80,
    pricePerUnit: 75,
    soldUnits: 0,
    availableUnits: 80,
    soldPercentage: 0,
    rentalYieldApy: 9.2,
    totalValue: 6000,
    investors: 0,
    status: "upcoming",
    authenticityVerified: true,
    featured: false,
    images: ["/api/placeholder/400/300"],
  },
  {
    id: "OFF-005",
    assetName: "Cartier Santos Large",
    brand: "Cartier",
    model: "Santos de Cartier Large WSSA0029",
    year: 2021,
    condition: "Excellent",
    totalUnits: 120,
    pricePerUnit: 58,
    soldUnits: 120,
    availableUnits: 0,
    soldPercentage: 100,
    rentalYieldApy: 5.5,
    totalValue: 6960,
    investors: 34,
    status: "sold-out",
    authenticityVerified: true,
    featured: false,
    images: ["/api/placeholder/400/300"],
  },
];

const stats = {
  totalOfferings: allOfferings.length,
  totalValue: allOfferings.reduce((sum, offer) => sum + offer.totalValue, 0),
  avgYield: 7.4,
  activeInvestors: 155,
};

export default function LaunchpadPage() {
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
                Discover fractional investment opportunities in luxury timepieces. Own shares, earn rental yields, and trade on secondary markets.
              </p>
              
              {/* Platform Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-card/50 border border-accent/20">
                  <p className="text-sm text-muted-foreground mb-1">Active Offerings</p>
                  <p className="text-2xl font-bold text-accent">{stats.totalOfferings}</p>
                </div>
                <div className="p-3 rounded-lg bg-card/50 border border-accent/20">
                  <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                  <p className="text-2xl font-bold">${(stats.totalValue / 1000).toFixed(0)}K</p>
                </div>
                <div className="p-3 rounded-lg bg-card/50 border border-accent/20">
                  <p className="text-sm text-muted-foreground mb-1">Avg. Yield</p>
                  <p className="text-2xl font-bold text-success">{stats.avgYield}%</p>
                </div>
                <div className="p-3 rounded-lg bg-card/50 border border-accent/20">
                  <p className="text-sm text-muted-foreground mb-1">Investors</p>
                  <p className="text-2xl font-bold">{stats.activeInvestors}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by brand, model, or offering ID..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </GlassCard>

        {/* Featured Offerings */}
        {featuredOfferings.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-semibold">Featured Offerings</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredOfferings.map((offering) => (
                <GlassCard key={offering.id} gradient className="overflow-hidden group cursor-pointer hover:border-accent/50 transition-all">
                  {/* Image */}
                  <div className="relative h-64 bg-linear-to-br from-accent/10 to-primary/10 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Watch className="h-20 w-20 text-muted-foreground" />
                    </div>
                    {offering.featured && (
                      <Badge className="absolute top-4 right-4 bg-accent">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {offering.authenticityVerified && (
                      <Badge className="absolute top-4 left-4 bg-success">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{offering.brand}</h3>
                        <p className="text-sm text-muted-foreground">{offering.model}</p>
                      </div>
                      <Badge variant={
                        offering.status === 'active' ? 'default' : 
                        offering.status === 'upcoming' ? 'secondary' : 
                        'outline'
                      }>
                        {offering.status === 'active' ? 'Active' : 
                         offering.status === 'upcoming' ? 'Upcoming' : 
                         'Sold Out'}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Funding Progress</span>
                        <span className="font-semibold text-accent">{offering.soldPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-linear-to-r from-accent to-accent/80 transition-all"
                          style={{ width: `${offering.soldPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{offering.soldUnits} units sold</span>
                        <span>{offering.availableUnits} remaining</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Price/Unit</p>
                        <p className="font-semibold">${offering.pricePerUnit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Rental APY</p>
                        <p className="font-semibold text-success">{offering.rentalYieldApy}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Investors</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {offering.investors}
                        </p>
                      </div>
                    </div>

                    {/* Details List */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year</span>
                        <span className="font-medium">{offering.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Condition</span>
                        <span className="font-medium">{offering.condition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Value</span>
                        <span className="font-medium text-accent">${offering.totalValue.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90 gap-2" 
                      disabled={offering.status === 'sold-out'}
                      asChild
                    >
                      <Link href={`/launchpad/${offering.id}`}>
                        {offering.status === 'sold-out' ? 'Sold Out' : 
                         offering.status === 'upcoming' ? 'Coming Soon' : 
                         'Invest Now'}
                        {offering.status === 'active' && <ArrowRight className="h-4 w-4" />}
                      </Link>
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* All Offerings */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Offerings</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {allOfferings.map((offering) => (
              <GlassCard key={offering.id} className="overflow-hidden group cursor-pointer hover:border-accent/50 transition-all">
                {/* Compact Image */}
                <div className="relative h-48 bg-linear-to-br from-accent/10 to-primary/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Watch className="h-12 w-12 text-muted-foreground" />
                  </div>
                  {offering.authenticityVerified && (
                    <Badge className="absolute top-3 left-3 bg-success text-xs">
                      <Shield className="h-3 w-3" />
                    </Badge>
                  )}
                  <Badge 
                    className="absolute top-3 right-3 text-xs"
                    variant={
                      offering.status === 'active' ? 'default' : 
                      offering.status === 'upcoming' ? 'secondary' : 
                      'outline'
                    }
                  >
                    {offering.status === 'active' ? 'Active' : 
                     offering.status === 'upcoming' ? 'Upcoming' : 
                     'Sold Out'}
                  </Badge>
                </div>

                {/* Compact Content */}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{offering.brand}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{offering.model}</p>

                  {/* Mini Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-accent">{offering.soldPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent"
                        style={{ width: `${offering.soldPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Compact Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div>
                      <p className="text-muted-foreground mb-0.5">Price/Unit</p>
                      <p className="font-semibold">${offering.pricePerUnit}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5">APY</p>
                      <p className="font-semibold text-success">{offering.rentalYieldApy}%</p>
                    </div>
                  </div>

                  {/* Compact CTA */}
                  <Button 
                    size="sm" 
                    className="w-full" 
                    variant={offering.status === 'active' ? 'default' : 'outline'}
                    disabled={offering.status === 'sold-out'}
                    asChild
                  >
                    <Link href={`/launchpad/${offering.id}`}>
                      {offering.status === 'sold-out' ? 'Sold Out' : 
                       offering.status === 'upcoming' ? (
                         <>
                           <Clock className="h-3 w-3 mr-1" />
                           Coming Soon
                         </>
                       ) : 
                       'View Details'}
                    </Link>
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
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
                  <p className="font-medium text-foreground mb-1">1. Browse & Invest</p>
                  <p>Choose from verified luxury watch offerings and purchase fractional units.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">2. Earn Yields</p>
                  <p>Receive rental income from watch rentals proportional to your ownership.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">3. Trade or Redeem</p>
                  <p>Sell units on secondary market or redeem physical watch at 100% ownership.</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
}
