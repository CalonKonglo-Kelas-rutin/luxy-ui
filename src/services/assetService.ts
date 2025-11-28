// Asset Service - Business logic for asset registration and management

import api, { ApiError } from "@/lib/api";
import {
  AssetRegistrationRequest,
  Asset,
} from "@/types/asset";
import { AxiosError } from "axios";

export const assetService = {
  /**
   * Register a new asset (watch) for tokenization
   */
  registerAsset: async (
    assetData: AssetRegistrationRequest
  ): Promise<Asset> => {
    try {
      const response = await api.post<Asset>(
        "/api/v1/rwa/request",
        assetData
      );

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to register asset", undefined, error);
    }
  },

  /**
   * Get asset by ID
   */
  getAssetById: async (assetId: string): Promise<Asset> => {
    try {
      const response = await api.get(`/api/v1/rwa/${assetId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Failed to fetch asset";
      throw new Error(message);
    }
  },

  /**
   * Get user's assets
   */
  getUserRequestedAssets: async (ownerId: string): Promise<Asset[]> => {
    try {
      const response = await api.get(`/api/v1/rwa/requests`, { params: { userId: ownerId } });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Failed to fetch assets";
      throw new Error(message);
    }
  },
};
