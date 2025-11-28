"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { assetService } from "@/services/assetService";
import { Asset } from "@/types/asset";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminAssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assetId = params.id as string;
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  useEffect(() => {
    if (assetId) {
      fetchAsset();
    }
  }, [assetId]);

  const fetchAsset = async () => {
    try {
      setIsLoading(true);
      const data = await assetService.getAssetById(assetId);
      setAsset(data);
    } catch (error) {
      console.error("Failed to fetch asset:", error);
      toast.error("Failed to load asset details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!asset) return;

    try {
      setIsProcessing(true);
      await assetService.approveAsset(asset.id.toString());
      toast.success("Asset approved successfully");
      fetchAsset(); // Refresh data
    } catch (error) {
      console.error("Failed to approve asset:", error);
      toast.error("Failed to approve asset");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!asset) return;

    try {
      setIsProcessing(true);
      await assetService.rejectAsset(asset.id.toString(), rejectReason);
      toast.success("Asset rejected successfully");
      setIsRejectDialogOpen(false);
      fetchAsset(); // Refresh data
    } catch (error) {
      console.error("Failed to reject asset:", error);
      toast.error("Failed to reject asset");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Asset Requests", href: "/admin/assets" },
          { label: "Details", href: "#" },
        ]}
      >
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
          <p className="text-muted-foreground">Loading asset details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!asset) {
    return (
      <MainLayout
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Asset Requests", href: "/admin/assets" },
        ]}
      >
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">Asset not found</p>
          <Button asChild variant="link" className="mt-4">
            <Link href="/admin/assets">Back to List</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Asset Requests", href: "/admin/assets" },
        { label: `${asset.brand} ${asset.model}`, href: `/admin/assets/${asset.id}` },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button asChild variant="ghost" size="icon" className="mt-1">
              <Link href="/admin/assets">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{asset.brand} {asset.model}</h1>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <span className="font-mono text-sm">ID: {asset.id}</span>
                <span>•</span>
                <span className="font-mono text-sm">Owner: {asset.ownerId}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={asset.status} className="text-base px-4 py-2" />

            {asset.status === 'PENDING' && (
              <>
                <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" disabled={isProcessing}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Asset Request</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to reject this asset? This action cannot be undone.
                        Please provide a reason for the rejection.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Label htmlFor="reason" className="mb-2 block">Rejection Reason</Label>
                      <Textarea
                        id="reason"
                        placeholder="e.g., Images are blurry, Serial number mismatch..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={!rejectReason.trim() || isProcessing}
                      >
                        {isProcessing ? "Rejecting..." : "Confirm Rejection"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  className="bg-success hover:bg-success/90 text-white"
                  onClick={handleApprove}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Approve Request
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images & Key Info */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="p-4 overflow-hidden">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-4">
                {asset.imageUrls && asset.imageUrls[0] ? (
                  <img
                    src={asset.imageUrls[0]}
                    alt={asset.model}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-accent/10 text-accent">
                    <Package className="h-16 w-16" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <p className="text-xs text-muted-foreground mb-1">Production Year</p>
                  <p className="font-semibold">{asset.productionYear}</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <p className="text-xs text-muted-foreground mb-1">Condition</p>
                  <p className="font-semibold">{asset.conditionRating}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" />
                Verification Status
              </h3>

              <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-primary bg-background z-10" />
                  <p className="text-sm font-medium">Request Submitted</p>
                  <p className="text-xs text-muted-foreground">{new Date(asset.createdAt).toLocaleString()}</p>
                </div>

                {asset.approvedAt && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-success bg-success z-10" />
                    <p className="text-sm font-medium">Approved</p>
                    <p className="text-xs text-muted-foreground">{new Date(asset.approvedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6">Asset Details</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-muted-foreground">Brand</Label>
                  <p className="text-lg font-medium">{asset.brand}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Model</Label>
                  <p className="text-lg font-medium">{asset.model}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Reference Number</Label>
                  <p className="text-lg font-mono">{asset.refNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Serial Number</Label>
                  <p className="text-lg font-mono">{asset.serialNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Box Included</Label>
                  <p className="text-lg font-medium">{asset.hasBox ? "Yes" : "No"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Papers Included</Label>
                  <p className="text-lg font-medium">{asset.hasPapers ? "Yes" : "No"}</p>
                </div>
              </div>

              {asset.auditorNotes && (
                <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
                  <Label className="text-muted-foreground mb-2 block">Auditor Notes</Label>
                  <p className="text-sm">{asset.auditorNotes}</p>
                </div>
              )}
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6">Owner Information</h2>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                  {asset.ownerId.slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium">Wallet Address</p>
                  <p className="font-mono text-muted-foreground">{asset.ownerId}</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto" onClick={() => {
                  navigator.clipboard.writeText(asset.ownerId);
                  toast.success("Address copied to clipboard");
                }}>
                  Copy Address
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
