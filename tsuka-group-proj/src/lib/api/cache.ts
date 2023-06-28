import { LoggedInUser, LoginUserData } from "@/types";
import { CacheType } from "@/types";
import { httpRequest } from "./http";

export default class Cache {
    static saveCache = async (data: CacheType): Promise<CacheType> => {
        return await httpRequest.post("/cache/createCache", data);
    };
    static deleteCache = async () => {
        return await httpRequest.post("/cache/deleteCache");
    };
    static findCache = async (): Promise<CacheType[]> => {
        return await httpRequest.post("/cache/findCache");
    };

}
