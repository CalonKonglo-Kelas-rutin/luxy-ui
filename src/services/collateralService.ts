// Collateral Service - Business logic for collateral management
// This will be replaced with actual smart contract calls later

import { CollateralData, LoanData, PriceData, UserPosition } from '@/types/collateral';

// Mock BTC price (will be replaced with Chainlink oracle)
let mockBtcPrice = 45000;

// Mock user positions storage
const mockUserPositions = new Map<string, UserPosition>();

// Constants
const MAX_LTV_RATIO = 70; // 70% max LTV

export const collateralService = {
  /**
   * Get current BTC/USDT price
   */
  getBtcPrice: async (): Promise<PriceData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate price fluctuation (+/- 2%)
    const fluctuation = (Math.random() - 0.5) * 0.04;
    mockBtcPrice = mockBtcPrice * (1 + fluctuation);
    
    return {
      btcPrice: mockBtcPrice,
      lastUpdated: new Date(),
    };
  },

  /**
   * Get user's current position
   */
  getUserPosition: async (address: string): Promise<UserPosition> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!mockUserPositions.has(address)) {
      // Initialize empty position
      mockUserPositions.set(address, {
        collateral: {
          wbtcAmount: 0,
          usdtValue: 0,
        },
        loan: null,
        availableToBorrow: 0,
      });
    }
    
    return mockUserPositions.get(address)!;
  },

  /**
   * Lock WBTC as collateral
   */
  lockCollateral: async (
    address: string,
    wbtcAmount: number
  ): Promise<{ success: boolean; message: string; data?: CollateralData }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (wbtcAmount <= 0) {
      return {
        success: false,
        message: 'Amount must be greater than 0',
      };
    }

    // Get current price
    const priceData = await collateralService.getBtcPrice();
    const usdtValue = wbtcAmount * priceData.btcPrice;

    // Get or create user position
    const position = await collateralService.getUserPosition(address);

    // Update collateral
    const newCollateral: CollateralData = {
      wbtcAmount: position.collateral.wbtcAmount + wbtcAmount,
      usdtValue: position.collateral.usdtValue + usdtValue,
      lockedAt: new Date(),
    };

    // Calculate available to borrow (70% of collateral value)
    const totalCollateralValue = newCollateral.usdtValue;
    const currentBorrowed = position.loan?.borrowedAmount || 0;
    const availableToBorrow = (totalCollateralValue * MAX_LTV_RATIO) / 100 - currentBorrowed;

    // Update position
    mockUserPositions.set(address, {
      ...position,
      collateral: newCollateral,
      availableToBorrow: Math.max(0, availableToBorrow),
    });

    return {
      success: true,
      message: `Successfully locked ${wbtcAmount} WBTC as collateral`,
      data: newCollateral,
    };
  },

  /**
   * Borrow USDT against collateral
   */
  borrowUsdt: async (
    address: string,
    usdtAmount: number
  ): Promise<{ success: boolean; message: string; data?: LoanData }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (usdtAmount <= 0) {
      return {
        success: false,
        message: 'Amount must be greater than 0',
      };
    }

    const position = await collateralService.getUserPosition(address);

    // Check if user has collateral
    if (position.collateral.usdtValue === 0) {
      return {
        success: false,
        message: 'No collateral locked. Please lock WBTC first.',
      };
    }

    // Check available to borrow
    if (usdtAmount > position.availableToBorrow) {
      return {
        success: false,
        message: `Insufficient collateral. Maximum you can borrow: ${position.availableToBorrow.toFixed(2)} USDT`,
      };
    }

    // Calculate new loan data
    const currentBorrowed = position.loan?.borrowedAmount || 0;
    const newBorrowedAmount = currentBorrowed + usdtAmount;
    const ltvRatio = (newBorrowedAmount / position.collateral.usdtValue) * 100;
    const healthRatio = (position.collateral.usdtValue / newBorrowedAmount) * 100;

    // Check LTV ratio
    if (ltvRatio > MAX_LTV_RATIO) {
      return {
        success: false,
        message: `LTV ratio (${ltvRatio.toFixed(2)}%) exceeds maximum (${MAX_LTV_RATIO}%)`,
      };
    }

    const newLoan: LoanData = {
      borrowedAmount: newBorrowedAmount,
      collateralAmount: position.collateral.wbtcAmount,
      ltvRatio,
      healthRatio,
      borrowedAt: new Date(),
      status: 'active',
    };

    // Update position
    mockUserPositions.set(address, {
      ...position,
      loan: newLoan,
      availableToBorrow: position.availableToBorrow - usdtAmount,
    });

    return {
      success: true,
      message: `Successfully borrowed ${usdtAmount} USDT`,
      data: newLoan,
    };
  },

  /**
   * Repay loan
   */
  repayLoan: async (
    address: string,
    usdtAmount: number
  ): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const position = await collateralService.getUserPosition(address);

    if (!position.loan || position.loan.borrowedAmount === 0) {
      return {
        success: false,
        message: 'No active loan to repay',
      };
    }

    if (usdtAmount > position.loan.borrowedAmount) {
      return {
        success: false,
        message: `Amount exceeds loan balance (${position.loan.borrowedAmount} USDT)`,
      };
    }

    const newBorrowedAmount = position.loan.borrowedAmount - usdtAmount;

    if (newBorrowedAmount === 0) {
      // Loan fully repaid
      const availableToBorrow = (position.collateral.usdtValue * MAX_LTV_RATIO) / 100;
      
      mockUserPositions.set(address, {
        ...position,
        loan: {
          ...position.loan,
          borrowedAmount: 0,
          ltvRatio: 0,
          healthRatio: 100,
          status: 'paid',
        },
        availableToBorrow,
      });

      return {
        success: true,
        message: 'Loan fully repaid! You can now unlock your collateral.',
      };
    } else {
      // Partial repayment
      const newLtvRatio = (newBorrowedAmount / position.collateral.usdtValue) * 100;
      const newHealthRatio = (position.collateral.usdtValue / newBorrowedAmount) * 100;
      const availableToBorrow = 
        (position.collateral.usdtValue * MAX_LTV_RATIO) / 100 - newBorrowedAmount;

      mockUserPositions.set(address, {
        ...position,
        loan: {
          ...position.loan,
          borrowedAmount: newBorrowedAmount,
          ltvRatio: newLtvRatio,
          healthRatio: newHealthRatio,
        },
        availableToBorrow: Math.max(0, availableToBorrow),
      });

      return {
        success: true,
        message: `Successfully repaid ${usdtAmount} USDT`,
      };
    }
  },

  /**
   * Unlock collateral (only if loan is fully repaid)
   */
  unlockCollateral: async (
    address: string
  ): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const position = await collateralService.getUserPosition(address);

    if (position.loan && position.loan.borrowedAmount > 0) {
      return {
        success: false,
        message: 'Cannot unlock collateral while loan is active. Please repay your loan first.',
      };
    }

    // Reset position
    mockUserPositions.set(address, {
      collateral: {
        wbtcAmount: 0,
        usdtValue: 0,
      },
      loan: null,
      availableToBorrow: 0,
    });

    return {
      success: true,
      message: 'Collateral unlocked successfully!',
    };
  },
};
