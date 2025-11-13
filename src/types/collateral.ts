// Collateral and Loan Types for CalonKonglo DeFi Platform

export interface CollateralData {
  wbtcAmount: number;
  usdtValue: number;
  lockedAt?: Date;
}

export interface LoanData {
  borrowedAmount: number;
  collateralAmount: number;
  ltvRatio: number;
  healthRatio: number;
  borrowedAt?: Date;
  status: 'active' | 'paid' | 'liquidated';
}

export interface PriceData {
  btcPrice: number;
  lastUpdated: Date;
}

export interface UserPosition {
  collateral: CollateralData;
  loan: LoanData | null;
  availableToBorrow: number;
}
