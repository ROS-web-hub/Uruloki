import { Order, PatchOrder, PostOrder } from "@/types";
import { UserOrder } from "@/types/token-order.type";
import { httpRequest } from "./http";
import { TokenPairPrice } from "@/store/apps/user-order";

export default class Orders {
  static getOrders = async (): Promise<Order> => {
    return await httpRequest.get("/orders");
  };

  static getOrderBooks = async (pair_address: string): Promise<any> => {
    return await httpRequest.get(`/orders/book/${pair_address}`);
  };

  static getOrderById = async (order_id: number): Promise<Order> => {
    return await httpRequest.get(`orders/${order_id}`);
  };
  static getOrdersbyUserId = async (userId: string): Promise<UserOrder[]> => {
    return await httpRequest.get(`/orders/user/${userId}`);
  };

  static getOrdersbyUserIdandFilters = async (
    userId: number,
    status: string,
    search: string
  ): Promise<UserOrder[]> => {
    return await httpRequest.get(
      `orders/user/${userId}?status=${status}&search=${search}`
    );
  };

  static getActiveOrdersbyTokenPair = async (
    tokenpair: string
  ): Promise<Array<Order>> => {
    return await httpRequest.get(
      `/orders/tokenpair/${tokenpair}?status=active`
    );
  };

  static createOrder = async (data: PostOrder): Promise<Order> => {
    return await httpRequest.post("/orders", data);
  };
  static editOrder = async (
    orderId: number,
    data: PatchOrder
  ): Promise<Order> => {
    console.log("posting edit data :::");
    return await httpRequest.patch(`/orders/${orderId}`, data);
  };

  static deleteOrder = async (orderId: number): Promise<Order> => {
    return await httpRequest.delete(`/orders/${orderId}`);
  };

  static getTokenPairPrice = async (
    pair_address: string
  ): Promise<TokenPairPrice> => {
    return await httpRequest.post("/tokens/token-price", {
      pair_address,
    });
  };

  static getYesterdayTokenPairPrice = async (
    pair_address: string
  ): Promise<TokenPairPrice> => {
    console.log("getTokenPairPrice", pair_address);
    return await httpRequest.post("/tokens/token-price", {
      pair_address,
      yesterday: true,
    });
  };
}
