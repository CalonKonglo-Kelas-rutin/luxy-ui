import http from "@/lib/http";
import { ApiError } from "@/lib/api";
import { Order, OrderPayload } from "@/types";

export const orderService = {
  createOrder: async (
    orderData: OrderPayload
  ): Promise<Order> => {
    try {
      console.log("Order Data:", orderData);
      const response = await http.post<Order>(
        `/api/v1/prices`,
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
}