// Smart Contract Configuration for Lisk Sepolia
export const CONTRACTS = {
  TOKENIZED_ASSET: {
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: [
      {
        inputs: [
          { internalType: 'string', name: '_name', type: 'string' },
          { internalType: 'string', name: '_symbol', type: 'string' },
          { internalType: 'uint256', name: '_totalSupply', type: 'uint256' },
          { internalType: 'string', name: '_brand', type: 'string' },
          { internalType: 'string', name: '_model', type: 'string' },
          { internalType: 'string', name: '_serialNumber', type: 'string' },
          { internalType: 'address', name: '_originalOwner', type: 'address' },
        ],
        name: 'createToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ] as const,
  },
} as const;

export const LISK_SEPOLIA_CHAIN_ID = 4202;
export const LISK_SEPOLIA_EXPLORER = 'https://sepolia-blockscout.lisk.com';
