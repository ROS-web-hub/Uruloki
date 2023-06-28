import { ChartBound } from "@/types/chart-bound.type";
import {
  OrderStatusEnum,
  SingleOrder,
  TokenOrder,
} from "@/types/token-order.type";
import { useMemo } from "react";
import { OrderWidgetGraph } from "../ui/tokens/order-widget-graph.token";

export const OrderWidgetToken: React.FC<TokenOrder> = ({
  name1,
  code1,
  name2,
  code2,
  status,
  orders,
  setShowEditOrderModal = () => {},
  setShowDeletedAlert = () => {},
}) => {
  function isSingle(object: any): object is SingleOrder {
    return "price" in object;
  }

  const chartBound = useMemo((): ChartBound => {
    let values: Array<number> = [];

    orders?.map((item) => {
      if (isSingle(item)) {
        values.push(item.price);
        return;
      } else {
        item.prices.map((i) => values.push(i));
      }
    });

    const max = Math.max(...values) * 1.1;
    const min = Math.min(...values) * 0.9;
    return { min, max };
  }, [orders]);

  const statusColor = useMemo((): { text: string; bg: string } => {
    switch (status) {
      case OrderStatusEnum.ACTIVE:
        return { text: "text-green-400", bg: "bg-green-400" };

      case OrderStatusEnum.CANCELLED:
        return { text: "text-red-400", bg: "bg-red-400" };

      case OrderStatusEnum.EXECUTED:
        return { text: "text-blue-400", bg: "bg-blue-400" };

      default:
        return { text: "text-blue-400", bg: "bg-blue-400" };
    }
  }, [status]);

  return (
    <div className="bg-tsuka-500 mt-4 p-4 md:pt-6 rounded-xl hover:border-4 hover:border-yellow-500 text-tsuka-100 transition-all duration-150">
      <div className="flex flex-row items-center mb-4">
        <div className="px-2 flex-1 flex-col">
          <p className="text-tsuka-50 text-lg font-semibold uppercase">
            {code1}/{code2}
          </p>
          <label className="text-sm text-tsuka-200">
            ID: {name1}/{name2}
          </label>
        </div>
        <div className="text-end">
          <div className="text-tsuka-200 text-sm">Status</div>
          <div className="flex items-center font-medium">
            <div
              className={`w-1 h-1 mr-1 rounded-full ${statusColor.bg}`}
            ></div>
            <span className={statusColor.text}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
      </div>
      <div className="md:h-[350px] md:overflow-scroll">
        {orders[0]
          ? orders.map((order) => {
              console.log(order.id, " : ", order.is_continuous);
              if (isSingle(order)) {
                return (
                  <OrderWidgetGraph
                    key={order.id}
                    id={order.id}
                    buy={order.order_type === "buy"}
                    isContinuous={order.is_continuous}
                    value1={order.price}
                    budget={order.budget}
                    bound={chartBound}
                    status={order.status}
                    tokenSymbol={order.baseTokenShortName}
                    pairedTokenSymbol={order.pairTokenShortName}
                    setShowEditOrderModal={setShowEditOrderModal}
                    setShowDeletedAlert={setShowDeletedAlert}
                  />
                );
              } else {
                return (
                  <OrderWidgetGraph
                    key={order.id}
                    id={order.id}
                    buy={order.order_type === "buy"}
                    isContinuous={order.is_continuous}
                    value1={order.prices[0]}
                    value2={order.prices[1]}
                    budget={order.budget}
                    bound={chartBound}
                    status={order.status}
                    tokenSymbol={order.baseTokenShortName}
                    pairedTokenSymbol={order.pairTokenShortName}
                    setShowEditOrderModal={setShowEditOrderModal}
                    setShowDeletedAlert={setShowDeletedAlert}
                  />
                );
              }
            })
          : "No orders provided"}
      </div>
      {/* <div className="relative flex justify-center">
        <button className="text-custom-primary font-medium" onClick={(e) => {manageHandler(e)}}>Manage</button>
        {
          showPopup &&
          <EditOrDeleteToken setShowPopupBg={setShowPopupBg} setShowEditOrderModal={setShowEditOrderModal} setShowConfirmDlg={setShowConfirmDlg} />
        }
        {
          showConfirmDlg &&
          <DeleteConfirmToken setShowPopupBg={setShowPopupBg} setShowConfirmDlg={setShowConfirmDlg} setShowDeletedAlert={setShowDeletedAlert} />
        }
      </div> */}
    </div>
  );
};
