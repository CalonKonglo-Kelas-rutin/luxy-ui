"use client";
// Force update

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import type { VerificationStatus } from "@/types/asset";

interface StatusBadgeProps {
  status: VerificationStatus;
  className?: string;
  showIcon?: boolean;
}

const verificationStatusConfig: Record<
  VerificationStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ComponentType<{ className?: string }>;
    className: string;
  }
> = {
  PENDING: {
    label: "Pending",
    variant: "secondary",
    icon: Clock,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  APPROVED: {
    label: "Approved",
    variant: "default",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/20",
  },
  REJECTED: {
    label: "Rejected",
    variant: "destructive",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  TOKENIZED: {
    label: "Tokenized",
    variant: "default",
    icon: CheckCircle2,
    className: "bg-accent/10 text-accent border-accent/20",
  },
};


export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const config = (verificationStatusConfig[status as VerificationStatus]);

  if (!config) return null;

  const Icon = config.icon;
  const isSpinning = false;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "px-3 py-1 font-medium border transition-all duration-300",
        config.className,
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn("h-3.5 w-3.5 mr-1.5", {
            "animate-spin": isSpinning,
          })}
        />
      )}
      {config.label}
    </Badge>
  );
}
