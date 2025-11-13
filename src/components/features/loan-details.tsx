'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCollateral } from '@/hooks/use-collateral';
import { useWallet } from '@/hooks/use-wallet';
import { 
  FileTextIcon, 
  CalendarIcon, 
  TrendingUpIcon, 
  AlertCircleIcon,
  CheckCircle2Icon 
} from 'lucide-react';
import { formatCurrency } from '@/utils';

export function LoanDetails() {
  const { isConnected } = useWallet();
  const { position, isLoading } = useCollateral();

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            Loan Details
          </CardTitle>
          <CardDescription>View your active loan information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Connect your wallet to view loan details
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading && !position) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            Loan Details
          </CardTitle>
          <CardDescription>View your active loan information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading loan details...
          </div>
        </CardContent>
      </Card>
    );
  }

  const loan = position?.loan;

  if (!loan || loan.borrowedAmount === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            Loan Details
          </CardTitle>
          <CardDescription>View your active loan information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2Icon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Active Loan</h3>
            <p className="text-sm text-muted-foreground">
              {`You don't have any active loans at the moment.`}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // At this point, TypeScript knows loan is not null

  const getHealthVariant = (ratio: number): "default" | "secondary" | "destructive" | "outline" => {
    if (ratio >= 150) return 'default';
    if (ratio >= 120) return 'secondary';
    return 'destructive';
  };

  const getLtvVariant = (ratio: number): "default" | "secondary" | "destructive" | "outline" => {
    if (ratio <= 50) return 'default';
    if (ratio <= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5" />
              Loan Details
            </CardTitle>
            <CardDescription>Your active loan information</CardDescription>
          </div>
          <Badge variant={loan.status === 'active' ? 'default' : 'secondary'}>
            {loan.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Loan Amount */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Borrowed Amount</span>
          <span className="text-lg font-semibold">
            {formatCurrency(loan.borrowedAmount)} USDT
          </span>
        </div>

        <Separator />

        {/* Collateral Amount */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Collateral Locked</span>
          <span className="font-medium">
            {loan.collateralAmount.toFixed(4)} WBTC
          </span>
        </div>

        {/* Collateral Value */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Collateral Value</span>
          <span className="font-medium">
            {formatCurrency(position.collateral.usdtValue)} USDT
          </span>
        </div>

        <Separator />

        {/* LTV Ratio */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">LTV Ratio</span>
          </div>
          <Badge variant={getLtvVariant(loan.ltvRatio)}>
            {loan.ltvRatio.toFixed(2)}%
          </Badge>
        </div>

        {/* Health Ratio */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Health Ratio</span>
          </div>
          <Badge variant={getHealthVariant(loan.healthRatio)}>
            {loan.healthRatio.toFixed(2)}%
          </Badge>
        </div>

        {/* Available to Borrow */}
        {position.availableToBorrow > 0 && (
          <>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Available to Borrow</span>
              <span className="font-medium text-green-600">
                ${position.availableToBorrow.toFixed(2)} USDT
              </span>
            </div>
          </>
        )}

        {/* Borrowed Date */}
        {loan.borrowedAt && (
          <>
            <Separator />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                <span>Borrowed on</span>
              </div>
              <span>{new Date(loan.borrowedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </>
        )}

        {/* Risk Warning */}
        {loan.healthRatio < 150 && (
          <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20 p-3 mt-4">
            <div className="flex gap-2">
              <AlertCircleIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-yellow-800 dark:text-yellow-500">
                  {loan.healthRatio < 120 ? 'High Risk Warning' : 'Risk Warning'}
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-600">
                  Your position health ratio is low. Consider repaying some of your loan or adding more collateral to reduce liquidation risk.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
