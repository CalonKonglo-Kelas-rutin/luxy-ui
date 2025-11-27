export type ConditionRating = "Excellent" | "Good" | "Fair" | "Poor";

export type VerificationStatus = 
  | "draft"
  | "submitted"
  | "in-transit"
  | "at-pawnshop"
  | "verifying"
  | "appraising"
  | "approved"
  | "rejected"
  | "tokenized";

// Asset Registration API Request
export interface AssetRegistrationRequest {
  ownerId: string;
  brand: string;
  model: string;
  refNumber: string;
  serialNumber: string;
  productionYear: number;
  conditionRating: ConditionRating;
  hasBox: boolean;
  hasPapers: boolean;
  imageUrls: string[];
}

// Asset Registration API Response
export interface AssetRegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    assetId: string;
    status: string;
    createdAt: string;
  };
}

// Asset entity from backend
export interface Asset {
  id: string;
  ownerId: string;
  brand: string;
  model: string;
  refNumber: string;
  serialNumber: string;
  productionYear: number;
  conditionRating: ConditionRating;
  hasBox: boolean;
  hasPapers: boolean;
  imageUrls: string[];
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  tokenId?: string;
  appraisedValue?: number;
}

export interface VerificationTimeline {
  status: VerificationStatus;
  timestamp: string;
  description: string;
  completedBy?: string;
  notes?: string;
}

export interface PawnshopVerification {
  pawnshopId: string;
  pawnshopName: string;
  verifierName: string;
  verificationDate: string;
  appraisedValue: number;
  conditionRating: ConditionRating;
  notes: string;
  photos: string[];
  certificateUrl?: string;
}

export interface TokenizedAsset {
  assetId: string;
  tokenId: string;
  tokenSymbol: string;
  contractAddress: string;
  chainId: number;
  mintedAt: string;
  totalSupply: number;
  liquidityPoolAddress?: string;
}
