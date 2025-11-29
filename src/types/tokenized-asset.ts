export type TokenizedAssetStatus = "active" | "upcoming" | "sold-out";

export interface TokenizedAsset {
  id: string;
  tokenId: string;
  brand: string;
  model: string;
  imageUrls: string;
  price: number;
  status: string;
}
