"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Timeline } from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Clock,
  MessageSquare,
  ArrowRight,
  Shield,
  Search,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerificationTimeline, Asset } from "@/types/asset";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAssetRegistration } from "@/hooks/use-asset-registration";

const messages = [
  {
    id: 1,
    from: "Verification Partner",
    message: "Your asset has been received and initial inspection looks good. Full appraisal in progress.",
    timestamp: "2024-11-19 11:50 AM",
    isRead: true,
  },
  {
    id: 2,
    from: "System",
    message: "Reminder: You can track your asset status in real-time on this page.",
    timestamp: "2024-11-19 10:00 AM",
    isRead: true,
  },
];

export default function AssetStatusPage() {
  const params = useParams();
  const assetId = params.id as string;
  const { getAssetById, isLoading } = useAssetRegistration();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAsset = async () => {
      if (!assetId) return;

      try {
        setError(null);
        const data = await getAssetById(assetId);
        console.log("Asset data:", data);
        setAsset(data);
      } catch (err) {
        console.error("Failed to fetch asset:", err);
        setError(err instanceof Error ? err.message : "Failed to load asset details");
      }
    };

    fetchAsset();
  }, [assetId, getAssetById]);

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout
        breadcrumbs={[
          { label: "Assets", href: "/assets" },
          { label: "Status", href: "/assets/verification" },
        ]}
      >
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
          <p className="text-muted-foreground">Loading asset details...</p>
        </div>
      </MainLayout>
    );
  }

  // Show error state
  if (error || !asset) {
    return (
      <MainLayout
        breadcrumbs={[
          { label: "Assets", href: "/assets" },
          { label: "Status", href: "/assets/verification" },
        ]}
      >
        <GlassCard className="p-8 border-destructive/20 bg-destructive/5 text-center max-w-2xl mx-auto mt-20">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium mb-2">{error || "Asset not found"}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </GlassCard>
      </MainLayout>
    );
  }

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Static timeline with dynamic timestamps from asset data
  const timelineEvents: VerificationTimeline[] = [
    {
      status: "pending",
      timestamp: asset.createdAt ? formatDate(asset.createdAt) : "",
      description: "Asset registration submitted successfully",
      completedBy: "System",
    },
    {
      status: "in-transit",
      timestamp: asset.updatedAt && asset.status.toLowerCase() !== "pending" ? formatDate(asset.updatedAt) : "",
      description: "Asset picked up by logistics partner",
      completedBy: asset.status.toLowerCase() !== "pending" ? "Swift Logistics" : undefined,
    },
    {
      status: "at-pawnshop",
      timestamp: "",
      description: "Asset delivered to verification partner",
      completedBy: undefined,
    },
    {
      status: "verifying",
      timestamp: "",
      description: "Physical verification and authenticity check in progress",
      completedBy: undefined,
    },
    {
      status: "appraising",
      timestamp: "",
      description: "Professional appraisal and valuation pending",
      completedBy: undefined,
    },
    {
      status: "approved",
      timestamp: asset.approvedAt ? formatDate(asset.approvedAt) : "",
      description: "Final approval and tokenization eligibility",
      completedBy: asset.status.toLowerCase() === "approved" || asset.status.toLowerCase() === "tokenized" ? "Verification Team" : undefined,
    },
  ];

  const currentStepIndex = timelineEvents.findIndex(
    (event) => event.status === asset.status.toLowerCase()
  );

  const formattedEvents = timelineEvents.map((event, index) => ({
    status: event.status,
    label: event.description,
    timestamp: event.timestamp,
    description: event.completedBy ? `Completed by: ${event.completedBy}` : undefined,
    isCompleted: index < currentStepIndex,
    isCurrent: index === currentStepIndex,
  }));

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Assets", href: "/assets" },
        { label: "Status", href: "/assets/status" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 py-4 sm:py-6 px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">{asset.brand} {asset.model}</h1>
            <p className="text-sm sm:text-base text-muted-foreground break-all">Asset ID: {asset.id}</p>
            <p className="text-sm sm:text-base text-muted-foreground break-all">Owner Address: {asset.ownerId}</p>
          </div>
          <StatusBadge status={asset.status} className="text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 shrink-0" />
        </div>

        {/* Asset Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <GlassCard className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Appraised Value</p>
                <p className="text-2xl font-bold text-accent">
                  {asset.appraisedValueUsd ? `$${asset.appraisedValueUsd.toLocaleString()}` : 'Pending'}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-accent/10">
                <Package className="h-5 w-5 text-accent" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                <p className="text-lg font-medium">
                  {new Date(asset.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Asset Details */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Asset Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Reference Number</p>
              <p className="font-mono font-medium">{asset.refNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Serial Number</p>
              <p className="font-mono font-medium">{asset.serialNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Production Year</p>
              <p className="font-medium">{asset.productionYear}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Condition</p>
              <Badge variant="outline">{asset.conditionRating}</Badge>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground mb-2">Accessories</p>
              <div className="flex gap-2">
                {asset.hasBox && (
                  <Badge variant="secondary">Box Included</Badge>
                )}
                {asset.hasPapers && (
                  <Badge variant="secondary">Papers Included</Badge>
                )}
                {!asset.hasBox && !asset.hasPapers && (
                  <span className="text-sm text-muted-foreground">No accessories</span>
                )}
              </div>
            </div>
            {asset.auditorNotes && (
              <div className="md:col-span-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm font-medium text-destructive mb-1">Auditor Notes:</p>
                <p className="text-sm text-muted-foreground">{asset.auditorNotes}</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Timeline */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <GlassCard gradient className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold">Verification Timeline</h2>
                <Badge variant="outline" className="gap-1.5 w-fit">
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  Live Updates
                </Badge>
              </div>

              <Timeline events={formattedEvents} />

              {/* Current Status Info */}
              <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">Current Status: {asset.status}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Track your asset verification progress in real-time. You will be notified at each stage.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            {/* Pawnshop Info */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-success/10">
                  <Shield className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">Partner Pawnshop</h3>
                  <p className="text-sm text-muted-foreground">Verified & Trusted</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">Golden Trust Pawnshop</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">Manhattan, NY</p>
                </div>
                <div>
                  <p className="text-muted-foreground">License</p>
                  <p className="font-mono text-xs">LIC-NY-8472</p>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4" size="sm">
                View Credentials
              </Button>
            </GlassCard>

            {/* Messages */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Updates & Messages</h3>
                <Badge variant="secondary">{messages.length}</Badge>
              </div>

              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "p-3 rounded-lg border transition-colors cursor-pointer",
                      msg.isRead
                        ? "bg-muted/30 border-border"
                        : "bg-accent/5 border-accent/20"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{msg.from}</p>
                      {!msg.isRead && (
                        <div className="h-2 w-2 rounded-full bg-accent" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {msg.message}
                    </p>
                    <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-4 gap-2" size="sm">
                <MessageSquare className="h-4 w-4" />
                View All Messages
              </Button>
            </GlassCard>

            {/* Next Steps */}
            <GlassCard className="p-6 bg-linear-to-br from-accent/10 to-primary/5">
              <h3 className="font-semibold mb-3">What Happens Next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                  <span>Appraisal completion (24-48 hours)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                  <span>Final value determination</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                  <span>Tokenization eligibility approval</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                  <span>Receive notification to proceed</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>

        {/* Action Bar */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <p className="text-sm text-muted-foreground">
                You will be notified when the next stage begins
              </p>
            </div>
            <Button variant="outline">
              Need Help?
            </Button>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
}
