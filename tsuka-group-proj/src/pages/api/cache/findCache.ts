import type { ApiResponse, CacheType } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function findCacheHandler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<CacheType>>
) {
    const { method, query } = req;
    switch (method) {
        case "GET":
            try {
                let token0 = query.token0 as string;
                console.log("%c Line:17 🥒 token0", "color:#b03734", token0);
                const tokens = await prisma.cache.findMany({
                    where: {}
                });
                res
                    .status(200)
                    .json({ payload: tokens, message: `Successfully found pairs` });
            } catch (err) {
                res.status(400).json({
                    payload: undefined,
                    message: `Something went wrong! Please read the error message '${err}'`,
                });
            }
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
