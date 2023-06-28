import type { ApiResponse, CacheType } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function searchPairHandler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<CacheType>>
) {
    const { method, query } = req;
    switch (method) {
        case "POST":
            try {
                let timestamp = query.timestamp as number;
                let cached_data = query.cached_data as string;
                let data_key = query.data_key as string;
                let ttl = query.ttl as number;
                const user = await prisma.cache.create({
                    data: {
                        timestamp: timestamp,
                        cached_data: cached_data,
                        data_key: data_key,
                        ttl: ttl
                    }
                })
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
