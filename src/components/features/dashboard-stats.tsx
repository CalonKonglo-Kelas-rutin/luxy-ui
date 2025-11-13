'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollateral } from '@/hooks/use-collateral';
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon, ShieldCheckIcon } from 'lucide-react';
import { formatCurrency } from '@/utils';

export function DashboardStats() {
  const { position, btcPrice, isLoading } = useCollateral();

  if (isLoading && !position) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const collateralValue = position?.collateral.usdtValue || 0;
  const borrowedAmount = position?.loan?.borrowedAmount || 0;
  const healthRatio = position?.loan?.healthRatio || 100;
  const ltvRatio = position?.loan?.ltvRatio || 0;

  const getHealthColor = (ratio: number) => {
    if (ratio >= 150) return 'text-green-600';
    if (ratio >= 120) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthStatus = (ratio: number) => {
    if (ratio >= 150) return 'Healthy';
    if (ratio >= 120) return 'Warning';
    return 'At Risk';
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Collateral Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Collateral</CardTitle>
          <ShieldCheckIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {position?.collateral.wbtcAmount.toFixed(4) || '0.0000'} WBTC
          </div>
          <p className="text-xs text-muted-foreground">
            ≈ {formatCurrency(collateralValue)} USDT
          </p>
          {btcPrice && (
            <p className="text-xs text-muted-foreground mt-1">
              BTC Price: {formatCurrency(btcPrice.btcPrice)} USDT
            </p>
          )}
        </CardContent>
      </Card>

      {/* Borrowed Amount Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Borrowed Amount</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(borrowedAmount)}
          </div>
          <p className="text-xs text-muted-foreground">USDT Stablecoin</p>
          {ltvRatio > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={ltvRatio > 60 ? 'destructive' : 'secondary'} className="text-xs">
                LTV: {ltvRatio.toFixed(1)}%
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Ratio Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Health Ratio</CardTitle>
          <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getHealthColor(healthRatio)}`}>
            {borrowedAmount > 0 ? `${healthRatio.toFixed(1)}%` : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">
            {borrowedAmount > 0 ? getHealthStatus(healthRatio) : 'No active loan'}
          </p>
          {position?.availableToBorrow !== undefined && position.availableToBorrow > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <ArrowDownIcon className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">
                ${position.availableToBorrow.toFixed(2)} available
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
