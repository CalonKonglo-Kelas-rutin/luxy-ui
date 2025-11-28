"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Asset } from "@/types/asset";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle, Package, MoveRight } from "lucide-react";

interface AssetCardHoverProps {
  assets: Asset[];
  className?: string;
}

export const AssetCardHover = ({ assets, className }: AssetCardHoverProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "tokenized":
        return "success";
      case "rejected":
        return "destructive";
      case "pending":
      case "submitted":
      case "verifying":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "tokenized":
        return <CheckCircle2 className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
      case "submitted":
      case "verifying":
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10",
        className
      )}
    >
      {assets.map((asset, idx) => (
        <div
          key={asset.id}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gradient-to-br from-accent/20 via-primary/10 to-accent/20 dark:from-accent/30 dark:via-primary/20 dark:to-accent/30 block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>

          <AssetCard asset={asset} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} />
        </div>
      ))}
    </div>
  );
};

interface AssetCardProps {
  asset: Asset;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

const AssetCard = ({ asset, getStatusColor, getStatusIcon }: AssetCardProps) => {
  return (
    <div className="rounded-2xl h-full w-full overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 group-hover:border-accent/50 relative z-20 transition-all duration-300">
      {/* Status indicator bar */}
      <div className="h-1.5 w-full bg-muted">
        <motion.div
          className={cn(
            "h-full",
            getStatusColor(asset.status) === "success" && "bg-green-500",
            getStatusColor(asset.status) === "warning" && "bg-yellow-500",
            getStatusColor(asset.status) === "destructive" && "bg-red-500",
            getStatusColor(asset.status) === "default" && "bg-gray-500"
          )}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="relative z-50 p-6 flex flex-col h-full">
        {/* Header with brand and status */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
              {asset.brand}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{asset.model}</p>
          </div>
          <Badge
            variant={getStatusColor(asset.status) as any}
            className="flex items-center gap-1.5 ml-2"
          >
            {getStatusIcon(asset.status)}
            {asset.status}
          </Badge>
        </div>

        {/* Asset details */}
        <div className="space-y-3 text-sm flex-1">
          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-muted-foreground">Reference</span>
            <span className="font-mono text-foreground font-medium">
              {asset.refNumber}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-muted-foreground">Serial Number</span>
            <span className="font-mono text-foreground text-xs">
              {asset.serialNumber}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-muted-foreground">Year</span>
            <span className="text-foreground font-medium">
              {asset.productionYear}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-muted-foreground">Condition</span>
            <Badge variant="outline" className="text-xs">
              {asset.conditionRating}
            </Badge>
          </div>

          {asset.appraisedValueUsd && (
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-muted-foreground">Appraised Value</span>
              <span className="text-foreground font-bold text-accent">
                ${asset.appraisedValueUsd.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">Submitted</span>
            <span className="text-foreground text-xs">
              {new Date(asset.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Accessories */}
          <div className="flex gap-2 pt-2">
            {asset.hasBox && (
              <Badge variant="secondary" className="text-xs">
                Box
              </Badge>
            )}
            {asset.hasPapers && (
              <Badge variant="secondary" className="text-xs">
                Papers
              </Badge>
            )}
          </div>
        </div>
        
        {/* Auditor notes if rejected */}
        {asset.auditorNotes && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-xs text-destructive font-medium mb-1">
              Auditor Notes:
            </p>
            <p className="text-xs text-muted-foreground">{asset.auditorNotes}</p>
          </div>
        )}

        {/* Action button */}
        <div className="mt-6 pt-4 border-t border-border/30">
          <Button
            className="w-full group-hover:bg-accent group-hover:text-accent-foreground dark:group-hover:bg-accent transition-all"
            variant="outline"
            asChild
          >
            <Link href={`/assets/my-requests/${asset.id}`}>
              View Details
              <motion.span
                className="ml-2"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <MoveRight />
              </motion.span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
