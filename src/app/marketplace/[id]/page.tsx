"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Shield,
  Wallet,
  ArrowRightLeft
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { PriceChart } from "@/components/ui/price-chart";
import { pricingService } from "@/services/pricingService";
import { assetService } from "@/services/assetService";
import { Pricing } from "@/types/pricing";
import { Asset } from "@/types/asset";
import { Skeleton } from "@/components/ui/skeleton";

import { useOrder } from "@/hooks/use-order";
import { useAccount } from "wagmi";
import { orderService } from "@/services/orderService";
import { UserOrderHistory } from "@/types/order";
import { TransactionHistory } from "@/components/ui/transaction-history";

export default function MarketplaceAssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { isConnected, address } = useAccount();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [currentPrice, setCurrentPrice] = useState<Pricing | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY");
  const [pricingData, setPricingData] = useState<Pricing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userOrders, setUserOrders] = useState<UserOrderHistory['data']>([]);

  const { createOrder, isSubmitting } = useOrder();

  const fetchUserOrders = useCallback(async () => {
    if (!isConnected || !address || !id) return;
    try {
      const history = await orderService.getOrdersByUser(address, id);
      if (history && history.data) {
        setUserOrders(history.data);
      }
    } catch (err) {
      console.error("Failed to fetch user orders", err);
    }
  }, [isConnected, address, id]);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const assetData = await assetService.getAssetById(id);
        setAsset(assetData);

        const dummyProductId = '21370'; // Product pricing currently not implemented 

        const [priceData, chartData] = await Promise.all([
          pricingService.getProductPricing(dummyProductId),
          pricingService.getProductPricingChart(dummyProductId)
        ]);

        setCurrentPrice(priceData);
        setPricingData(chartData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load asset data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Map Asset to UI model
  const tokenizedAsset = asset ? {
    id: asset.id.toString(),
    assetName: `${asset.brand} ${asset.model}`,
    brand: asset.brand,
    model: asset.model,
    year: asset.productionYear,
    condition: asset.conditionRating,
    totalUnits: 1000, // Mock: Total tokens
    pricePerUnit: currentPrice?.price || 0,
    soldUnits: 0, // Mock
    availableUnits: 1000, // Mock
    soldPercentage: 0, // Mock
    rentalYieldApy: 12.5, // Mock
    totalValue: asset.appraisedValueUsd || 0,
    investors: 0,
    status: asset.status === 'TOKENIZED' ? 'active' : 'upcoming', // In marketplace, active means tokenized
    authenticityVerified: true,
    images: `${baseUrl}${asset.imageUrls}`,
    documents: asset.documentsUrl ? [{ title: "Verification Document", url: asset.documentsUrl }] : [],
  } : null;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="aspect-video rounded-2xl" />
                <Skeleton className="h-64 rounded-xl" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-96 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !tokenizedAsset) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold mb-4">{error || "Asset Not Found"}</h1>
          <Button onClick={() => router.push("/marketplace")}>
            Back to Marketplace
          </Button>
        </div>
      </MainLayout>
    );
  }

  const totalCost = quantity * tokenizedAsset.pricePerUnit;
  const maxQuantity = tokenizedAsset.availableUnits;

  const handleOrder = async () => {
    if (quantity <= 0 || quantity > maxQuantity) return;

    try {
      await createOrder(
        tokenizedAsset.id,
        quantity,
        tokenizedAsset.pricePerUnit,
        orderType
      );
      setQuantity(1);
      fetchUserOrders();
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Marketplace", href: "/marketplace" },
        { label: tokenizedAsset.assetName, href: `/marketplace/${id}` },
      ]}
    >
      <div className="space-y-6 my-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="pl-0 hover:pl-2 transition-all"
          asChild
        >
          <Link href="/marketplace">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border bg-muted">
              <img
                src={tokenizedAsset.images || "https://placehold.co/800x600?text=No+Image"}
                alt={tokenizedAsset.assetName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge
                  variant="secondary"
                >
                  Tokenized Asset
                </Badge>
                {tokenizedAsset.authenticityVerified && (
                  <Badge variant="outline" className="bg-background/50 backdrop-blur-md border-success/50 text-success">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified Authentic
                  </Badge>
                )}
              </div>
            </div>

            {/* Asset Info */}
            <GlassCard className="p-6">
              <h1 className="text-3xl font-bold mb-2">{tokenizedAsset.assetName}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground">Brand:</span>
                  {tokenizedAsset.brand}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground">Model:</span>
                  {tokenizedAsset.model}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground">Year:</span>
                  {tokenizedAsset.year}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground">Condition:</span>
                  {tokenizedAsset.condition}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Documents</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {tokenizedAsset.documents && tokenizedAsset.documents.length > 0 ? (
                    tokenizedAsset.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-md bg-background border">
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          </div>
                          <span className="font-medium text-sm">
                            {doc.title}
                          </span>
                        </div>
                        <Download className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No public documents available.
                    </p>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <GlassCard className="p-6 border-primary/20 shadow-lg shadow-primary/5">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-1">
                    Market Price
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      ${tokenizedAsset.pricePerUnit.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / token
                    </span>
                  </div>
                </div>

                {/* Purchase Form */}
                <div className="space-y-4">
                  {/* Buy / Sell Toggle */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
                    <button
                      onClick={() => setOrderType("BUY")}
                      className={`py-2 text-sm font-medium rounded-md transition-all ${orderType === "BUY"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setOrderType("SELL")}
                      className={`py-2 text-sm font-medium rounded-md transition-all ${orderType === "SELL"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      Sell
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setQuantity(Math.max(1, quantity - 1))
                        }
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        max={maxQuantity}
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.min(
                              maxQuantity,
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          )
                        }
                        className="text-center font-mono"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setQuantity(Math.min(maxQuantity, quantity + 1))
                        }
                        disabled={quantity >= maxQuantity}
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground px-1">
                      <span>Min: 1</span>
                      <span>Max: {maxQuantity}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        ${totalCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fee (0.5%)</span>
                      <span className="font-medium">
                        ${(totalCost * 0.005).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-sm font-semibold">
                      <span>
                        {orderType === "BUY" ? "Total to Pay" : "Total to Receive"}
                      </span>
                      <span>
                        $
                        {(orderType === "BUY"
                          ? totalCost * 1.005
                          : totalCost * 0.995
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2">
                      <span className="text-muted-foreground">
                        Est. APY Yield
                      </span>
                      <span className="font-medium text-success">
                        {tokenizedAsset.rentalYieldApy}%
                      </span>
                    </div>
                  </div>

                  <Button
                    className={`w-full h-12 text-lg ${orderType === "SELL"
                      ? "bg-destructive hover:bg-destructive/90"
                      : ""
                      }`}
                    onClick={handleOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <ArrowRightLeft className="mr-2 h-5 w-5" />
                        {orderType === "BUY" ? "Buy Tokens" : "Sell Tokens"}
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    By trading, you agree to the Terms of Service.
                  </p>
                </div>
              </GlassCard>

              {/* Investment Highlights */}
              <GlassCard className="p-6">
                <h3 className="font-semibold mb-4">Investment Highlights</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <div className="p-1 rounded-full bg-success/10 h-fit mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-muted-foreground">
                      Verified authenticity by third-party experts
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <div className="p-1 rounded-full bg-success/10 h-fit mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-muted-foreground">
                      Insured storage in high-security vault
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <div className="p-1 rounded-full bg-success/10 h-fit mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-muted-foreground">
                      Quarterly rental yield distribution
                    </span>
                  </li>
                </ul>
              </GlassCard>
            </div>
          </div>
        </div>



        {/* User Transaction History */}
        <TransactionHistory userOrders={userOrders} isConnected={isConnected} />

        <PriceChart
          data={pricingData}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </MainLayout >
  );
}
