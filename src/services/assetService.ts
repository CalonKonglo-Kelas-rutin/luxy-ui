// Asset Service - Business logic for asset registration and management

import http from "@/lib/http";
import { ApiError } from "@/lib/api";
import {
  AssetRegistrationRequest,
  Asset,
} from "@/types/asset";

export const assetService = {
  /**
   * Register a new asset (watch) for tokenization
   */
  registerAsset: async (
    assetData: AssetRegistrationRequest
  ): Promise<Asset> => {
    try {
      const response = await http.post<Asset>(
        "/api/v1/rwa/request",
        assetData,
        { formData: true }
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
      const response = await http.get(`/api/v1/rwa/assets/${assetId}`);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to get asset", undefined, error);
    }
  },

  /**
   * Get user's assets
   */
  getUserRequestedAssets: async (ownerId: string): Promise<Asset[]> => {
    try {
      const response = await http.get(`/api/v1/rwa/requests`, { params: { userId: ownerId } });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch assets", undefined, error);
    }
  },

  getAllRequestedAssets: async (): Promise<Asset[]> => {
    try {
      const response = await http.get(`/api/v1/rwa/admin/audit-list`);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to fetch assets", undefined, error);
    }
  },

  approveAsset: async (assetId: string): Promise<Asset> => {
    try {
      const response = await http.post(`/api/v1/rwa/assets/${assetId}/approve`);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to approve asset", undefined, error);
    }
  },

  rejectAsset: async (assetId: string, reason?: string): Promise<Asset> => {
    try {
      const response = await http.post(`/api/v1/rwa/assets/${assetId}/reject`, { reason });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to reject asset", undefined, error);
    }
  },
};
