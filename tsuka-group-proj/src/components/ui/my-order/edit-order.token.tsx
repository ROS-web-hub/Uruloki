import { Order, PostOrder, TokenCache, TokenPairInfo } from "@/types";
// import getTokenCache from '@/lib/api/tokens/'
import { useEffect, useState } from "react";
import Dropdown from "../buttons/dropdown";

import {
  editUserOrder,
  setSelectedOrder,
  createOrder,
  getTokenPairPrice,
} from "@/store/apps/user-order";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PatchOrder } from "@/types";
import { OrderTypeEnum, PriceTypeEnum } from "@/types/token-order.type";

import { commafy } from "@/helpers/calc.helper";
import { formatNumberToHtmlTag } from "@/helpers/coin.helper";
import { getAllTokenCache } from "@/store/apps/token-cache";
import { FaClock, FaSync } from "react-icons/fa";
import { FiPlusCircle, FiX } from "react-icons/fi";
import ToggleButton from "../buttons/toggle.button";
import HomePageTokens from "@/lib/api/tokens";
import { useUrulokiAPI } from "@/blockchain";
import { toast } from "react-toastify";

export interface EditOrderTokenProp {
  isEdit?: boolean;
  setShowEditOrderModal: (a: any) => void;
  name1?: string;
  code1?: string;
  name2?: string;
  code2?: string;
  pair_address?: string;
  selectedOrderId?: number;
  closeHandler: () => void;
  pairInfo?: TokenPairInfo;

  //  token?: Token;
}

export const convertLawPrice = (price: number) => {
  let priceEle;
  if (price >= 0.01) {
    priceEle = `$${commafy(price)}`;
  } else {
    priceEle = (
      <>
        {formatNumberToHtmlTag(price).integerPart}
        .0
        <sub>{formatNumberToHtmlTag(price).leadingZerosCount}</sub>
        {formatNumberToHtmlTag(price).remainingDecimal}
      </>
    );
  }
  return priceEle;
};

