export type ConditionRating = "Excellent" | "Good" | "Fair" | "Poor";

export type VerificationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

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
  image: File | null;
}

// Asset entity from backend
export interface Asset {
  id: string | number;
  ownerId: string;
  brand: string;
  model: string;
  refNumber: string;
  serialNumber: string;
  productionYear: number;
  conditionRating: ConditionRating;
  hasBox: boolean;
  hasPapers: boolean;
  imageUrls: string[] | null;
  documentsUrl?: string | null;
  status: VerificationStatus;
  verificationStatus?: VerificationStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  tokenId?: string | null;
  appraisedValue?: number;
  appraisedValueUsd?: number | null;
  auditorNotes?: string | null;
  ipfsMetadataUri?: string | null;
  txHashMint?: string | null;
}

export interface VerificationTimeline {
  status: VerificationStatus;
  timestamp: string;
  description: string;
  completedBy?: string;
  notes?: string;
}
