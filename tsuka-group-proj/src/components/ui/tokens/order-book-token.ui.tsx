import { OrderBookTokens } from "@/components/tokens/order-book.token";
import { numberWithCommas } from "@/helpers/comma.helper";
import { ModifiedOrder, TokenPairOrders } from "@/lib/setups";
import { useAppSelector } from "@/store/hooks";
import { OrderBookData } from "@/types/orderbook.type";
import { useEffect, useState } from "react";

interface OrderBookTokenUiProp {
  orders: TokenPairOrders[];
  tokens: OrderBookTokens[];
}

export const OrderBookTokenUi: React.FC<OrderBookTokenUiProp> = ({
  orders,
  tokens,
}) => {
  const { status } = useAppSelector((state) => state.tokenOrderBooks);
  const [sellSum, setSellSum] = useState(0);
  const [buySum, setBuySum] = useState(0);
  const [orderBookData, setOrderBookData] = useState<OrderBookData>(
    new OrderBookData()
  );
  const [selectedToken, setSelectedToken] = useState<OrderBookTokens>(
    tokens[0]
  );

  const handleSelect = (token: OrderBookTokens) => {
    setSelectedToken(token);
  };

  useEffect(() => {
    if (selectedToken) {
      let tempOrderBookData = orderBookData.fromOrders(
        orders.find(({ pair_address }) => pair_address === selectedToken.value)
          ?.orders ?? []
      );
      setOrderBookData(tempOrderBookData);

      setSellSum(tempOrderBookData.getSellSum());
      setBuySum(tempOrderBookData.getBuySum());
      console.log(orders);
      console.log(tempOrderBookData);
    }
  }, [orders, selectedToken]);

  let sum: number;

  return (
    <div>
      {status === "loading" && "Loading..."}
      {status === "ok" && orderBookData && orders[0] ? (
        <div className="p-4 flex gap-2">
          <div className="flex-1">
            <div className="h-96">
              <div className="w-full text-base text-left flex flex-center text-tsuka-300 border-b border-tsuka-400">
                <span className="flex-1 px-4 py-2">Price (USD)</span>
                <span className="flex-1 px-4 py-2 text-end">
                  Size ({orders[0]?.baseTokenShortName})
                </span>
                <span className="flex-1 px-4 py-2 text-end">SUM (USD)</span>
              </div>
              {[...(orderBookData.sell ?? [])]
                .sort((a, b) => b.price - a.price)
                .map((item, index) => {
                  if (!index) {
                    sum = item.size;
                  } else {
                    sum += item.size;
                  }
                  return (
                    <div
                      key={index}
                      className="text-red-400 border-b border-tsuka-400 text-base relative w-full text-left flex flex-center"
                    >
                      <div className="absolute w-full rounded-lg mt-2 mr-4">
                        <div
                          className="bg-red-400/20 h-6 rounded text-start flex items-center px-2 ml-auto"
                          style={{
                            width: `${(sum * 100) / sellSum}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="flex-1">
              <div className="h-96">
                <div className="w-full text-base text-left flex flex-center text-tsuka-300 border-b border-tsuka-400">
                  <span className="flex-1 px-4 py-2">Price (USD)</span>
                  <span className="flex-1 px-4 py-2 text-end">
                    Size (
                    {
                      (
                        orders.find(
                          ({ pair_address }) =>
                            pair_address === selectedToken.value
                        )?.orders as ModifiedOrder[]
                      )?.[0]?.pairTokenShortName
                    }
                    )
                  </span>
                  <span className="flex-1 px-4 py-2 text-end">SUM (USD)</span>
                </div>
                {[...(orderBookData.buy ?? [])]
                  .sort((a, b) => a.price - b.price)
                  .map((item, index) => {
                    if (!index) {
                      sum = item.size;
                    } else {
                      sum += item.size;
                    }
                    return (
                      <div
                        key={index}
                        className="text-green-400 border-b border-tsuka-400 text-base relative w-full text-left flex flex-center"
                      >
                        <div className="text-green-400 absolute w-full rounded-lg m-2 pr-4">
                          <div
                            className="bg-green-400/20 h-6 rounded text-start flex items-center px-2 mr-auto"
                            style={{
                              width: `${
                                (sum * 100) / Math.max(sellSum, buySum)
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="flex-1 py-2 px-4 text-sm font-normal whitespace-nowrap">
                          {numberWithCommas(item.price)}
                        </span>
                        <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                          {item.size.toLocaleString("en-us")}
                        </span>
                        <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                          {numberWithCommas(sum * item.price)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="h-96">
              <div className="w-full text-base text-left flex flex-center text-tsuka-300 border-b border-tsuka-400">
                <span className="flex-1 px-4 py-2">Price (USD)</span>
                <span className="flex-1 px-4 py-2 text-end">
                  Size ({orders[0]?.pairTokenShortName})
                </span>
                <span className="flex-1 px-4 py-2 text-end">SUM (USD)</span>
              </div>
              {[...(orderBookData.buy ?? [])]
                .sort((a, b) => a.price - b.price)
                .map((item, index) => {
                  if (!index) {
                    sum = item.size;
                  } else {
                    sum += item.size;
                  }
                  return (
                    <div
                      key={index}
                      className="text-green-400 border-b border-tsuka-400 text-base relative w-full text-left flex flex-center"
                    >
                      <div className="text-green-400 absolute w-full rounded-lg m-2 pr-4">
                        <div
                          className="bg-green-400/20 h-6 rounded text-start flex items-center px-2 mr-auto"
                          style={{
                            width: `${(sum * 100) / buySum}%`,
                          }}
                        ></div>
                      </div>
                      <span className="flex-1 py-2 px-4 text-sm font-normal whitespace-nowrap">
                        {numberWithCommas(item.price)}
                      </span>
                      <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                        {item.size.toLocaleString("en-us")}
                      </span>
                      <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                        {numberWithCommas(sum)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        "No orders provided"
      )}
    </div>
  );
};
