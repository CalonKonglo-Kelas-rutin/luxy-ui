import { Proposal, Vote } from "@/types/governance";

// Mock Data
const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "prop-1",
    assetId: "1",
    assetName: "Rolex Daytona Panda",
    assetImage: "/images/rolex-daytona.jpg", // Placeholder
    title: "Sell Asset: Rolex Daytona Panda",
    description: "We have received a private offer of $45,000 for this asset. This represents a 12.5% appreciation from the initial listing price. As the asset manager, we recommend accepting this offer to realize profits for all token holders.",
    status: "ACTIVE",
    currentValue: 45000,
    votesFor: 450,
    votesAgainst: 100,
    totalEligibleTokens: 1000,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "prop-2",
    assetId: "2",
    assetName: "Patek Philippe Nautilus",
    assetImage: "/images/patek-nautilus.jpg", // Placeholder
    title: "Sell Asset: Patek Philippe Nautilus",
    description: "Market conditions for Patek Philippe are currently at an all-time high. We propose listing this asset for sale at $120,000.",
    status: "PASSED",
    currentValue: 120000,
    votesFor: 800,
    votesAgainst: 50,
    totalEligibleTokens: 1000,
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Ended yesterday
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const governanceService = {
  getProposals: async (): Promise<Proposal[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...MOCK_PROPOSALS];
  },

  getProposalById: async (id: string): Promise<Proposal | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PROPOSALS.find(p => p.id === id);
  },

  vote: async (proposalId: string, decision: 'FOR' | 'AGAINST', tokenAmount: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Voted ${decision} on proposal ${proposalId} with ${tokenAmount} tokens`);

    // In a real app, we would update the backend. 
    // Here we just log it and potentially update the local mock if we wanted to be fancy, 
    // but for a simple mock service, logging is sufficient to demonstrate the UI flow.
    const proposal = MOCK_PROPOSALS.find(p => p.id === proposalId);
    if (proposal) {
      if (decision === 'FOR') {
        proposal.votesFor += tokenAmount;
      } else {
        proposal.votesAgainst += tokenAmount;
      }

      // Check for 51% threshold
      const totalVotes = proposal.votesFor + proposal.votesAgainst; // Or totalEligibleTokens
      if (proposal.votesFor > (proposal.totalEligibleTokens * 0.51)) {
        proposal.status = 'PASSED';
      }
    }
  },

  initiateProposal: async (assetId: string, salePrice: number, title: string, description: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      assetId,
      assetName: "New Asset Proposal", // In real app, fetch asset name
      title,
      description,
      status: 'ACTIVE',
      currentValue: salePrice,
      votesFor: 0,
      votesAgainst: 0,
      totalEligibleTokens: 1000, // Mock
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    MOCK_PROPOSALS.unshift(newProposal);
  }
};
