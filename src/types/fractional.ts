// Fractional Watch Ownership Platform Types

export type AssetType = 
  | "luxury-watch"
  | "jewelry"
  | "collectibles"
  | "other";

export type AssetCondition = "excellent" | "good" | "fair" | "poor";

export type VerificationStatus = 
  | "draft"
  | "submitted"
  | "in-transit"
  | "at-partner"
  | "verifying"
  | "appraising"
  | "approved"
  | "rejected"
  | "fractionalized";

export type OfferingStatus =
  | "upcoming"
  | "active"
  | "sold-out"
  | "closed";

export type RedeemStatus =
  | "pending-verification"
  | "ready-for-pickup"
  | "completed"
  | "rejected";

export interface Asset {
  id: string;
  userId: string;
  type: AssetType;
  brand: string;
  model: string;
  name: string;
  description: string;
  estimatedValue: number;
  appraisedValue?: number;
  condition: AssetCondition;
  images: string[];
  serialNumber?: string;
  certificateUrl?: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  tokenId?: string;
}

export interface VerificationTimeline {
  status: VerificationStatus;
  timestamp: string;
  description: string;
  completedBy?: string;
  notes?: string;
}

export interface PartnerVerification {
  partnerId: string;
  partnerName: string;
  verifierName: string;
  verificationDate: string;
  appraisedValue: number;
  condition: AssetCondition;
  notes: string;
  photos: string[];
  certificateUrl?: string;
}

export interface FractionalAsset {
  assetId: string;
  tokenId: string;
  tokenSymbol: string;
  contractAddress: string;
  chainId: number;
  totalUnits: number;
  pricePerUnit: number;
  totalValue: number;
  mintedAt: string;
  listedAt?: string;
}

export interface Offering {
  id: string;
  assetId: string;
  asset: Asset;
  fractionalAsset: FractionalAsset;
  status: OfferingStatus;
  totalUnits: number;
  soldUnits: number;
  pricePerUnit: number;
  minInvestment: number;
  targetRaise: number;
  currentRaise: number;
  rentalYieldApy: number;
  startDate: string;
  endDate: string;
  investors: number;
  featured?: boolean;
}

export interface Ownership {
  id: string;
  userId: string;
  assetId: string;
  tokenId: string;
  unitsOwned: number;
  totalUnits: number;
  ownershipPercentage: number;
  purchasePrice: number;
  currentValue: number;
  unrealizedGain: number;
  unrealizedGainPercentage: number;
  claimableYield: number;
  totalYieldClaimed: number;
  purchasedAt: string;
}

export interface YieldDistribution {
  id: string;
  assetId: string;
  period: string;
  totalYield: number;
  yieldPerUnit: number;
  distributedAt: string;
  status: "pending" | "distributed" | "claimed";
}

export interface RedeemRequest {
  id: string;
  userId: string;
  assetId: string;
  tokenId: string;
  requestedAt: string;
  status: RedeemStatus;
  verificationNotes?: string;
  pickupDate?: string;
  pickupLocation?: string;
  completedAt?: string;
}

export interface SecondaryListing {
  id: string;
  sellerId: string;
  assetId: string;
  tokenId: string;
  unitsForSale: number;
  pricePerUnit: number;
  totalPrice: number;
  listedAt: string;
  expiresAt?: string;
  status: "active" | "sold" | "cancelled" | "expired";
}

export interface Transaction {
  id: string;
  type: "primary-purchase" | "secondary-purchase" | "yield-claim" | "redeem";
  assetId: string;
  units?: number;
  amount: number;
  currency: string;
  timestamp: string;
  txHash?: string;
  status: "pending" | "confirmed" | "failed";
  fromAddress?: string;
  toAddress?: string;
}

export interface AssetFormData {
  type: AssetType;
  brand: string;
  model: string;
  name: string;
  description: string;
  estimatedValue: number;
  condition: AssetCondition;
  serialNumber?: string;
  images: File[];
  certificateFile?: File;
  totalUnits: number;
  pricePerUnit: number;
  rentalYieldApy: number;
}
