import type { ApiResponse, TokenPairInfo } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { G_QUERY_GetTokenVolume } from "./g_queries";

export default async function tokenPriceInPairHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;
  const { baseTokenAddress } = query;

  switch (method) {
    case "GET":
      try {
        const tokenVolume = await G_QUERY_GetTokenVolume(
          baseTokenAddress as string
        );
        if (!tokenVolume.data.data.ethereum.dexTrades[0]) {
          res.status(404).json({
            payload: undefined,
            message: `Token ${baseTokenAddress} not found`,
          });
          return;
        }
        const { tradeAmount } = tokenVolume.data.data.ethereum.dexTrades[0];
        res.status(200).json({
          payload: {
            tradeAmount,
          },
          message: `Successfully found volume for token ${baseTokenAddress}`,
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
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
