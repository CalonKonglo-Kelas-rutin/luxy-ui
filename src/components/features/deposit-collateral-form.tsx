'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCollateral } from '@/hooks/use-collateral';
import { useWallet } from '@/hooks/use-wallet';
import { toast } from 'sonner';
import { LockIcon, ArrowRightIcon } from 'lucide-react';

export function DepositCollateralForm() {
  const { isConnected } = useWallet();
  const { lockCollateral, isLoading, btcPrice } = useCollateral();
  const [wbtcAmount, setWbtcAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usdtValue = wbtcAmount && btcPrice 
    ? (parseFloat(wbtcAmount) * btcPrice.btcPrice).toFixed(2)
    : '0.00';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    const amount = parseFloat(wbtcAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await lockCollateral(amount);
      toast.success(result.message);
      setWbtcAmount('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to lock collateral';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setMaxAmount = () => {
    // In real implementation, this would get the actual WBTC balance
    // For now, we'll use a dummy value
    setWbtcAmount('0.5');
    toast.info('Using demo balance of 0.5 WBTC');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LockIcon className="h-5 w-5" />
          Lock Collateral
        </CardTitle>
        <CardDescription>
          Lock your WBTC as collateral to borrow USDT stablecoins
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wbtc-amount">WBTC Amount</Label>
            <div className="flex gap-2">
              <Input
                id="wbtc-amount"
                type="number"
                step="0.0001"
                min="0"
                placeholder="0.0000"
                value={wbtcAmount}
                onChange={(e) => setWbtcAmount(e.target.value)}
                disabled={!isConnected || isLoading || isSubmitting}
              />
              <Button
                type="button"
                variant="outline"
                onClick={setMaxAmount}
                disabled={!isConnected || isLoading || isSubmitting}
              >
                Max
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Available: <span className="font-medium">0.5000 WBTC</span> (demo)
            </p>
          </div>

          {wbtcAmount && parseFloat(wbtcAmount) > 0 && (
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">You lock:</span>
                <span className="font-medium">{parseFloat(wbtcAmount).toFixed(4)} WBTC</span>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Collateral value:</span>
                <span className="font-medium text-green-600">${usdtValue} USDT</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t">
                <span className="text-muted-foreground">Max borrow (70% LTV):</span>
                <span className="font-semibold">${(parseFloat(usdtValue) * 0.7).toFixed(2)} USDT</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!isConnected || isLoading || isSubmitting || !wbtcAmount || parseFloat(wbtcAmount) <= 0}
          >
            {isSubmitting ? 'Locking...' : isConnected ? 'Lock Collateral' : 'Connect Wallet First'}
          </Button>

          {!isConnected && (
            <p className="text-xs text-center text-muted-foreground">
              Please connect your wallet to lock collateral
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
