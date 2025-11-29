export interface Order {
  id: string;
  walletAddress: string;
  orderType: "BUY" | "SELL";
  assetId: string;
  assetName: string;
  quantity: number;
  price: number;
  fee: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  signatureData?: string;
  expiryData?: number;
  nonce?: number;
}

export interface OrderPayload {
  assetId: string;
  walletAddress: string;
  quantity: number;
  price: number;
  orderType: "BUY" | "SELL";
  signatureData: string;
  expiryData: number;
  nonce: number;
}

export interface OrderMatch {
  status: string;
  match_data: Order;
}

