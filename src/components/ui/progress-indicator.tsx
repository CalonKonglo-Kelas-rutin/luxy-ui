"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  label: string;
  description?: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function ProgressIndicator({
  steps,
  currentStep,
  className,
}: ProgressIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex items-start justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={index} className="flex flex-col items-center relative" style={{ flex: 1 }}>
              {/* Step Circle */}
              <div
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 z-10 bg-background",
                  {
                    "border-accent bg-accent text-accent-foreground":
                      isCompleted,
                    "border-primary bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30":
                      isCurrent,
                    "border-border bg-background text-muted-foreground":
                      isUpcoming,
                  }
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}

                {isCurrent && (
                  <span className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-ping" />
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-0.5 -z-0">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      isCompleted
                        ? "bg-accent"
                        : "bg-border"
                    )}
                  />
                </div>
              )}

              {/* Step Label */}
              <div className="mt-2 text-center w-full px-2">
                <p
                  className={cn("text-sm font-medium", {
                    "text-foreground": isCurrent || isCompleted,
                    "text-muted-foreground": isUpcoming,
                  })}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
