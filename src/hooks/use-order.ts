'use client';

import { useState, useCallback } from 'react';
import { useSignTypedData, useAccount, useChainId } from 'wagmi';
import { orderService } from '@/services/orderService';
import { OrderPayload, Order } from '@/types/order';
import { toast } from 'sonner';

// EIP-712 Domain
const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xfd1650Df1c4e3ab4C01aA0F22548531B4bE33687') as `0x${string}`;

const domain = {
  name: 'ChainCredit Launchpad',
  version: '1',
  verifyingContract: contractAddress,
} as const;

// EIP-712 Types
const types = {
  Order: [
    { name: 'assetId', type: 'string' },
    { name: 'walletAddress', type: 'address' },
    { name: 'quantity', type: 'uint256' },
    { name: 'price', type: 'uint256' },
    { name: 'orderType', type: 'string' },
    { name: 'expiry', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
  ],
} as const;

export function useOrder() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { signTypedDataAsync } = useSignTypedData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createOrder = useCallback(async (
    assetId: string,
    quantity: number,
    price: number,
    orderType: "BUY" | "SELL"
  ): Promise<Order> => {
    if (!address) {
      toast.error('Please connect your wallet first');
      throw new Error('Wallet not connected');
    }

    setIsSubmitting(true);

    try {
      const expiry = Math.floor(Date.now() / 1000) + 3600; // 1 hour expiry
      const nonce = Math.floor(Math.random() * 1000000); // Random nonce for now

      // 1. Sign the order
      const signature = await signTypedDataAsync({
        domain: {
          ...domain,
          chainId,
        },
        types,
        primaryType: 'Order',
        message: {
          assetId,
          walletAddress: address,
          quantity: BigInt(quantity), // Wagmi expects BigInt for uint256
          price: BigInt(price * 100), // Assuming 2 decimals for price, adjust as needed
          orderType,
          expiry: BigInt(expiry),
          nonce: BigInt(nonce),
        },
      });

      // 2. Prepare payload
      const payload: OrderPayload = {
        assetId,
        walletAddress: address,
        quantity,
        price,
        orderType,
        signature,
        expiry,
        nonce,
      };

      // 3. Submit to backend
      const result = await orderService.createOrder(payload);

      toast.success('Order placed successfully!');
      return result;
    } catch (err) {
      console.error('Order creation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to place order';
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [address, chainId, signTypedDataAsync]);

  return {
    createOrder,
    isSubmitting,
  };
}
