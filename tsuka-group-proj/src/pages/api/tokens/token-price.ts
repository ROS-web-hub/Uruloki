import type { ApiResponse, TokenPriceInPair } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import axios from "axios";
import { G_QUERY_GetQuotePrice, G_QUERY_GetTokenPair } from "./g_queries";

const reqBodySchema = Joi.object({
  pair_address: Joi.string().required(),
  yesterday: Joi.boolean().optional(),
})
  .min(1)
  .max(2);

const prisma = new PrismaClient();

export default async function tokenPriceInPairHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TokenPriceInPair>>
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
        const { pair_address, yesterday } = value;
        const timeBefore = (
          yesterday
            ? new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
            : new Date()
        ).toISOString();
        const tokenPairResponse = await G_QUERY_GetTokenPair(pair_address);
        if (!tokenPairResponse.data.data.ethereum.dexTrades[0]) {
          res.status(404).json({
            payload: undefined,
            message: `Pair address ${pair_address} not found`,
          });
          return;
        }
        const {
          token0: { address: token0Address },
          token1: { address: token1Address },
        } = tokenPairResponse.data.data.ethereum.dexTrades[0];
        let tokenAddress, pairedTokenAddress;
        if (
          [
            process.env.WETH_ADDR,
            process.env.DAI_ADDR,
            process.env.USDT_ADDR,
            process.env.USDC_ADDR,
          ].includes(String(token0Address).toLowerCase())
        ) {
          tokenAddress = token1Address;
          pairedTokenAddress = token0Address;
        } else {
          tokenAddress = token0Address;
          pairedTokenAddress = token1Address;
        }

        const quotePriceResponse = await G_QUERY_GetQuotePrice(
          tokenAddress,
          pairedTokenAddress,
          timeBefore
        );
        if (!quotePriceResponse.data.data.ethereum.dexTrades[0]) {
          res.status(400).json({
            payload: undefined,
            message: `Transaction for ${pair_address} not found yesterday`,
          });
          return;
        }
        const { quotePrice: basePrice } =
          quotePriceResponse.data.data.ethereum.dexTrades[0];
        if (
          String(pairedTokenAddress).toLowerCase() === process.env.WETH_ADDR ||
          String(pairedTokenAddress).toLowerCase() === process.env.DAI_ADDR
        ) {
          const baseQuotePrice = basePrice;
          const baseCurrency = pairedTokenAddress;
          const quoteCurrency =
            pairedTokenAddress === process.env.WETH_ADDR
              ? process.env.USDC_ADDR
              : process.env.USDT_ADDR;
          const baseQuotePriceResponse = await G_QUERY_GetQuotePrice(
            baseCurrency,
            quoteCurrency as string,
            timeBefore
          );
          if (!baseQuotePriceResponse.data.data.ethereum.dexTrades[0]) {
            res.status(400).json({
              payload: undefined,
              message: `Transaction for ${pair_address} not found yesterday`,
            });
            return;
          }
          const { quotePrice: quoteQuotePrice } =
            baseQuotePriceResponse.data.data.ethereum.dexTrades[0];
          res.status(200).json({
            payload: {
              base_price: baseQuotePrice * quoteQuotePrice,
              quote_price: quoteQuotePrice,
            },
            message: `Successfully found price quote for pair address ${pair_address}`,
          });
          return;
        }
        res.status(200).json({
          payload: { base_price: basePrice, quote_price: 1 },
          message: `Successfully found price quote for pair address ${pair_address}`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${JSON.stringify(
            err
          )}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
