import http from "@/lib/http";
import { ApiError } from "@/lib/api";
import { Order, OrderPayload, OrderMatch, UserOrderHistory } from "@/types";

export const orderService = {
  createOrder: async (
    orderData: OrderPayload
  ): Promise<Order> => {
    try {
      const response = await http.post<Order>(
        `/api/v1/market/order/create`,
        orderData
      );

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to create order", undefined, error);
    }
  },

  getMatchOrder: async  (orderData: OrderPayload): Promise<OrderMatch> => {
    try {
      const response = await http.post<OrderMatch>(
        `/api/v1/market/orders/match`,
        orderData
      );

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to get match order", undefined, error);
    }
  },

  getOrdersByUser: async (walletAddress: string, assetId: string): Promise<UserOrderHistory> => {
    try {
      const response = await http.get<UserOrderHistory>(
        `/api/v1/market/orders/user`, {
          params: {
            walletAddress,
            assetId
          }
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to get orders by user", undefined, error);
    }
  },
}