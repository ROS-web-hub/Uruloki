import { TokenPairInfo, Tokens } from "@/types";
import { httpRequest } from "./http";
import { FilterSearchItemType } from "@/components/ui/content-header/filters.search";
import { SearchPair } from "@/types";
export default class HomePageTokens {
  static getTokens = async (): Promise<Tokens> => {
    return await httpRequest.get("/tokens");
  };
  static searchTokens = async (
    name: string
    ): Promise<SearchPair[]> => {
    console.log("%c Line:11 🍰 name", "color:#33a5ff", name);
    return await httpRequest.get("/search/addresses", {
      params: {
        name,
      },
    });
  };
  static getTokenPairInfo = async (
    pair_address: string
  ): Promise<TokenPairInfo> => {
    return await httpRequest.get(`/tokens/token-pair`, {
      params: {
        pair_address,
      },
    });
  };
  static getTokenVolume = async (
    baseTokenAddress: string
  ): Promise<{ tradeAmount: number }> => {
    return await httpRequest.get(`/tokens/token-volume`, {
      params: {
        baseTokenAddress,
      },
    });
  };
}
