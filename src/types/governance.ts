export type ProposalStatus = 'ACTIVE' | 'PASSED' | 'REJECTED' | 'EXECUTED';

export interface Proposal {
  id: string;
  assetId: string;
  assetName: string; // Added for easier display
  assetImage?: string; // Added for easier display
  title: string;
  description: string;
  status: ProposalStatus;
  currentValue: number; // The proposed sale price
  votesFor: number; // Amount of tokens voted FOR
  votesAgainst: number; // Amount of tokens voted AGAINST
  totalEligibleTokens: number; // Total supply of the asset tokens
  deadline: string;
  createdAt: string;
}

export interface Vote {
  proposalId: string;
  voterAddress: string;
  decision: 'FOR' | 'AGAINST';
  tokenAmount: number;
  timestamp: string;
}
