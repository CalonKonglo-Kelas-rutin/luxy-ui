import http from "@/lib/http";
import { ApiError } from "@/lib/api";
import { Pricing } from "@/types";

export const pricingService = {
  getProductPricingChart: async (
    productId: string
  ): Promise<Pricing[]> => {
    try {
      const response = await http.get<Pricing[]>(
        `/api/v1/prices/history`,
        { params: { productId } }
      );

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to get product chart", undefined, error);
    }
  },

  getProductPricing: async (
    productId: string
  ): Promise<Pricing> => {
    try {
      const response = await http.get<Pricing>(
        `/api/v1/prices/latest/${productId}`
      );

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to get product pricing", undefined, error);
    }
  },
}
