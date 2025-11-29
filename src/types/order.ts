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
  signature?: string;
  expiry?: number;
  nonce?: number;
}

export interface OrderPayload {
  assetId: string;
  walletAddress: string;
  quantity: number;
  price: number;
  orderType: "BUY" | "SELL";
  signature: string;
  expiry: number;
  nonce: number;
}

