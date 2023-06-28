import { TokenPairOrders } from "@/lib/setups";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Order } from "@/types";
import { Token } from "@/types/token.type";
import { useState } from "react";
import { FiltersButton } from "../ui/buttons/filters.button";
import { OrderBookTokenUi } from "../ui/tokens/order-book-token.ui";
import { OrderHistoryBookTokenUi } from "../ui/tokens/order-history-book-token.ui";

export interface OrderBookTokens {
  value: string;
  label: string;
}

export const OrderBookToken: React.FC<{
  orders: TokenPairOrders[];
  tokens?: OrderBookTokens[];
  buyTrades?: any;
  sellTrades?: any;
}> = ({ orders, tokens, buyTrades, sellTrades }) => {

interface Props {
  token: Token;
  orders: Order[];
  sellTrades?: any[];
  buyTrades?: any[];
}

export const OrderBookToken: React.FC<Props> = ({
  token,
  orders,
  buyTrades,
  sellTrades,
}) => {
  const dispatch = useAppDispatch();
  const { value, status } = useAppSelector((state) => state.tokenPosition);
  const [selectedPath, setSelectedPath] = useState("order-book");

  const options = [
    {
      title: "Order Book",
      path: "order-book",
    },
    {
      title: "Activity",
      path: "order-book-history",
    },
  ];

  const orderComponent =
    selectedPath === "order-book" ? (
      <OrderBookTokenUi orders={orders} tokens={tokens as OrderBookTokens[]} />
    ) : (
      <OrderHistoryBookTokenUi sellTrades={sellTrades} buyTrades={buyTrades} />
    );

  return (
    <div className="bg-tsuka-500 mt-4 rounded-xl text-tsuka-100 px-2">
      <div className="w-full flex items-center justify-start border-b border-tsuka-400 px-2 pt-2 mb-2">
        {options.map(({ title, path }, index) => (
          <span
            key={index}
            onClick={() =>
              setSelectedPath((prev) =>
                prev === "order-book" ? "order-book-history" : "order-book"
              )
            }
            className={`${
              path === selectedPath
                ? "border-b-2 border-accent"
                : "border-b-2 border-transparent"
            } py-4 xs:p-4 text-center whitespace-nowrap mx-2 text-base sm:text-lg font-semibold text-tsuka-50 cursor-pointer`}
          >
            {title}
          </span>
        ))}
        <div className="ml-auto">
          <FiltersButton callback={() => console.log("filters button")} />
        </div>
      </div>
      {orderComponent && (
        <div className="overflow-x-scroll">{orderComponent}</div>
      )}
    </div>
  );
};
