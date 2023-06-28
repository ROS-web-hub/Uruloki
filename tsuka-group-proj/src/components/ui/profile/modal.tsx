import { CardType } from "@/types/card.type";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { TokenMovementInput } from "../inputs/token-movement.input";
import { TokenIconsToken } from "../tokens/token-icons.token";
export interface ModalProps {
  open: boolean;
  callback: (arg: number) => void;
  handleClose: () => void;
  isDeposit: boolean;
  Cards: CardType[];
  backgroundInfo: any[];
  walletBalances: CardType[];
}

export const WithdrawAndDepositModal: React.FC<ModalProps> = ({
  open,
  callback,
  handleClose,
  isDeposit,
  Cards,
  backgroundInfo,
  walletBalances,
}) => {
  const [index, setIndex] = useState<number>(0);

  const getBackgroundIndex = (token_name: string) => {
    //console.log(token_name)
    const asciiKeys = [];
    var totalIndex = 0;
    var index = 0;
    for (var i = 0; i < token_name?.length; i++) {
      asciiKeys.push(token_name[i]?.charCodeAt(0));

      totalIndex += asciiKeys[i];
      index = totalIndex % backgroundInfo.length;
    }
    return index;
  };

  return (
    <>
      {open && (
        <div className="fixed left-0 top-0 z-30 bg-[rgba(19,21,31,0.6)] backdrop-blur-[2px] w-full h-screen">
          <div className="w-full h-full flex justify-center items-center p-4 md:p-0">
            <div className="relative w-full md:w-[440px] bg-tsuka-500 border rounded-2xl border-[#343C4F] text-tsuka-50 p-[24px]">
              <FiX
                className="absolute top-3 right-3 text-tsuka-300 text-lg cursor-pointer"
                onClick={handleClose}
              />
              <h2 className="text-xl font-Poppins-300 font-medium mb-[22px] text-[24px] leading-[36px] text-['#BBC3D7]">
                {isDeposit ? "Deposit" : "Withdraw"}
              </h2>
              {isDeposit && (
                <div className="w-full flex justify-between items-center bg-tsuka-500 outline-none border border-tsuka-400 rounded-md  px-[19px] py-[11px] mb-[9px]">
                  <span className="text-[#676F84] font-Poppins-300 font-normal text-[14px] leading-[21px]">
                    Token
                  </span>
                  <div
                    className="flex w-[40%] justify-between py-[6px] px-[6.92px] rounded-md items-center bg-no-repeat bg-cover	"
                    style={{
                      color: "#FFFFFF",
                      backgroundColor:
                        backgroundInfo[
                          getBackgroundIndex(walletBalances[index]?.name)
                        ].color,
                      backgroundImage:
                        backgroundInfo[
                          getBackgroundIndex(walletBalances[index]?.name)
                        ]?.backgroundImage,
                    }}
                  >
                    <TokenIconsToken
                      name={walletBalances[index]?.name}
                      shortName={walletBalances[index]?.shortName}
                      width={24}
                      height={24}
                    ></TokenIconsToken>
                    <div className="flex  font-medium text-[10px] landing-[13px] font-['DM Sans'] ">
                      <span>{walletBalances[index]?.value}</span>
                    </div>
                    <div className="flex  font-medium text-[10px] landing-[13px] font-['DM Sans'] ">
                      <span>{walletBalances[index]?.shortName}</span>
                    </div>
                  </div>
                </div>
              )}
              {!isDeposit && (
                <div className="w-full flex justify-between items-center bg-tsuka-500 outline-none border border-tsuka-400 rounded-md  px-[19px] py-[11px] mb-[9px]">
                  <span className="text-[#676F84] font-Poppins-300 font-normal text-[14px] leading-[21px]">
                    Token
                  </span>
                  <div
                    className="flex w-[40%] justify-between py-[6px] px-[6.92px] rounded-md items-center bg-no-repeat bg-cover	"
                    style={{
                      color: "#FFFFFF",
                      backgroundColor:
                        backgroundInfo[getBackgroundIndex(Cards[index].name)]
                          .color,
                      backgroundImage:
                        backgroundInfo[getBackgroundIndex(Cards[index].name)]
                          ?.backgroundImage,
                    }}
                  >
                    <TokenIconsToken
                      name={Cards[index].name}
                      shortName={Cards[index].shortName}
                      width={24}
                      height={24}
                    ></TokenIconsToken>
                    <div className="flex  font-medium text-[10px] landing-[13px] font-['DM Sans'] ">
                      <span>{Cards[index].value}</span>
                    </div>
                    <div className="flex  font-medium text-[10px] landing-[13px] font-['DM Sans'] ">
                      <span>{Cards[index].shortName}</span>
                    </div>
                  </div>
                </div>
              )}
              {isDeposit && (
                <div className="w-full flex flex-col items-center h-[112px] rounded-lg bg-gradient-to-b from-tsuka-500 to-tsuka-400 mb-[9px] overflow-y-scroll">
                  <div className="w-full grid gap-2 grid-cols-3 px-[8px] py-[10px]">
                    {walletBalances?.map((token, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-[6px] px-[6.92px] rounded-md items-center bg-no-repeat bg-cover	cursor-pointer"
                        style={{
                          color: "#FFFFFF",
                          backgroundColor:
                            backgroundInfo[getBackgroundIndex(token.name)]
                              .color,
                          backgroundImage:
                            backgroundInfo[getBackgroundIndex(token.name)]
                              ?.backgroundImage,
                        }}
                        onClick={() => setIndex(index)}
                      >
                        <TokenIconsToken
                          name={token.name}
                          shortName={token.shortName}
                          width={24}
                          height={24}
                        ></TokenIconsToken>
                        <div className="flex  font-medium text-[10px] landing-[13px] font-['DM Sans'] ">
                          <span>{token.value}</span>
                        </div>
                        <div className="flex  font-medium text-[10px] landing-[13px] font-['DM Sans'] ">
                          <span>{token.shortName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!isDeposit && (
                <div className="w-full flex flex-col items-center h-[112px] rounded-lg bg-gradient-to-b from-tsuka-500 to-tsuka-400 mb-[9px] overflow-y-scroll">
                  <div className="w-full grid gap-2 grid-cols-3 px-[8px] py-[10px]">
                    {Cards?.map((card, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-[6px] px-[6.92px] rounded-md items-center bg-no-repeat bg-cover	cursor-pointer"
                        style={{
                          color: "#FFFFFF",
                          backgroundColor:
                            backgroundInfo[getBackgroundIndex(card.name)].color,
                          backgroundImage:
                            backgroundInfo[getBackgroundIndex(card.name)]
                              ?.backgroundImage,
                        }}
                        onClick={() => setIndex(index)}
                      >
                        <TokenIconsToken
                          name={card.name}
                          shortName={card.shortName}
                          width={24}
                          height={24}
                        ></TokenIconsToken>
                        <div className="flex  font-medium text-[10px] landing-[13px] font-['DM Sans'] ">
                          <span>{card.value}</span>
                        </div>
                        <div className="flex  font-medium text-[10px] landing-[13px] font-['DM Sans'] ">
                          <span>{card.shortName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!!walletBalances.length && (
                <TokenMovementInput
                  id={"amount"}
                  currentAmount={(isDeposit
                    ? walletBalances[index]?.amount
                    : Cards[index].amount
                  ).toString()}
                  maxAmount={(isDeposit
                    ? walletBalances[index]?.amount
                    : Cards[index].amount
                  ).toString()}
                  currentShortName={
                    isDeposit
                      ? walletBalances[index]?.shortName
                      : Cards[index].shortName
                  }
                />
              )}
              <button
                onClick={() => callback(index)}
                className="w-full bg-custom-primary hover:bg-tsuka-400 text-white font-Poppins-300 leading-[24px] text-[16px] font-medium py-[11px] rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
