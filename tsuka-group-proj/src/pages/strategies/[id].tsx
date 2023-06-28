import { OrderBookToken } from "@/components/tokens/order-book.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { EditOrderToken } from "@/components/ui/my-order/edit-order.token";
import { FullHeaderStrategies } from "@/components/ui/strategies/full-header.strategies";
import { ModifiedOrder, Setup, TokenPairOrders, getSetups } from "@/lib/setups";
import { getStrategies } from "@/store/apps/strategies";
import { getTokenByStrategyId } from "@/store/apps/token";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Order, Strategy } from "@/types";
import {
  OrderStatusEnum,
  OrderTypeEnum,
  PriceTypeEnum,
} from "@/types/token-order.type";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  HiOutlineArrowLongLeft,
  HiOutlineArrowLongRight,
} from "react-icons/hi2";

export const mapModifiedOrderToOrder = (modifiedOrder: ModifiedOrder) =>
  ({
    ...modifiedOrder,
    order_id: modifiedOrder.id,
  } as unknown as Order);

export default function StrategyDetails({
  id,
  orders,
  currentSetup,
}: {
  id: string;
  orders: Array<TokenPairOrders>;
  currentSetup: Setup;
}) {
  const dispatch = useAppDispatch();
  const [showIndex, setShowIndex] = useState(0);
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(-1);
  const [showDeletedAlert, setShowDeletedAlert] = useState<boolean>(false);
  const router = useRouter();
  const [token, setToken] = useState(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handlePrevIndex = useCallback(() => {
    setShowIndex((prev) => prev - 1);
  }, []);

  const handleNextIndex = useCallback(() => {
    setShowIndex((prev) => prev + 1);
  }, []);

  const handleEditModal = (show: boolean, id: number) => {
    console.log(show, id);
    setSelectedOrderId(id);
    setShowEditOrderModal(show);
  };

  return (
    <div className="flex flex-col">
      {currentSetup && (
        <div className="p-8">
          <FullHeaderStrategies strategyDetails={currentSetup} />
          <div className="hidden md:grid grid-cols-9 gap-4">
            {currentSetup?.orderTokens?.map((item, index) => (
              <div key={index} className="col-span-9 md:col-span-3">
                <OrderWidgetToken
                  name1={item.name1}
                  code1={item.code1}
                  name2={item.name2}
                  code2={item.code2}
                  status={
                    item.orders.filter(
                      (a) => a.status === "Canceled" || a.status === "Closed"
                    ).length > 0
                      ? OrderStatusEnum.CANCELLED
                      : OrderStatusEnum.ACTIVE
                  }
                  orders={item.orders.map((order) => ({
                    id: order.id as number,
                    budget: order.budget as number,
                    price_type: order.price_type as PriceTypeEnum,
                    order_type: order.order_type as OrderTypeEnum,
                    status: order.status as OrderStatusEnum,
                    is_continuous: order.is_continuous as boolean,
                    baseTokenShortName: order.baseTokenShortName as string,
                    baseTokenLongName: order.baseTokenLongName as string,
                    pairTokenShortName: order.pairTokenShortName as string,
                    pairTokenLongName: order.pairTokenLongName as string,
                    price: order.single_price as number,
                    prices: [order.from_price, order.to_price],
                  }))}
                  setShowEditOrderModal={handleEditModal}
                  setShowDeletedAlert={setShowDeletedAlert}
                />
              </div>
            ))}
          </div>
          <div className="relative md:hidden">
            <button
              type="button"
              disabled={showIndex <= 0}
              onClick={handlePrevIndex}
              className={`${
                showIndex <= 0 ? "hidden" : ""
              } absolute flex p-2 rounded-full bg-tsuka-400 shadow-xl text-tsuka-50 top-[50%] -left-6`}
            >
              <label>
                <HiOutlineArrowLongLeft size={24} />
              </label>
            </button>
            {currentSetup?.orderTokens?.map(
              (item, index) =>
                showIndex === index && (
                  <div key={index} className="col-span-9">
                    <OrderWidgetToken
                      name1={item.name1}
                      code1={item.code1}
                      name2={item.name2}
                      code2={item.code2}
                      status={
                        item.orders.filter(
                          (a) =>
                            a.status === "Canceled" || a.status === "Closed"
                        ).length > 0
                          ? OrderStatusEnum.CANCELLED
                          : OrderStatusEnum.ACTIVE
                      }
                      orders={item.orders.map((order) => ({
                        id: order.id as number,
                        budget: order.budget as number,
                        price_type: order.price_type as PriceTypeEnum,
                        order_type: order.order_type as OrderTypeEnum,
                        status: order.status as OrderStatusEnum,
                        is_continuous: order.is_continuous as boolean,
                        baseTokenShortName: order.baseTokenShortName as string,
                        baseTokenLongName: order.baseTokenLongName as string,
                        pairTokenShortName: order.pairTokenShortName as string,
                        pairTokenLongName: order.pairTokenLongName as string,
                        price: order.single_price as number,
                        prices: [order.from_price, order.to_price],
                      }))}
                      setShowEditOrderModal={handleEditModal}
                      setShowDeletedAlert={setShowDeletedAlert}
                    />
                  </div>
                )
            )}
            <button
              type="button"
              disabled={showIndex >= currentSetup?.orderTokens?.length - 1}
              onClick={handleNextIndex}
              className={`${
                showIndex >= currentSetup?.orderTokens?.length - 1
                  ? "hidden"
                  : ""
              } absolute flex p-2 rounded-full bg-tsuka-400 shadow-xl text-tsuka-50 top-[50%] -right-6`}
            >
              <label>
                <HiOutlineArrowLongRight size={24} />
              </label>
            </button>
          </div>
          {showEditOrderModal && (
            <EditOrderToken
              setShowEditOrderModal={setShowEditOrderModal}
              selectedOrderId={selectedOrderId}
              closeHandler={() => {
                setShowEditOrderModal(false);
                setSelectedOrderId(-1);
              }}
            />
          )}
          <OrderBookToken
            tokens={currentSetup.orderTokens.map((order) => ({
              value: order.pair_address,
              label:
                order.code1 == "USDT" ||
                order.code1 == "USDC" ||
                order.code1 == "WETH" ||
                order.code1 == "DAI"
                  ? `${order.code2}/${order.code1}`
                  : `${order.code1}/${order.code2}`,
            }))}
            orders={currentSetup.orderTokens}
          />
        </div>
      )}
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  //Get all orders in strategy
  const allSetups = (await getSetups()).setups;
  const currentSetup = allSetups.filter((a) => a.id === id)[0];
  const orders = currentSetup.orderTokens;

  //Get list pair addresses
  const pairAddresses: Array<string> = [];
  orders.map((a) => {
    if (!pairAddresses.includes(a.pair_address)) {
      pairAddresses.push(a.pair_address);
    }
  });

  //Get activity feed & order book info for each pair

  return {
    props: {
      id,
      orders,
      currentSetup,
    },
  };
};
