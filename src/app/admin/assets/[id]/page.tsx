"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Image as EmptyImage,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Wallet,
  Coins,
  AlertCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { assetService } from "@/services/assetService";
import { Asset } from "@/types/asset";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { useWallet } from "@/hooks/use-wallet";
import { useTokenizeAsset } from "@/hooks/use-tokenize-asset";
import { LISK_SEPOLIA_EXPLORER } from "@/config/contracts";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function AdminAssetDetailPage() {
  const params = useParams();
  const assetId = params.id as string;
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  // Approval dialog state
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [auditorNotes, setAuditorNotes] = useState("");
  const [appraisedValue, setAppraisedValue] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Wallet and tokenization
  const { isConnected } = useWallet();
  const {
    tokenizeAsset,
    txHash,
    tokenId,
    isWritePending,
    isConfirming,
    isConfirmed,
    error: tokenizeError,
    reset: resetTokenize,
  } = useTokenizeAsset();

  const fetchAsset = useCallback(async () => {
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
  }, [assetId]);

  useEffect(() => {
    if (assetId) {
      fetchAsset();
    }
  }, [assetId, fetchAsset]);

  const handleApproveClick = () => {
    // Check wallet connection
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    // Open approval dialog
    setIsApproveDialogOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!asset) return;

    // Validate inputs
    if (!auditorNotes.trim()) {
      toast.error("Please provide auditor notes");
      return;
    }

    const valueUsd = parseFloat(appraisedValue);
    if (!appraisedValue || isNaN(valueUsd) || valueUsd <= 0) {
      toast.error("Please provide a valid appraised value");
      return;
    }

    try {
      setIsProcessing(true);

      // Step 1: Tokenize on blockchain
      toast.info("Initiating blockchain transaction...");
      const tokenizeSuccess = await tokenizeAsset(asset);

      if (!tokenizeSuccess) {
        throw new Error("Failed to initiate tokenization");
      }

      // Transaction is now pending...
      toast.info("Waiting for transaction confirmation...");
    } catch (error) {
      console.error("Failed to approve asset:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to approve asset"
      );
      setIsProcessing(false);
    }
  };

  // Watch for transaction confirmation
  useEffect(() => {
    if (isConfirmed && txHash && tokenId && asset) {
      // Step 2: Call backend approval API after blockchain confirmation
      const approveOnBackend = async () => {
        try {
          toast.success("Transaction confirmed! Finalizing approval...");

          await assetService.approveAsset(asset.id.toString(), {
            documentsUrl: "",
            auditorNotes: auditorNotes,
            appraisedValueUsd: parseFloat(appraisedValue),
            ipfsMetadataUri: "",
            tokenId: tokenId,
            txHashMint: txHash,
          });

          toast.success("Asset approved and tokenized successfully!");
          setIsApproveDialogOpen(false);
          resetTokenize();
          setAuditorNotes("");
          setAppraisedValue("");
          fetchAsset(); // Refresh data
        } catch (error) {
          console.error("Failed to approve on backend:", error);
          toast.error(
            "Blockchain transaction succeeded, but backend approval failed. Please contact support."
          );
        } finally {
          setIsProcessing(false);
        }
      };

      approveOnBackend();
    }
  }, [
    isConfirmed,
    txHash,
    tokenId,
    asset,
    auditorNotes,
    appraisedValue,
    resetTokenize,
    fetchAsset,
  ]);

  // Handle tokenization errors
  useEffect(() => {
    if (tokenizeError) {
      console.error("Tokenization error:", tokenizeError);
      toast.error("Transaction failed: " + tokenizeError.message);
      setIsProcessing(false);
    }
  }, [tokenizeError]);

  const handleReject = async () => {
    if (!asset) return;

    try {
      setIsProcessing(true);
      await assetService.rejectAsset(asset.id.toString(), rejectReason);

      toast.success("Asset rejected successfully");
      setIsRejectDialogOpen(false);

      fetchAsset();
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
        <div className="flex flex-col items-center justify-center min-h-screen">
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
        {
          label: `${asset.brand} ${asset.model}`,
          href: `/admin/assets/${asset.id}`,
        },
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
              <h1 className="text-3xl font-bold">
                {asset.brand} {asset.model}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <span className="font-mono text-sm">
                  Owner: {asset.ownerId}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge
              status={asset.status}
              className="text-base px-4 py-2"
            />

            {asset.status === "PENDING" && (
              <>
                <Dialog
                  open={isRejectDialogOpen}
                  onOpenChange={setIsRejectDialogOpen}
                >
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
                        Are you sure you want to reject this asset? This action
                        cannot be undone. Please provide a reason for the
                        rejection.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Label htmlFor="reason" className="mb-2 block">
                        Rejection Reason
                      </Label>
                      <Textarea
                        id="reason"
                        placeholder="e.g., Images are blurry, Serial number mismatch..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsRejectDialogOpen(false)}
                      >
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

                <Dialog
                  open={isApproveDialogOpen}
                  onOpenChange={setIsApproveDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      onClick={handleApproveClick}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      Approve & Tokenize
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Approve Asset & Mint Token</DialogTitle>
                      <DialogDescription>
                        This will create a tokenized version of the asset on the
                        blockchain and approve it in the system.
                      </DialogDescription>
                    </DialogHeader>

                    {!isConnected ? (
                      <div className="py-8 text-center space-y-4">
                        <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                          <Wallet className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium mb-1">
                            Wallet Not Connected
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Please connect your admin wallet to approve assets
                          </p>
                        </div>
                        <Button onClick={() => setIsApproveDialogOpen(false)}>
                          Close
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 py-4">
                          {/* Asset Info */}
                          <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                            <p className="text-sm text-muted-foreground mb-1">
                              Asset
                            </p>
                            <p className="font-semibold">
                              {asset?.brand} {asset?.model}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono mt-1">
                              S/N: {asset?.serialNumber}
                            </p>
                          </div>

                          {/* Auditor Notes */}
                          <div>
                            <Label
                              htmlFor="auditor-notes"
                              className="mb-2 block"
                            >
                              Auditor Notes{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                              id="auditor-notes"
                              placeholder="Asset has been verified and is authentic..."
                              value={auditorNotes}
                              onChange={(e) => setAuditorNotes(e.target.value)}
                              rows={3}
                              disabled={isProcessing}
                            />
                          </div>

                          {/* Appraised Value */}
                          <div>
                            <Label
                              htmlFor="appraised-value"
                              className="mb-2 block"
                            >
                              Appraised Value (USD){" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                $
                              </span>
                              <Input
                                id="appraised-value"
                                type="number"
                                placeholder="150000.00"
                                value={appraisedValue}
                                onChange={(e) =>
                                  setAppraisedValue(e.target.value)
                                }
                                className="pl-7"
                                min="0"
                                step="0.01"
                                disabled={isProcessing}
                              />
                            </div>
                          </div>

                          {/* Token Info */}
                          <div className="p-3 rounded-lg bg-muted/50 border space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Coins className="h-4 w-4 text-accent" />
                              <span className="font-medium">Token Supply:</span>
                              <span>1,000 tokens</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              The asset will be tokenized with 1,000
                              fractionalized tokens.
                            </p>
                          </div>

                          {/* Transaction Status */}
                          {isProcessing && (
                            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 space-y-2">
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                                <span className="font-medium text-sm">
                                  {isWritePending &&
                                    "Waiting for wallet confirmation..."}
                                  {isConfirming &&
                                    "Confirming transaction on blockchain..."}
                                  {isConfirmed && "Finalizing approval..."}
                                </span>
                              </div>
                              {txHash && (
                                <a
                                  href={`${LISK_SEPOLIA_EXPLORER}/tx/${txHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-accent hover:underline"
                                >
                                  View transaction
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          )}

                          {/* Gas Fee Warning */}
                          {!isProcessing && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-muted-foreground">
                                You will pay gas fees for this transaction. Make
                                sure you have enough ETH in your wallet.
                              </p>
                            </div>
                          )}
                        </div>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsApproveDialogOpen(false);
                              resetTokenize();
                            }}
                            disabled={isProcessing}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-success hover:bg-success/90 text-white"
                            onClick={handleApproveConfirm}
                            disabled={
                              !auditorNotes.trim() ||
                              !appraisedValue ||
                              isProcessing
                            }
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Confirm Approval
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>

        {!asset.approvedAt && !asset.rejectedAt && (
          <Alert>
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Verification Notice</AlertTitle>
            <AlertDescription>
              Please ensure all asset details are thoroughly verified before
              approval. Once approved, the asset will be tokenized on the
              blockchain and this action cannot be undone.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images & Key Info */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="overflow-hidden">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                {asset.imageUrls ? (
                  <Image
                    src={`${baseUrl}${asset.imageUrls}`}
                    alt={asset.model}
                    className="h-full w-full object-cover"
                    width={400}
                    height={400}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-accent/10 text-accent">
                    <EmptyImage className="h-16 w-16" />
                  </div>
                )}
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
                  <p className="text-xs text-muted-foreground">
                    {new Date(asset.createdAt).toLocaleString()}
                  </p>
                </div>

                {asset.approvedAt && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-success bg-success z-10" />
                    <p className="text-sm font-medium">Approved</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(asset.approvedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {asset.rejectedAt && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-destructive bg-destructive z-10" />
                    <p className="text-sm font-medium">Rejected</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(asset.rejectedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-4">Asset Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Reference Number
                  </p>
                  <p className="font-mono font-medium">{asset.refNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Serial Number
                  </p>
                  <p className="font-mono font-medium">{asset.serialNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Production Year
                  </p>
                  <p className="font-medium">{asset.productionYear}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Condition
                  </p>
                  <Badge variant="outline">{asset.conditionRating}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Box Included
                  </p>
                  <p className="font-medium">{asset.hasBox ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Papers Included
                  </p>
                  <p className="font-medium">
                    {asset.hasPapers ? "Yes" : "No"}
                  </p>
                </div>
                {asset.auditorNotes && asset.rejectedAt && (
                  <Alert variant="destructive" className="md:col-span-2">
                    <AlertTitle className="mb-1">Auditor Notes:</AlertTitle>
                    <AlertDescription>{asset.auditorNotes}</AlertDescription>
                  </Alert>
                )}
                {asset.auditorNotes && asset.approvedAt && (
                  <Alert variant="default" className="md:col-span-2">
                    <AlertTitle className="mb-1">Auditor Notes:</AlertTitle>
                    <AlertDescription>{asset.auditorNotes}</AlertDescription>
                  </Alert>
                )}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6">Owner Information</h2>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                  {asset.ownerId.slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium">Wallet Address</p>
                  <p className="font-mono text-muted-foreground">
                    {asset.ownerId}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={() => {
                    navigator.clipboard.writeText(asset.ownerId);
                    toast.success("Address copied to clipboard");
                  }}
                >
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
