import { getStrategies } from "@/store/apps/strategies";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MdArrowForward } from "react-icons/md";
import { DefaultButton } from "../ui/buttons/default.button";
import { TokenPairStrategies } from "../ui/strategies/token-pair.strategies";

export interface SidebarStrategiesProps {
  open: boolean;
  handleOpen: () => void;
}

export const SidebarStrategies: React.FC<SidebarStrategiesProps> = ({
  open,
  handleOpen,
}) => {
  const dispatch = useAppDispatch();
  const {
    strategies: { value: strategies, status },
  } = useAppSelector((state) => state);

  useEffect(() => {
    dispatch(getStrategies());
  }, [dispatch]);

  const [showExtraId, setShowExtraId] = useState<number | null>(null);

  const auctoHideSideBar = (e: any) => {
    if (e.target.classList.contains("backdrop-blur-sm")) {
      handleOpen();
    }
  };

  const isStatusOk = useMemo(() => {
    return status === "ok";
  }, [status]);

  return (
    <div
      className={
        open
          ? "w-full h-screen top-0 lef-0 bg-tsuka-700/60 fixed z-10 backdrop-blur-sm"
          : ""
      }
      onClick={(e) => auctoHideSideBar(e)}
    >
      <div
        className={`${
          open ? "translate-x-0 right-0" : "translate-x-full right-0"
        } fixed top-0 z-40 h-screen p-6 overflow-y-auto shadow-xl transition-transform bg-tsuka-500 w-full md:w-[516px]`}
      >
        <div className="w-min whitespace-nowrap">
          <DefaultButton
            label="Hide Sidebar"
            callback={handleOpen}
            Icon={MdArrowForward}
          />
        </div>
        <div>
          <div className="text-tsuka-50 text-3xl">
            Orders & Setups
            {isStatusOk && (
              <span className="text-tsuka-200 text-lg ml-1">
                ({strategies?.length})
              </span>
            )}
          </div>
        </div>
        {isStatusOk ? (
          <>
            <div className="text-tsuka-200 py-2">Showing list of setups</div>
            <div className="flex flex-col mt-4 gap-4">
              {strategies.map(({ id, status, orderTokens }, index) => (
                <div
                  key={id}
                  className="border border-tsuka-200 p-2 rounded-md flex align-top"
                >
                  <div className="flex flex-1 flex-col">
                    <Link href={`/strategies/${id}`}>
                      <div className="flex">
                        <div className="flex -space-x-3 mr-2"></div>
                        <div className="flex flex-col">
                          <span className="text-tsuka-50 text-sm">
                            {orderTokens?.length >= 2
                              ? "Avoid Strategy"
                              : `${orderTokens[0]?.code1}/${orderTokens[0]?.code2}`}
                          </span>
                          <span className="text-tsuka-200 text-xs">
                            ID: {id}
                          </span>
                        </div>
                      </div>
                    </Link>
                    {orderTokens?.length >= 2 && (
                      <div className="ml-2 px-2 border-l-2 text-sm border-accent text-accent border-dashed">
                        {showExtraId === index &&
                          orderTokens?.map((extra) => (
                            <div key={extra.code1} className="flex mt-2">
                              <TokenPairStrategies
                                id={id}
                                name1={extra.name1}
                                code1={extra.code1}
                                name2={extra.name2}
                                code2={extra.code2}
                              />
                            </div>
                          ))}
                        <span
                          onClick={() =>
                            setShowExtraId((prev) =>
                              prev === index ? null : index
                            )
                          }
                          className="cursor-pointer"
                        >
                          {showExtraId === index
                            ? ""
                            : `${orderTokens?.length} orders in strategy`}
                          <span className="text-xs font-light">
                            {showExtraId === index
                              ? "(Show less)"
                              : "(Click to see)"}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                  {/* <div>
                <StatusSpan status={status || orderTokens[0]?.status} />
              </div> */}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center w-[311px] md:w-[440px] h-[261px] md:h-[250px] pt-16 pb-10 px-6 md:py-12 rounded-2xl text-center bg-tsuka-500">
            <img
              className="rotate mb-4"
              src="/icons/loading.png"
              alt="loading"
            />
            <h3 className="mb-2 font-Steradian-500 text-lg leading-6 text-tsuka-50">
              Loading Orders & Setups
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};
