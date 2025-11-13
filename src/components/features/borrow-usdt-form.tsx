'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollateral } from '@/hooks/use-collateral';
import { useWallet } from '@/hooks/use-wallet';
import { toast } from 'sonner';
import { CoinsIcon, AlertTriangleIcon } from 'lucide-react';

export function BorrowUsdtForm() {
  const { isConnected } = useWallet();
  const { borrowUsdt, position, isLoading } = useCollateral();
  const [usdtAmount, setUsdtAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableToBorrow = position?.availableToBorrow || 0;
  const currentBorrowed = position?.loan?.borrowedAmount || 0;
  const collateralValue = position?.collateral.usdtValue || 0;

  const calculateNewLtv = () => {
    if (!usdtAmount || !collateralValue) return 0;
    const amount = parseFloat(usdtAmount);
    if (isNaN(amount)) return 0;
    const newBorrowed = currentBorrowed + amount;
    return (newBorrowed / collateralValue) * 100;
  };

  const newLtvRatio = calculateNewLtv();
  const isLtvTooHigh = newLtvRatio > 70;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (collateralValue === 0) {
      toast.error('Please lock collateral first');
      return;
    }

    const amount = parseFloat(usdtAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > availableToBorrow) {
      toast.error(`Maximum available to borrow: $${availableToBorrow.toFixed(2)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await borrowUsdt(amount);
      toast.success(result.message);
      setUsdtAmount('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to borrow USDT';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setMaxAmount = () => {
    if (availableToBorrow > 0) {
      setUsdtAmount(availableToBorrow.toFixed(2));
    }
  };

  const hasCollateral = collateralValue > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CoinsIcon className="h-5 w-5" />
          Borrow USDT
        </CardTitle>
        <CardDescription>
          Borrow stablecoins against your locked collateral
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasCollateral ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <AlertTriangleIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Collateral Locked</h3>
            <p className="text-sm text-muted-foreground">
              Please lock WBTC as collateral first before borrowing USDT
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usdt-amount">USDT Amount</Label>
              <div className="flex gap-2">
                <Input
                  id="usdt-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={usdtAmount}
                  onChange={(e) => setUsdtAmount(e.target.value)}
                  disabled={!isConnected || isLoading || isSubmitting}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={setMaxAmount}
                  disabled={!isConnected || isLoading || isSubmitting || availableToBorrow <= 0}
                >
                  Max
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Available to borrow: <span className="font-medium">${availableToBorrow.toFixed(2)} USDT</span>
              </p>
            </div>

            {/* Current Position Info */}
            <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Collateral value:</span>
                <span className="font-medium">${collateralValue.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current borrowed:</span>
                <span className="font-medium">${currentBorrowed.toFixed(2)}</span>
              </div>
              {position?.loan && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current LTV:</span>
                  <Badge variant={position.loan.ltvRatio > 60 ? 'destructive' : 'secondary'}>
                    {position.loan.ltvRatio.toFixed(1)}%
                  </Badge>
                </div>
              )}
            </div>

            {/* New Position Preview */}
            {usdtAmount && parseFloat(usdtAmount) > 0 && (
              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="font-semibold text-sm mb-2">New Position Preview</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">You will borrow:</span>
                  <span className="font-medium">${parseFloat(usdtAmount).toFixed(2)} USDT</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total borrowed:</span>
                  <span className="font-medium">
                    ${(currentBorrowed + parseFloat(usdtAmount)).toFixed(2)} USDT
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground">New LTV ratio:</span>
                  <Badge variant={isLtvTooHigh ? 'destructive' : newLtvRatio > 60 ? 'secondary' : 'default'}>
                    {newLtvRatio.toFixed(1)}%
                  </Badge>
                </div>
                {isLtvTooHigh && (
                  <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded text-xs text-destructive">
                    <AlertTriangleIcon className="h-4 w-4" />
                    <span>LTV ratio exceeds maximum 70%</span>
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={
                !isConnected || 
                isLoading || 
                isSubmitting || 
                !usdtAmount || 
                parseFloat(usdtAmount) <= 0 || 
                isLtvTooHigh ||
                availableToBorrow <= 0
              }
            >
              {isSubmitting ? 'Borrowing...' : isConnected ? 'Borrow USDT' : 'Connect Wallet First'}
            </Button>

            {!isConnected && (
              <p className="text-xs text-center text-muted-foreground">
                Please connect your wallet to borrow USDT
              </p>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
}
