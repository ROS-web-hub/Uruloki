import type { Order, OrdersBook, OrdersBookType } from "@/types";
import { OrderBookData } from "@/types/orderbook.type";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Server-side function to get all orders for the provided pair address
 * @param pair_address 
 * @param status 
 * @returns 
 */
export async function getOrdersByPair(pair_address: string, status?: string): Promise<Array<Order>> {
    console.log("Pair address")
    console.log(pair_address)
    const whereCondition: any = {pair_address};
    if (status) {
        whereCondition["status"] = status;
    }
    const orders = await prisma.orders.findMany({
        where: whereCondition,
    });
    return orders
}