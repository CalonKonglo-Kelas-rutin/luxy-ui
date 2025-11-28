'use client';

import { useState, useCallback } from 'react';
import { useWallet } from './use-wallet';
import { assetService } from '@/services/assetService';
import { Asset, AssetRegistrationRequest } from '@/types';
import { toast } from 'sonner';

export function useAssetRegistration() {
  const { address } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Register asset with backend API
   * Images will be handled by the API in the future
   */
  const registerAsset = useCallback(async (
    assetData: Omit<AssetRegistrationRequest, 'ownerId' | 'imageUrls'>
  ): Promise<Asset> => {
    if (!address) {
      toast.error('Please connect your wallet first');
      throw new Error('Wallet not connected');
    }

    setIsSubmitting(true);

    try {
      const registrationData: AssetRegistrationRequest = {
        ...assetData,
        ownerId: address,
        imageUrls: [], // TODO: Handle image upload
      };

      const result = await assetService.registerAsset(registrationData);

      if (!result) {
        throw new Error('Registration failed - no data returned');
      }

      toast.success('Asset registered successfully!');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register asset';
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [address]);

  /**
   * Get user's requested assets from backend
   */
  const getUserAssets = useCallback(async (): Promise<Asset[]> => {
    if (!address) {
      return [];
    }

    setIsLoading(true);

    try {
      const assets = await assetService.getUserRequestedAssets(address);
      return assets;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assets';
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  return {
    isSubmitting,
    isLoading,
    registerAsset,
    getUserAssets,
  };
}
