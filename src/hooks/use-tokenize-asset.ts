'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, LISK_SEPOLIA_CHAIN_ID } from '@/config/contracts';
import { Asset } from '@/types/asset';
import { toast } from 'sonner';

/**
 * Generate a simple symbol from the asset name
 * e.g., "ROLEX SUBMARINER" -> "RLX"
 */
function generateSymbol(name: string): string {
  // Take first letter of each word, max 5 characters
  const words = name.trim().split(/\s+/);
  const symbol = words
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 5);
  
  return symbol || 'TKN';
}

/**
 * Generate token name from brand and model
 * e.g., "Rolex" + "Submariner" -> "ROLEX SUBMARINER"
 */
function generateTokenName(brand: string, model: string): string {
  return `${brand} ${model}`.toUpperCase().trim();
}

export function useTokenizeAsset() {
  const [tokenId, setTokenId] = useState<string | null>(null);
  
  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  /**
   * Tokenize an asset by calling the smart contract
   */
  const tokenizeAsset = async (asset: Asset) => {
    try {
      // Reset previous state
      resetWrite();
      setTokenId(null);

      // Validate required fields
      if (!asset.brand || !asset.model || !asset.serialNumber || !asset.ownerId) {
        throw new Error('Missing required asset information');
      }

      // Generate token details
      const tokenName = generateTokenName(asset.brand, asset.model);
      const tokenSymbol = generateSymbol(tokenName);
      const totalSupply = BigInt(1000); // Fixed supply of 1000

      console.log('Tokenizing asset:', {
        name: tokenName,
        symbol: tokenSymbol,
        totalSupply: totalSupply.toString(),
        brand: asset.brand,
        model: asset.model,
        serialNumber: asset.serialNumber,
        owner: asset.ownerId,
      });

      // Call smart contract
      writeContract({
        address: CONTRACTS.TOKENIZED_ASSET.address,
        abi: CONTRACTS.TOKENIZED_ASSET.abi,
        functionName: 'createToken',
        args: [
          tokenName,
          tokenSymbol,
          totalSupply,
          asset.brand,
          asset.model,
          asset.serialNumber,
          asset.ownerId as `0x${string}`,
        ],
        chainId: LISK_SEPOLIA_CHAIN_ID,
      });

      // Store generated token ID (you might want to get this from contract event)
      // For now, using asset ID as reference
      setTokenId(asset.id.toString());

      return true;
    } catch (error) {
      console.error('Error tokenizing asset:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to tokenize asset');
      return false;
    }
  };

  return {
    tokenizeAsset,
    txHash: hash,
    tokenId,
    isWritePending,
    isConfirming,
    isConfirmed,
    error: writeError || confirmError,
    reset: () => {
      resetWrite();
      setTokenId(null);
    },
  };
}
