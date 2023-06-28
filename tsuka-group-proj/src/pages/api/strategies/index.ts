import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { getStrategy } from "./[strategyid]";
import { ApiResponse, Strategy, StrategyStatusEnum } from "@/types";
import {
  OrderStatusEnum,
  RangeOrder,
  SingleOrder,
} from "@/types/token-order.type";

const reqBodySchema = Joi.object({
  name: Joi.string().required(),
  user_id: Joi.number().required(),
})
  .max(3)
  .min(2);

const prisma = new PrismaClient();

export default async function strategyHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Strategy>>
) {
  const { method, body } = req;
  switch (method) {
    case "POST":
      try {
        const { value, error } = reqBodySchema.validate(body);
        if (error) {
          res.status(404).json({
            payload: undefined,
            message: `Validation Error: ${error.message}`,
          });
          break;
        }
        const strategy = await prisma.strategies.create({
          data: value,
        });
        const { orders, orderTokens } = await getStrategy(
          strategy.strategy_id.toString()
        );
        console.log(strategy);
        res.status(200).json({
          payload: {
            id: strategy.strategy_id.toString(),
            title: strategy.name as string,
            status: strategy.status as StrategyStatusEnum,
            createdAt: Math.round(
              (strategy.createdAt?.getTime() ?? 0) / 1000
            ).toString() as string,
            orderTokens: orderTokens.map((orderToken) => ({
              network: "Ethereum",
              name1: orderToken.baseTokenLongName as string,
              code1: orderToken.baseTokenShortName as string,
              name2: orderToken.pairTokenLongName as string,
              code2: orderToken.pairTokenShortName as string,
              status: orderToken.status as OrderStatusEnum,
              orders: orders[orderToken.order_id] as Array<
                SingleOrder | RangeOrder
              >,
            })),
          },
          message: `Successfully created setup`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    case "GET":
      try {
        const strategies = await prisma.strategies.findMany({
          include: {
            order_strategy: {
              select: {
                order: true,
              },
            },
          },
        });
        let orders: any = {};
        for (const strategy of strategies) {
          const { order_strategy, strategy_id, ...rest } = strategy;
          for (const { order } of order_strategy) {
            if (!orders[strategy_id]) orders[strategy_id] = {};
            if (orders[strategy_id][order.pair_address]) {
              orders[strategy_id][order.pair_address].push(order);
            } else {
              orders[strategy_id][order.pair_address] = [order];
            }
          }
        }
        const payload = strategies.map((strategy) => ({
          id: strategy.strategy_id.toString(),
          title: strategy.name as string,
          status: strategy.status as StrategyStatusEnum,
          createdAt: Math.round(
            (strategy.createdAt?.getTime() ?? 0) / 1000
          ).toString() as string,
          orderTokens: orders[strategy.strategy_id]
            ? Object.keys(orders[strategy.strategy_id]).map((pair_address) => ({
                network: "Ethereum",
                name1: orders[strategy.strategy_id][pair_address][0]
                  .baseTokenLongName as string,
                code1: orders[strategy.strategy_id][pair_address][0]
                  .baseTokenShortName as string,
                name2: orders[strategy.strategy_id][pair_address][0]
                  .pairTokenLongName as string,
                code2: orders[strategy.strategy_id][pair_address][0]
                  .pairTokenShortName as string,
                status: orders[strategy.strategy_id][pair_address][0]
                  .status as OrderStatusEnum,
                orders: orders[strategy.strategy_id][pair_address].map(
                  (order: any) => ({
                    id: order.order_id,
                    budget: order.budget,
                    price_type: order.price_type,
                    order_type: order.order_type,
                    status: order.status,
                    baseTokenShortName: order.baseTokenShortName,
                    baseTokenLongName: order.baseTokenLongName,
                    pairTokenShortName: order.pairTokenShortName,
                    pairTokenLongName: order.pairTokenLongName,
                    price: order.single_price,
                    prices: [order.from_price, order.to_price],
                  })
                ),
              }))
            : [],
        }));
        res.status(200).json({
          payload,
          message: `Successfully found setups`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
