export type TokenizedAssetStatus = "active" | "upcoming" | "sold-out";

export interface TokenizedAsset {
  id: string;
  assetName: string;
  brand: string;
  model: string;
  year: number;
  condition: string;
  totalUnits: number;
  pricePerUnit: number;
  soldUnits: number;
  availableUnits: number;
  soldPercentage: number;
  rentalYieldApy: number;
  totalValue: number;
  investors: number;
  status: TokenizedAssetStatus;
  authenticityVerified: boolean;
  images: string[];
  description?: string;
  documents?: { title: string; url: string }[];
}
