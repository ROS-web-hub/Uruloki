import type {
  ApiResponse,
  MostBuyOrder,
  MostSellOrder,
  Tokens,
  TopGainerItem,
  TopMoverItem,
} from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function TokenCacheHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Tokens>>
) {
  const { method } = req;
  switch (method) {
    case "GET":
      try{
        let topGainers:TopGainerItem[]= []
        let topMoversData:TopMoverItem[]= []
        let mostBuyData:MostBuyOrder[]= []
        let mostSellData:MostSellOrder[]= []
        try {
            topGainers = await prisma.top_gainers.findMany({
            include: {
              token_cache: {
                select: {
                  name: true,
                  price: true,
                  chain: true,
                  short_name:true,
                  change_24hr: true,
                  pair_address: true,
                },
              },
            },
          });
        } catch (err) {
          console.log(err)
          topGainers=[]
        }
        try{
          const topMovers = await prisma.top_movers.findMany({
            include: {
              token_cache: {
                include: {
                  orders: true,
                },
              },
            },
          });
          topMoversData = topMovers.map((tm: any) => {
            let sell_orders = 0;
            let buy_orders = 0;
            let total_orders = 0;
            tm.token_cache.orders.map((order: any) => {
              if (order.order_type === "sell") {
                sell_orders++;
              }
              if (order.order_type === "buy") {
                buy_orders++;
              }
              total_orders++;
            });
            const topmoverItem = tm as any;
            return Object.assign(
              {},
              delete topmoverItem["token_cache"]["orders"],
              delete topmoverItem["token_cache"]["last_updated"],
              topmoverItem,
              { buy_orders, sell_orders, total_orders, token_cache: tm.token_cache }
            ) as TopMoverItem;
          });
        } catch (err) {
          console.log(err)
        topMoversData=[]
        }
        try{
          const mostBuy = await prisma.most_buy_orders.findMany({
            include: {
              token_cache: {
                include: {
                  orders: true,
                },
              },
            },
          });
          mostBuyData = mostBuy.map((mb: any) => {
            let buy_orders = 0;
            let total_orders = 0;
            mb.token_cache.orders.map((order: any) => {
              if (order.order_type === "buy") {
                buy_orders++;
              }
              total_orders++;
            });

            return Object.assign(
              {},
              {
                id: mb.id,
                rank: mb.rank,
                token_cache: {
                  name: mb.token_cache.name,
                  chain: mb.token_cache.chain,
                  short_name:mb.token_cache.short_name,
                  pair_address: mb.token_cache.pair_address,
                },
                buy_orders,
                total_orders,
              }
            ) as MostBuyOrder;
          });
        } catch (err) {
          console.log(err)
          mostBuyData=[]
        }try{
          const mostSell = await prisma.most_sell_orders.findMany({
            include: {
              token_cache: {
                include: {
                  orders: true,
                },
              },
            },
          });
          mostSellData = mostSell.map((ms: any) => {
            let sell_orders = 0;
            let total_orders = 0;
            ms.token_cache.orders.map((order: any) => {
              if (order.order_type === "sell") {
                sell_orders++;
              }
              total_orders++;
            });
            return Object.assign(
              {},
              {
                id: ms.id,
                rank: ms.rank,
                token_cache: {
                  name: ms.token_cache.name,
                  chain: ms.token_cache.chain,
                  short_name:ms.token_cache.short_name,
                  pair_address: ms.token_cache.pair_address,
                },
                sell_orders,
                total_orders,
              }
            ) as MostSellOrder;
          });
        } catch (err) {
          console.log(err)
          mostSellData=[]
        }
        const data: Tokens = {
          topGainers: topGainers,
          topMovers: topMoversData,
          mostBuyOrders: mostBuyData,
          mostSellOrders: mostSellData,
        };
        res
          .status(200)
          .json({ payload: data, message: `Successfully found Tokens` });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", "GET");
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
