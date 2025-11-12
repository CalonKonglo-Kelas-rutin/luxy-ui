'use client';

import { useAccount, useBalance, useChainId, useEnsName } from 'wagmi';

export function useWallet() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address: address,
  });
  const { data: ensName } = useEnsName({
    address: address,
  });

  return {
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    chainId,
    balance,
    ensName,
  };
}
