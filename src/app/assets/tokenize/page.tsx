"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Coins,
  Zap,
  Network,
  Shield,
  ExternalLink,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const assetData = {
  id: "AST-2024-001",
  name: "18K Gold Rolex Submariner",
  appraisedValue: 16500,
  maxLoanAmount: 11550,
  tokenSymbol: "RWA-ROLEX-001",
};

const kaminoStats = {
  totalLiquidity: "1.2B",
  apr: "4.8%",
  utilizationRate: "73%",
};

const steps = [
  "Asset Tokenization",
  "Smart Contract Deployment",
  "Kamino Integration",
  "Liquidity Release",
];

export default function TokenizationPage() {
  const [loanAmount, setLoanAmount] = useState(assetData.maxLoanAmount);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isCompleted, setIsCompleted] = useState(false);

  const ltvRatio = (loanAmount / assetData.appraisedValue) * 100;
  const monthlyInterest = (loanAmount * 0.085) / 12;

  const handleTokenize = async () => {
    setIsProcessing(true);
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    
    setIsCompleted(true);
    setIsProcessing(false);
  };

  if (isCompleted) {
    return (
      <MainLayout
        breadcrumbs={[
          { label: "Assets", href: "/assets" },
          { label: "Tokenization Complete", href: "/assets/tokenize" },
        ]}
      >
        <div className="max-w-4xl mx-auto space-y-6 py-6">
          {/* Success State */}
          <GlassCard
            gradient
            className="p-8 text-center bg-linear-to-br from-success/10 via-accent/5 to-primary/5"
          >
            <div className="inline-flex p-4 rounded-full bg-success/20 mb-4">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Tokenization Complete! 🎉</h1>
            <p className="text-muted-foreground mb-6">
              Your asset has been successfully tokenized and liquidity is ready
            </p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <Coins className="h-4 w-4 text-accent" />
              <span className="font-mono text-sm">{assetData.tokenSymbol}</span>
            </div>
          </GlassCard>

          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="font-semibold mb-4">Transaction Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Token ID</span>
                  <span className="font-mono">{assetData.tokenSymbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract</span>
                  <span className="font-mono text-xs">0x742d...9a8e</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chain</span>
                  <span className="font-medium">Lisk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Liquidity Provider</span>
                  <span className="font-medium">Kamino Finance</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 gap-2">
                <ExternalLink className="h-4 w-4" />
                View on Explorer
              </Button>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-semibold mb-4">Funds Ready</h3>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-accent">
                  ${loanAmount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">USDC</p>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">LTV Ratio</span>
                  <span className="font-medium">{ltvRatio.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interest Rate</span>
                  <span className="font-medium">8.5% APR</span>
                </div>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 gap-2">
                <Zap className="h-4 w-4" />
                Claim Funds
                <ArrowRight className="h-4 w-4" />
              </Button>
            </GlassCard>
          </div>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-success" />
              <p className="text-sm text-muted-foreground">
                Your asset remains securely stored. You can repay anytime to unlock and retrieve it.
              </p>
            </div>
          </GlassCard>
        </div>
      </MainLayout>
    );
  }

  if (isProcessing) {
    return (
      <MainLayout
        breadcrumbs={[
          { label: "Assets", href: "/assets" },
          { label: "Tokenizing...", href: "/assets/tokenize" },
        ]}
      >
        <div className="max-w-4xl mx-auto space-y-6 py-12">
          <GlassCard gradient className="p-12">
            <div className="text-center space-y-8">
              <div className="inline-flex p-6 rounded-full bg-accent/10 relative">
                <Loader2 className="h-16 w-16 text-accent animate-spin" />
                <div className="absolute inset-0 rounded-full border-4 border-accent/20 animate-ping" />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-2">Processing Tokenization</h2>
                <p className="text-muted-foreground">
                  Please wait while we complete the blockchain transactions
                </p>
              </div>

              {/* Steps Progress */}
              <div className="max-w-md mx-auto space-y-4">
                {steps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isComplete = index < currentStep;

                  return (
                    <div
                      key={step}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border transition-all duration-300",
                        isActive && "bg-accent/5 border-accent/40 scale-105",
                        isComplete && "bg-success/5 border-success/20",
                        !isActive && !isComplete && "bg-muted/30 border-border"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                          isActive && "bg-accent text-accent-foreground",
                          isComplete && "bg-success text-success-foreground",
                          !isActive && !isComplete && "bg-muted text-muted-foreground"
                        )}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : isActive ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <span className="text-sm">{index + 1}</span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "font-medium",
                          (isActive || isComplete) && "text-foreground",
                          !isActive && !isComplete && "text-muted-foreground"
                        )}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-sm text-muted-foreground">
                This process may take 1-2 minutes. Do not close this window.
              </p>
            </div>
          </GlassCard>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Assets", href: "/assets" },
        { label: "Tokenize & Get Liquidity", href: "/assets/tokenize" },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-6 py-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Tokenize & Unlock Liquidity
          </h1>
          <p className="text-muted-foreground text-lg">
            Convert your verified asset into instant, usable capital
          </p>
        </div>

        {/* Asset Summary */}
        <GlassCard gradient className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold">{assetData.name}</h2>
              <p className="text-sm text-muted-foreground">Asset ID: {assetData.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Appraised Value</p>
              <p className="text-3xl font-bold text-accent">
                ${assetData.appraisedValue.toLocaleString()}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Loan Configuration */}
        <GlassCard gradient className="p-6">
          <h3 className="text-xl font-semibold mb-6">Configure Your Loan</h3>

          <div className="space-y-6">
            {/* Loan Amount Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">Loan Amount</Label>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-accent">
                    ${loanAmount.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">USDC</span>
                </div>
              </div>

              <Slider
                id="amount"
                value={[loanAmount]}
                onValueChange={(value) => setLoanAmount(value[0])}
                min={1000}
                max={assetData.maxLoanAmount}
                step={100}
                className="py-4"
              />

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>$1,000</span>
                <span>Max: ${assetData.maxLoanAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Loan Metrics */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-card/50 border">
                <p className="text-sm text-muted-foreground mb-1">Loan-to-Value</p>
                <p className="text-2xl font-bold">{ltvRatio.toFixed(1)}%</p>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-accent to-success transition-all duration-300"
                    style={{ width: `${ltvRatio}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-card/50 border">
                <p className="text-sm text-muted-foreground mb-1">Interest Rate</p>
                <p className="text-2xl font-bold">8.5%</p>
                <p className="text-xs text-muted-foreground mt-1">Annual rate</p>
              </div>

              <div className="p-4 rounded-lg bg-card/50 border">
                <p className="text-sm text-muted-foreground mb-1">Monthly Interest</p>
                <p className="text-2xl font-bold">${monthlyInterest.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">Estimated</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Kamino Integration Info */}
        <GlassCard className="p-6 bg-linear-to-br from-primary/5 to-accent/10">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-accent/10">
              <Network className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Powered by Kamino Finance</h3>
              <p className="text-sm text-muted-foreground">
                Your tokenized asset will be integrated with Kamino's liquidity protocol
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-card/50 border text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Liquidity</p>
              <p className="text-xl font-bold">${kaminoStats.totalLiquidity}</p>
            </div>
            <div className="p-3 rounded-lg bg-card/50 border text-center">
              <p className="text-sm text-muted-foreground mb-1">Average APR</p>
              <p className="text-xl font-bold">{kaminoStats.apr}</p>
            </div>
            <div className="p-3 rounded-lg bg-card/50 border text-center">
              <p className="text-sm text-muted-foreground mb-1">Utilization</p>
              <p className="text-xl font-bold">{kaminoStats.utilizationRate}</p>
            </div>
          </div>

          <Button variant="ghost" className="w-full gap-2" size="sm">
            <Info className="h-4 w-4" />
            Learn more about Kamino
            <ExternalLink className="h-4 w-4" />
          </Button>
        </GlassCard>

        {/* Process Explanation */}
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-4">What Happens Next?</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                  <span className="text-accent font-semibold">{idx + 1}</span>
                </div>
                <p className="text-sm font-medium">{step}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Action Button */}
        <div className="flex gap-4">
          <Button size="lg" variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-accent hover:bg-accent/90 gap-2"
            onClick={handleTokenize}
          >
            <Sparkles className="h-5 w-5" />
            Tokenize & Get ${loanAmount.toLocaleString()}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Security Notice */}
        <GlassCard className="p-4 bg-card/50">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-success shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Secure & Transparent</p>
              <p>
                All transactions are executed on-chain with full transparency. Your physical asset
                remains insured and stored securely. You retain ownership and can repay to retrieve
                your asset at any time.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
}