export const handleNumberFormat = (num: number): string => {
  let value = num.toString();
  const pattern = /^\d*\.?\d*$/;
  if (!pattern.test(value)) return "";
  let newValue = "";
  if (value.search("\\.") !== -1) {
    let [integerPart, decimalPart] = value.split(".");
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    newValue = `${integerPart}.${decimalPart ? decimalPart : ""}`;
    // const newValue = decimalPart ? `${integerPart}.${decimalPart}` : `${integerPart}.`;
  } else {
    newValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return newValue;
};
const toNumber = (str: string): number => {
  const value = str.replace(/,/g, "");
  const num = Number(value);
  if (Number.isNaN(num)) {
    return -1;
  }
  return num;
};
export const EditOrderToken: React.FC<EditOrderTokenProp> = ({
  isEdit = true,
  setShowEditOrderModal,
  selectedOrderId = 0,
  closeHandler,
  name1,
  code1,
  name2,
  code2,
  pair_address,
  pairInfo,
}) => {
  console.log("Create an order");
  const dispatch = useAppDispatch();

  const selectedOrder = useAppSelector(
    (state) => state.userOrder.selectedOrder
  );
  const tokenCache = useAppSelector((state) => state.tokencache.value);
  const token_price = useAppSelector(
    (state) => state.userOrder.selectedTokenPairPrice
  );
  const [seletCollaped, setSeletCollaped] = useState(true);
  const [selectedToken, setSelectedToken] = useState(0);
  const [allTokenName, setAllTokenName] = useState<TokenCache[]>([]);
  const [isBuy, setIsBuy] = useState(
    selectedOrder.order_type === OrderTypeEnum.BUY
  );
  const [targetPrice, setTargetPrice] = useState(
    handleNumberFormat(selectedOrder.single_price ?? 0)
  );
  const [minPrice, setMinPrice] = useState(
    handleNumberFormat(selectedOrder.from_price ?? 0)
  );
  const [maxPrice, setMaxPrice] = useState(
    handleNumberFormat(selectedOrder.to_price ?? 0)
  );
  const [amount, setAmount] = useState(
    handleNumberFormat(selectedOrder.budget ?? 0)
  );
  const [isRange, setIsRange] = useState(
    selectedOrder.price_type === PriceTypeEnum.RANGE
  );
  const [isContinuous, setIsContinuous] = useState<boolean>(false);
  const [tokenPairInfo, setTokenPairInfo] = useState<TokenPairInfo>();

  const {
    editContinuousPriceRangeOrder,
    editContinuousTargetPriceOrder,
    editNonContinuousPriceRangeOrder,
    editNonContinuousTargetPriceOrder,
    createContinuousPriceRangeOrder,
    createContinuousTargetPriceOrder,
    createNonContinuousPriceRangeOrder,
    createNonContinuousTargetPriceOrder,
  } = useUrulokiAPI();

  useEffect(() => {
    if (isEdit) {
      dispatch(setSelectedOrder(selectedOrderId));
    }
    if (!pairInfo) {
      void (async () => {
        const info = await HomePageTokens.getTokenPairInfo(
          pair_address as string
        );
        setTokenPairInfo(info);
      })();
    } else {
      setTokenPairInfo(pairInfo);
    }
    dispatch(getAllTokenCache());
  }, []);

  useEffect(() => {
    if (pair_address) {
      dispatch(getTokenPairPrice(pair_address as string));
    }
  }, [pair_address]);

  useEffect(() => {
    const currentToken = isBuy ? pairShortName : baseShortName;
    setAllTokenName([
      { shortName: currentToken } as TokenCache,
      ...tokenCache.filter(({ shortName }) => shortName !== currentToken),
    ]);
  }, [tokenCache, isBuy]);

  useEffect(() => {
    if (JSON.stringify(selectedOrder) !== "{}" && isEdit) {
      setTargetPrice(handleNumberFormat(selectedOrder.single_price ?? 0));
      setMinPrice(handleNumberFormat(selectedOrder.from_price ?? 0));
      setMaxPrice(handleNumberFormat(selectedOrder.to_price ?? 0));
      setAmount(handleNumberFormat(selectedOrder.budget ?? 0));
      setIsRange(selectedOrder.price_type === PriceTypeEnum.RANGE);
      setIsContinuous(selectedOrder.is_continuous ?? false);
      dispatch(getTokenPairPrice(selectedOrder.pair_address as string));
    }
  }, [selectedOrder]);

  const closeClickHandler = () => {
    closeHandler();
    setTargetPrice(handleNumberFormat(-1));
    setMinPrice(handleNumberFormat(-1));
    setMaxPrice(handleNumberFormat(-1));
    setAmount(handleNumberFormat(-1));
    setIsContinuous(false);
    setShowEditOrderModal(false);
  };
  const tokens = [
    {
      name: "bitcoin",
      code: "BTC",
      title: "Bitcoin",
    },
    {
      name: "ethereum",
      code: "ETH",
      title: "Ethereum",
    },
  ];

  const handleNumberInputChange = (name: string, event: any) => {
    let value = event.target.value.replace(/,/g, "");
    const pattern = /^\d*\.?\d*$/;
    if (!pattern.test(value)) return;
    let newValue = "";
    if (value.search("\\.") !== -1) {
      let [integerPart, decimalPart] = value.split(".");
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      newValue = `${integerPart}.${decimalPart ? decimalPart : ""}`;
      // const newValue = decimalPart ? `${integerPart}.${decimalPart}` : `${integerPart}.`;
    } else {
      newValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    switch (name) {
      case "amount":
        setAmount(newValue);
        break;
      case "target":
        setTargetPrice(newValue);
        break;
      case "min":
        setMinPrice(newValue);
        break;
      case "max":
        setMaxPrice(newValue);
        break;

      default:
        break;
    }
  };

  const blurHandler = (name: string, event: any) => {
    let value = event.target.value.replace(/,/g, "");
    let newValue = "";
    if (!/^\d*\.?\d*$/.test(value)) {
      newValue = "0";
      return;
    } else {
      value = (+value).toString();
      let [integerPart, decimalPart] = value.split(".");
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      newValue = decimalPart
        ? `${integerPart}.${decimalPart}`
        : `${integerPart}`;
    }
    switch (name) {
      case "amount":
        setAmount(newValue);
        break;
      case "target":
        setTargetPrice(newValue);
        break;
      case "min":
        setMinPrice(newValue);
        break;
      case "max":
        setMaxPrice(newValue);
        break;

      default:
        break;
    }
  };

  const toggle = () => {
    setIsContinuous((prevState) => !prevState);
  };
  const handleSubmit = async () => {
    if (isEdit) {
      const patchData = {} as PatchOrder;
      patchData.budget = toNumber(amount);
      patchData.order_type = isBuy ? "buy" : "sell";
      patchData.price_type = isRange ? "range" : "single";
      if (isRange) {
        patchData.from_price = toNumber(minPrice);
        patchData.to_price = toNumber(maxPrice);
      } else {
        patchData.single_price = toNumber(targetPrice);
      }
      patchData.is_continuous = isContinuous;
      console.log("before submit(patch)::");
      console.log(patchData);
      const action = await dispatch(
        editUserOrder({ id: selectedOrderId, patchData })
      );
      if (action.meta.requestStatus === "fulfilled") {
        if (action.payload) {
          const payload = action.payload as Order;
          if (payload.price_type === "range") {
            if (payload.is_continuous === true) {
              editContinuousPriceRangeOrder(
                payload.order_id,
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy,
                Number(minPrice.split(",").join("")),
                Number(maxPrice.split(",").join("")),
                Number(amount.split(",").join("")),
                Number(process.env.NEXT_PUBLIC_RESET_PERCENTAGE)
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            } else {
              editNonContinuousPriceRangeOrder(
                payload.order_id,
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy,
                Number(minPrice.split(",").join("")),
                Number(maxPrice.split(",").join("")),
                Number(amount.split(",").join(""))
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            }
          } else {
            if (payload.is_continuous === true) {
              editContinuousTargetPriceOrder(
                payload.order_id,
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy,
                Number(targetPrice.split(",").join("")),
                Number(amount.split(",").join("")),
                Number(process.env.NEXT_PUBLIC_RESET_PERCENTAGE)
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            } else {
              console.log("--------------------------------");
              console.log(payload.order_id);
              console.log(tokenPairInfo?.pairedToken?.address as string);
              console.log(tokenPairInfo?.baseToken?.address as string);
              console.log(isBuy);
              console.log(Number(targetPrice.split(",").join("")));
              console.log(Number(amount.split(",").join("")));
              console.log("--------------------------------");
              editNonContinuousTargetPriceOrder(
                payload.order_id as number,
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy as boolean,
                Number(targetPrice.split(",").join("")),
                Number(amount.split(",").join(""))
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            }
          }
        }
      }
      setShowEditOrderModal(false);
    } else {
      const postData = {} as PostOrder;
      postData.budget = toNumber(amount);
      postData.order_type = isBuy ? "buy" : "sell";
      postData.price_type = isRange ? "range" : "single";
      if (isRange) {
        postData.from_price = toNumber(minPrice);
        postData.to_price = toNumber(maxPrice);
      } else {
        postData.single_price = toNumber(targetPrice);
      }
      postData.is_continuous = isContinuous;
      postData.baseTokenLongName = name1 as string;
      postData.baseTokenShortName = code1 as string;
      postData.pairTokenLongName = name2 as string;
      postData.pairTokenShortName = code2 as string;
      postData.user_id = 1; ////TODO:get it from server
      postData.pair_address = pair_address as string;
      console.log("before Submit(post)::");
      console.log(postData);
      const action = await dispatch(createOrder(postData));
      if (action.meta.requestStatus === "fulfilled") {
        if (action.payload) {
          const payload = action.payload as Order;
          if (payload.price_type === "range") {
            if (payload.is_continuous === true) {
              createContinuousPriceRangeOrder(
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy,
                Number(minPrice.split(",").join("")),
                Number(maxPrice.split(",").join("")),
                Number(amount.split(",").join("")),
                Number(process.env.NEXT_PUBLIC_RESET_PERCENTAGE)
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            } else {
              createNonContinuousPriceRangeOrder(
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy,
                Number(minPrice.split(",").join("")),
                Number(maxPrice.split(",").join("")),
                Number(amount.split(",").join(""))
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            }
          } else {
            if (payload.is_continuous === true) {
              createContinuousTargetPriceOrder(
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy,
                Number(targetPrice.split(",").join("")),
                Number(amount.split(",").join("")),
                Number(process.env.NEXT_PUBLIC_RESET_PERCENTAGE)
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            } else {
              createNonContinuousTargetPriceOrder(
                tokenPairInfo?.pairedToken?.address as string,
                tokenPairInfo?.baseToken?.address as string,
                isBuy,
                Number(targetPrice.split(",").join("")),
                Number(amount.split(",").join(""))
              ).then((res) => {
                if (res?.msg === "success") {
                  toast(res?.msg, { type: "success" });
                } else {
                  toast(res?.msg, { type: "error" });
                }
              });
            }
          }
        }
      }
      setShowEditOrderModal(false);
    }
  };

  const baseLongName = isEdit ? selectedOrder.baseTokenLongName : name1;
  const baseShortName = isEdit ? selectedOrder.baseTokenShortName : code1;
  const pairLongName = isEdit ? selectedOrder.pairTokenLongName : name2;
  const pairShortName = isEdit ? selectedOrder.pairTokenShortName : code2;
  return (
    <div className="fixed left-0 top-0 z-30 bg-[rgba(19,21,31,0.6)] backdrop-blur-[2px] w-full h-screen">
      <div className="w-full h-full flex justify-center items-center p-4 md:p-0">
        <div className="relative w-full md:w-[440px] bg-tsuka-500 border rounded-2xl border-[#343C4F] text-tsuka-50 p-6">
          <FiX
            className="absolute top-3 right-3 text-tsuka-300 text-lg cursor-pointer"
            onClick={closeClickHandler}
          />
          <p className="text-2xl font-medium">
            {isEdit ? "Edit Order" : "Create an Order"}
          </p>
          <p className="text-sm">
            <span className="text-tsuka-200">Current Price : </span>
            <span className="text-tsuka-50">
              {!!token_price.base_price && (
                <>
                  $
                  {token_price.base_price >= 0.01
                    ? handleNumberFormat(
                        parseFloat(token_price.base_price.toFixed(2))
                      )
                    : convertLawPrice(token_price.base_price)}
                </>
              )}
            </span>
          </p>
          {/* <div className="w-full mt-4 flex gap-2 text-sm">
            <button
              className={`w-1/2 flex justify-center items-center border border-tsuka-400 rounded-md py-2 ${
                isContinuous ? "bg-tsuka-400" : ""
              }`}
              onClick={() => setIsContinuous(true)}
            >
              <span
                className={isContinuous ? "text-tsuka-50 flex items-center" : "text-tsuka-300 flex items-center"}
              >
                <FaSync className={isContinuous? "text-custom-green mr-1 xs:mr-2":"text-tsuka-300 mr-1 xs:mr-2"}/> CONTNUOUS
              </span>
            </button>
            <button
              className={`w-1/2 flex justify-center items-center border border-tsuka-400 rounded-md py-2 ${
                !isContinuous ? "bg-tsuka-400" : ""
              }`}
              onClick={() => setIsContinuous(false)}
            >
              <span
                className={!isContinuous ? "text-tsuka-50 flex items-center" : "text-tsuka-300 flex items-center"}
              >
                <FaClock className={!isContinuous?"text-custom-red mr-1 xs:mr-2":"text-tsuka-300 mr-1 xs:mr-2"}/>ONE TIME
              </span>
            </button>
          </div> */}
          <div className="flex flex-row-reverse justify-center items-center mt-4">
            <ToggleButton isContinuous={isContinuous} onToggle={toggle} />

            {isContinuous ? (
              <span
                className={
                  isContinuous
                    ? "text-tsuka-50 flex items-center"
                    : "text-tsuka-300 flex items-center"
                }
              >
                <FaSync
                  className={
                    isContinuous
                      ? "text-custom-green mr-1 xs:mr-2"
                      : "text-tsuka-300 mr-1 xs:mr-2"
                  }
                />{" "}
                Continuous
              </span>
            ) : (
              <span
                className={
                  !isContinuous
                    ? "text-tsuka-50 flex items-center"
                    : "text-tsuka-300 flex items-center"
                }
              >
                <FaClock
                  className={
                    !isContinuous
                      ? "text-custom-red mr-1 xs:mr-2"
                      : "text-tsuka-300 mr-1 xs:mr-2"
                  }
                />
                One time
              </span>
            )}
          </div>
          <div className="w-full mt-4 flex">
            <button
              className={`${
                isBuy
                  ? "text-custom-primary border-custom-primary"
                  : "text-tsuka-300 border-tsuka-300"
              } w-1/2 border-b text-center py-[11px]`}
              onClick={() => setIsBuy(true)}
            >
              <p className="font-medium">Buy</p>
              <p className="text-xs">
                {baseShortName} with {pairShortName}
              </p>
            </button>
            <button
              className={`${
                !isBuy
                  ? "text-custom-primary border-custom-primary"
                  : "text-tsuka-300 border-tsuka-300"
              } w-1/2 border-b text-center py-[11px]`}
              onClick={() => setIsBuy(false)}
            >
              <p className="font-medium">SELL</p>
              <p className="text-xs">
                {baseShortName} for {pairShortName}
              </p>
            </button>
          </div>

          <div className="w-full mt-4 flex gap-2 text-sm">
            <button
              className={`w-1/2 flex justify-center items-center border border-tsuka-400 rounded-md py-2 ${
                isRange ? "bg-tsuka-400" : ""
              }`}
              onClick={() => setIsRange(true)}
            >
              <div
                className={`w-3 h-3 mr-2 border-solid border-[2px] rounded-full border-${
                  isRange ? "primary" : "tsuka-300"
                }`}
              />
              <span className={isRange ? "text-tsuka-50" : "text-tsuka-300"}>
                Price Range
              </span>
            </button>
            <button
              className={`w-1/2 flex justify-center items-center border border-tsuka-400 rounded-md py-2 ${
                !isRange ? "bg-tsuka-400" : ""
              }`}
              onClick={() => setIsRange(false)}
            >
              <div
                className={`w-3 h-3 mr-2 border-solid border-[4px] rounded-full border-${
                  !isRange ? "primary" : "tsuka-300"
                }`}
              />
              <span className={!isRange ? "text-tsuka-50" : "text-tsuka-300"}>
                Single Price
              </span>
            </button>
          </div>
          {!isRange && (
            <div className="relative mt-4">
              <span className="absolute left-3 top-[calc(50%-10px)] text-sm text-tsuka-300 text-left">
                Target ($)
              </span>
              <input
                type="text"
                className="w-full bg-tsuka-500 outline-none border border-tsuka-400 rounded-md text-right pr-3 pl-12 py-2 text-sm"
                value={targetPrice}
                onChange={(e) => handleNumberInputChange("target", e)}
                onBlur={(e) => blurHandler("target", e)}
              />
            </div>
          )}
          {isRange && (
            <div className="block md:flex justify-between items-center">
              <div className="relative mt-4">
                <span className="absolute left-3 top-[calc(50%-10px)] text-sm text-tsuka-300 text-left">
                  From ($)
                </span>
                <input
                  type="text"
                  className="w-full bg-tsuka-500 outline-none border border-tsuka-400 rounded-md text-right pr-3 pl-12 py-2 text-sm"
                  value={minPrice}
                  onChange={(e) => handleNumberInputChange("min", e)}
                  onBlur={(e) => blurHandler("min", e)}
                />
              </div>
              <span className="hidden md:block mx-4 mt-4 text-tsuka-300">
                -
              </span>
              <div className="relative mt-4">
                <span className="absolute left-3 top-[calc(50%-10px)] text-sm text-tsuka-300 text-left">
                  To ($)
                </span>
                <input
                  type="text"
                  className="w-full bg-tsuka-500 outline-none border border-tsuka-400 rounded-md text-right pr-3 pl-12 py-2 text-sm"
                  value={maxPrice}
                  onChange={(e) => handleNumberInputChange("max", e)}
                  onBlur={(e) => blurHandler("max", e)}
                />
              </div>
            </div>
          )}
          {/* <div className="flex items-center"> */}
          {/* <span className="ml-1 text-sm text-tsuka-100 mr-2">
                    {isBuy
                      ? pairLongName
                      : baseLongName}
                  </span>
                </div>
              </div>
                      ? selectedOrder.pairTokenLongName
                      : selectedOrder.baseTokenLongName}
                  </span> */}
          {/* </div> */}
          <span className="text-tsuka-200 text-sm mt-3 ml-3.5 px-1 bg-tsuka-500">
            Amount
          </span>

          <div
            className="w-full -mt-2.5 py-[11px] px-3 border border-tsuka-400 rounded-md "
            onClick={() => setSeletCollaped(!seletCollaped)}
          >
            <div className="w-full flex justify-between">
              <Dropdown allTokenName={allTokenName} />
              {/* <div
                className="relative shrink-0 w-28 flex justify-between items-center p-2 bg-tsuka-400 rounded-lg cursor-pointer"
                onClick={() => setSeletCollaped(!seletCollaped)}
              >
                
              </div> */}
              <input
                type="text"
                className="grow min-w-[100px] bg-tsuka-500 outline-none text-right text-2xl font-medium"
                value={amount}
                onChange={(e) => handleNumberInputChange("amount", e)}
                onBlur={(e) => blurHandler("amount", e)}
              />
            </div>
            <div className="w-full flex justify-between mt-1">
              <p className="text-sm">
                <span className="text-tsuka-200">Balance : </span>
                <span className="text-tsuka-50 uppercase">
                  {3.000493} {(isBuy ? pairShortName : baseShortName) ?? ""}
                </span>
                <span className="text-custom-primary text-xs"> MAX</span>
              </p>
              <span className="text-tsuka-50 text-sm">
                {(() => {
                  let totalAmount =
                    parseFloat(amount.split(",").join("")) *
                    (isBuy ? token_price.quote_price : token_price.base_price);
                  return (
                    <>
                      $
                      {totalAmount
                        ? totalAmount >= 0.001
                          ? handleNumberFormat(
                              parseFloat(totalAmount.toFixed(3))
                            )
                          : convertLawPrice(totalAmount)
                        : 0}
                    </>
                  );
                })()}
              </span>
            </div>
          </div>
          <div className="flex justify-between text-sm mt-3">
            <span className="text-tsuka-200">Slippage</span>
            <span className="text-tsuka-50">{2.5}%</span>
          </div>
          <button
            className="w-full flex justify-center items-center rounded-[10px] bg-custom-primary py-2 mt-3 text-white"
            onClick={handleSubmit}
          >
            {isEdit ? (
              <>Apply Changes</>
            ) : (
              <>
                <FiPlusCircle className="mr-1" /> Create Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
