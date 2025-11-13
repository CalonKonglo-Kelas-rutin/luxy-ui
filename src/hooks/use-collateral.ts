'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './use-wallet';
import { collateralService } from '@/services/collateralService';
import { UserPosition, PriceData } from '@/types/collateral';

export function useCollateral() {
  const { address, isConnected } = useWallet();
  
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [btcPrice, setBtcPrice] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch BTC price
  const fetchBtcPrice = useCallback(async () => {
    try {
      const priceData = await collateralService.getBtcPrice();
      setBtcPrice(priceData);
    } catch (err) {
      console.error('Error fetching BTC price:', err);
    }
  }, []);

  // Fetch user position
  const fetchPosition = useCallback(async () => {
    if (!address) return;

    try {
      setIsLoading(true);
      setError(null);
      const userPosition = await collateralService.getUserPosition(address);
      setPosition(userPosition);
    } catch (err) {
      setError('Failed to fetch position data');
      console.error('Error fetching position:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Lock collateral
  const lockCollateral = useCallback(async (wbtcAmount: number) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await collateralService.lockCollateral(address, wbtcAmount);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      // Refresh position
      await fetchPosition();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to lock collateral';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, fetchPosition]);

  // Borrow USDT
  const borrowUsdt = useCallback(async (usdtAmount: number) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await collateralService.borrowUsdt(address, usdtAmount);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      // Refresh position
      await fetchPosition();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to borrow USDT';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, fetchPosition]);

  // Repay loan
  const repayLoan = useCallback(async (usdtAmount: number) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await collateralService.repayLoan(address, usdtAmount);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      // Refresh position
      await fetchPosition();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to repay loan';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, fetchPosition]);

  // Unlock collateral
  const unlockCollateral = useCallback(async () => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await collateralService.unlockCollateral(address);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      // Refresh position
      await fetchPosition();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unlock collateral';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, fetchPosition]);

  // Auto-fetch on mount and when address changes
  useEffect(() => {
    if (isConnected && address) {
      fetchPosition();
      fetchBtcPrice();

      // Update price every 10 seconds
      const priceInterval = setInterval(fetchBtcPrice, 10000);
      
      return () => clearInterval(priceInterval);
    }
  }, [isConnected, address, fetchPosition, fetchBtcPrice]);

  return {
    position,
    btcPrice,
    isLoading,
    error,
    lockCollateral,
    borrowUsdt,
    repayLoan,
    unlockCollateral,
    refreshPosition: fetchPosition,
    refreshPrice: fetchBtcPrice,
  };
}
