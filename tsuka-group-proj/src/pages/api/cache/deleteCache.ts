import type { ApiResponse, CacheType } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function cacheDeleteHandler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<CacheType>>
) {
    const { method, query } = req;
    const { id } = query;
    switch (method) {
        case "POST": 
            try {
                await prisma.cache.deleteMany({
                    where: {
                    }
                });
                res
                    .status(200)
                    .json({
                        payload: undefined,
                        message: `Successfully deleted`,
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
        default:
            res.setHeader("Allow", ["DELETE", "GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
