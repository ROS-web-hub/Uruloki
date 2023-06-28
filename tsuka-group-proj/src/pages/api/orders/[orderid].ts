import type { ApiResponse, Order } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { OrderStatusEnum } from "@/types/token-order.type";

const reqBodySchema = Joi.object({
  pair_address: Joi.string().optional(),
  status: Joi.string().optional(),
  single_price: Joi.number().optional(),
  from_price: Joi.number().optional(),
  to_price: Joi.number().optional(),
  budget: Joi.number().optional(),
  order_type: Joi.string().valid("buy", "sell").optional(),
  price_type: Joi.string().valid("range", "single").optional(),
  is_continuous: Joi.boolean().valid(false, true).optional(),
})
  .max(9)
  .min(1);

const prisma = new PrismaClient();

export default async function orderHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Order>>
) {
  const { query, method, body } = req;
  const { orderid } = query;

  switch (method) {
    case "GET":
      try {
        const orderExist = await prisma.orders.findFirst({
          where: {
            order_id: Number(orderid),
          },
        });
        if (!orderExist) {
          res.status(404).json({
            payload: undefined,
            message: `Order id ${orderid} not found!`,
          });
          break;
        }
        res.status(200).json({
          payload: orderExist,
          message: `Successfully found order id ${orderid}`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    case "PATCH":
      console.log(
        "Receved PATCH Request for update orderid:::  ",
        orderid,
        req.body
      );
      try {
        const { value, error } = reqBodySchema.validate(body);
        if (error) {
          res
            .status(404)
            .json({
              payload: undefined,
              message: `Validation Error: ${error.message}`,
            });
          break;
        }
        const orderExist = await prisma.orders.findFirst({
          where: {
            order_id: Number(orderid),
          },
        });
        if (!orderExist) {
          res
            .status(404)
            .json({
              payload: undefined,
              message: `Order id ${orderid} not found!`,
            });
          break;
        }
        const order = await prisma.orders.update({
          where: {
            order_id: Number(orderid),
          },
          data: value,
        });
        res
          .status(200)
          .json({
            payload: order,
            message: `Successfully updated order id ${orderid}`,
          });
      } catch (err) {
        res
          .status(400)
          .json({
            payload: undefined,
            message: `Something went wrong! Please read the error message '${err}'`,
          });
      }
      break;
    case "DELETE":
      try {
        const orderExist = await prisma.orders.findFirst({
          where: {
            order_id: Number(orderid),
          },
        });
        if (!orderExist) {
          res.status(404).json({
            payload: undefined,
            message: `Order id ${orderid} not found!`,
          });
          break;
        }
        const orders = await prisma.orders.update({
          where: {
            order_id: Number(orderid),
          },
          data: {
            status: OrderStatusEnum.CANCELLED,
          },
        });
        res.status(200).json({
          payload: orders,
          message: `Successfully deleted order id ${orderid}`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "DELETE", "PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
