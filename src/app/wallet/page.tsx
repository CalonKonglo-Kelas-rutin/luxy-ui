"use client";

import { MainLayout } from "@/components/layouts/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  Copy,
  ExternalLink,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  AlertCircle,
  Info,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const walletData = {
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f9a8e",
  balance: 11550,
  tokenBalance: 1,
  network: "Lisk Testnet",
};

const loanData = {
  loanId: "LOAN-2024-001",
  assetId: "AST-2024-001",
  assetName: "18K Gold Rolex Submariner",
  tokenId: "RWA-ROLEX-001",
  principalAmount: 11550,
  interestRate: 8.5,
  loanTerm: 12,
  disbursedAt: "2024-11-20T14:30:00Z",
  dueDate: "2025-11-20",
  monthlyPayment: 1025,
  status: "active" as const,
};

const transactionHistory = [
  {
    id: "TX-001",
    type: "disbursement",
    amount: 11550,
    timestamp: "2024-11-20T14:30:00Z",
    status: "confirmed",
    txHash: "0xabc...def",
  },
  {
    id: "TX-002",
    type: "tokenization",
    amount: 0,
    timestamp: "2024-11-20T14:28:00Z",
    status: "confirmed",
    txHash: "0x123...456",
  },
];

export default function WalletPage() {
  const totalOwed = loanData.principalAmount * (1 + loanData.interestRate / 100);
  const remainingBalance = totalOwed;
  const interestAmount = totalOwed - loanData.principalAmount;

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Wallet", href: "/wallet" },
        { label: "Funds Received", href: "/wallet" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6 py-6">
        {/* Success Banner */}
        <GlassCard
          gradient
          className="p-6 bg-linear-to-br from-success/10 via-accent/5 to-primary/5 border-success/20"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-success/20">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">Funds Successfully Disbursed! 🎉</h1>
              <p className="text-muted-foreground">
                Your liquidity has been transferred to your wallet
              </p>
            </div>
            <Badge variant="outline" className="text-base px-4 py-2 bg-success/10 text-success border-success/20 gap-2">
              <TrendingUp className="h-4 w-4" />
              Active
            </Badge>
          </div>
        </GlassCard>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet & Loan Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Balance */}
            <GlassCard gradient className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Wallet className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Your Wallet</h2>
                    <p className="text-sm text-muted-foreground">{walletData.network}</p>
                  </div>
                </div>
                <Badge variant="outline" className="gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  Connected
                </Badge>
              </div>

              <div className="space-y-6">
                {/* USDC Balance */}
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-accent/20 to-success/20 rounded-lg blur-xl" />
                  <div className="relative p-6 rounded-lg bg-card/50 border">
                    <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
                    <div className="flex items-end gap-3 mb-4">
                      <p className="text-5xl font-bold text-accent">
                        ${walletData.balance.toLocaleString()}
                      </p>
                      <span className="text-xl text-muted-foreground mb-2">USDC</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-accent hover:bg-accent/90 gap-2">
                        <ArrowDownToLine className="h-4 w-4" />
                        Withdraw
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        View on Explorer
                      </Button>
                    </div>
                  </div>
                </div>

                {/* RWA Token */}
                <div className="p-4 rounded-lg bg-card/50 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Asset Token</p>
                      <p className="text-xl font-bold">{loanData.tokenId}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Collateral for this loan
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{walletData.tokenBalance}</p>
                      <p className="text-xs text-muted-foreground">Token</p>
                    </div>
                  </div>
                </div>

                {/* Wallet Address */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{walletData.address}</span>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>

            {/* Loan Breakdown */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-6">Loan Details</h3>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-card/50 border text-center">
                  <p className="text-sm text-muted-foreground mb-1">Principal</p>
                  <p className="text-2xl font-bold">
                    ${loanData.principalAmount.toLocaleString()}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-card/50 border text-center">
                  <p className="text-sm text-muted-foreground mb-1">Interest</p>
                  <p className="text-2xl font-bold text-warning">
                    ${interestAmount.toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {loanData.interestRate}% APR
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-card/50 border text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Owed</p>
                  <p className="text-2xl font-bold text-destructive">
                    ${totalOwed.toFixed(0)}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loan ID</span>
                  <span className="font-mono">{loanData.loanId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Collateral Asset</span>
                  <span className="font-medium">{loanData.assetName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loan Term</span>
                  <span className="font-medium">{loanData.loanTerm} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disbursed On</span>
                  <span className="font-medium">
                    {new Date(loanData.disbursedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date</span>
                  <span className="font-medium">
                    {new Date(loanData.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Transaction History */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>

              <div className="space-y-3">
                {transactionHistory.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-card/50 border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-success/10">
                        {tx.type === "disbursement" ? (
                          <ArrowDownToLine className="h-4 w-4 text-success" />
                        ) : (
                          <Coins className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{tx.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {tx.amount > 0 && (
                        <p className="font-bold text-success">
                          +${tx.amount.toLocaleString()}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-success" />
                        Confirmed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Next Payment */}
            <GlassCard className="p-6 bg-linear-to-br from-warning/10 to-accent/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <h3 className="font-semibold">Next Payment Due</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount Due</p>
                  <p className="text-3xl font-bold">
                    ${loanData.monthlyPayment.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                  <p className="text-lg font-medium">December 20, 2024</p>
                  <p className="text-sm text-warning">30 days remaining</p>
                </div>

                <Button className="w-full bg-accent hover:bg-accent/90 gap-2">
                  <CreditCard className="h-4 w-4" />
                  Make Payment
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button variant="outline" className="w-full">
                  View Repayment Schedule
                </Button>
              </div>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View Loan Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Token Contract
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Get Support
                </Button>
              </div>
            </GlassCard>

            {/* Important Info */}
            <GlassCard className="p-4 bg-info/5 border-info/20">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-info mb-2">Important Notice</p>
                  <ul className="space-y-1.5 text-muted-foreground">
                    <li>• Make payments on time to avoid penalties</li>
                    <li>• Your asset remains securely stored</li>
                    <li>• Full repayment unlocks asset retrieval</li>
                    <li>• Early repayment is always allowed</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            {/* Asset Retrieval Info */}
            <GlassCard className="p-6 bg-linear-to-br from-success/5 to-accent/5">
              <h3 className="font-semibold mb-3">Ready to Get Your Asset Back?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Repay your loan in full to unlock and retrieve your physical asset from secure storage.
              </p>
              <Button variant="outline" className="w-full gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Pay Off & Retrieve
              </Button>
            </GlassCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
