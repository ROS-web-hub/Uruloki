import { numberWithCommas } from "@/helpers/comma.helper";

export interface OrderBookTokenProps {
  token: {
    id: string;
    token: string;
  };
  sellTrades?: any[];
  buyTrades?: any[];
}

interface TradeRowProps {
  item: any;
}

const TradeRow: React.FC<TradeRowProps> = ({ item }) => {
  return (
    <div
      className={`${
        item.side == "BUY" || item.side == "Buy"
          ? "text-green-400"
          : "text-red-400"
      } border-b border-tsuka-400 text-base relative w-full text-left flex flex-center`}
    >
      <span className=" py-2 w-[120px] ml-4 text-sm font-normal whitespace-nowrap">
        {item.side}
      </span>
      <span className=" py-2 w-[190px] text-sm font-normal whitespace-nowrap">
        {numberWithCommas(Number(item.price).toFixed(4))}
      </span>
      <span className=" py-2 w-[190px] text-sm font-normal whitespace-nowrap">
        {Number(item.tradeAmount).toFixed(4)}
      </span>
      <span className=" py-2  text-sm font-normal whitespace-nowrap">
        {item.transaction.txFrom.address}
      </span>
    </div>
  );
};

export const OrderHistoryBookTokenUi: React.FC<OrderBookTokenProps> = ({
  sellTrades,
  buyTrades,
}) => {
  return (
    <div>
      {/* {status === "loading" && "Loading..."}
      {status === "ok" && value && ( */}
      <div className="p-4 flex">
        <div className="flex-1">
          <div className="h-96 overflow-auto">
            <div className="text-base text-left flex flex-center text-tsuka-300 border-b border-tsuka-400">
              <span className="px-4 py-2 w-[120px]">Type</span>
              <span className="px-4 py-2 w-[190px]">Price (USD)</span>
              <span className="px-4 py-2 w-[190px]">Amount</span>
              <span className="px-4 py-2">Buyer Address</span>
            </div>
            {sellTrades &&
              sellTrades.map((item: any, index: number) => (
                <TradeRow key={index} item={item} />
              ))}
            {buyTrades &&
              buyTrades.map((item: any, index: number) => (
                <TradeRow key={index} item={item} />
              ))}
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};
