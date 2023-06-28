import { Strategy } from "@/types";
import { httpRequest } from "./http";

export default class Strategies {
  static getStrategiesData = async (): Promise<Array<Strategy>> => {
    return await httpRequest.get("/strategies");
  };
  static getStrategyData = async (id: string): Promise<Strategy> => {
    return await httpRequest.get(`/strategies/${id}`);
  };
}
