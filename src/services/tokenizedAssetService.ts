// Asset Service - Business logic for asset registration and management

import http from "@/lib/http";
import { ApiError } from "@/lib/api";
import {
  TokenizedAsset
} from "@/types";

export const tokenizedAssetService = {
  /**
   * Get All Tokenized Asset
   */
  getAllTokenizedAsset: async (): Promise<TokenizedAsset[]> => {
    try {
      const response = await http.get<TokenizedAsset[]>(
        "/api/v1/market/listings"
      );

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to get all tokenized asset", undefined, error);
    }
  },
};
