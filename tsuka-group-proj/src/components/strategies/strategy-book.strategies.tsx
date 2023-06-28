import { Strategy } from "@/types/strategy.type";
import Link from "next/link";
import { useState } from "react";
import { MdArrowForward } from "react-icons/md";
import { FiltersButton } from "../ui/buttons/filters.button";
import { FiltersSearch } from "../ui/content-header/filters.search";
import { StatusSpan } from "../ui/spans/status.span";

export interface StrategyBookStrategiesProps {
  strategies: Array<Strategy>;
}

export const StrategyBookStrategies: React.FC<StrategyBookStrategiesProps> = ({
  strategies,
}) => {
  const [selectedPath, setSelectedPath] = useState("strategies-list");

  const options = [
    {
      title: "List of Setups",
      path: "strategies-list",
    },
  ];

  return (
    <div className="bg-tsuka-500 mt-4 rounded-xl text-tsuka-100 mb-16">
      <div className="w-full flex items-center justify-start px-2 pt-2">
        {options.map(({ title, path }, index) => (
          <span
            key={index}
            onClick={() => setSelectedPath(path)}
            className={`p-4 md:text-center mx-2 text-sm text-left md:text-lg font-semibold text-tsuka-50 cursor-pointer`}
          >
            {title}
          </span>
        ))}
        <div className="ml-auto flex w-full md:w-auto items-center gap-3">
          <FiltersSearch />
          <FiltersButton callback={() => console.log("filters button")} />
        </div>
      </div>
      <div>
        {strategies && (
          <div className="p-4 flex">
            <div className="flex-1 overflow-x-scroll scrollable">
              <table className="overflow-auto w-full">
                <thead className="text-sm text-left font-normal text-tsuka-300 border-b border-tsuka-400">
                  <tr>
                    <th scope="col" className="px-4 py-2">
                      #
                    </th>
                    <th scope="col" className="px-4 py-2">
                      Setup Title
                    </th>
                    <th scope="col" className="px-4 py-2 flex w-full">
                      <span>Chains</span>
                      <span className="ml-auto mr-8 min-w-[128px]">Status</span>
                    </th>
                    <th scope="col" className="px-4 py-2">
                      Created on
                    </th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody className="">
                  {strategies?.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b align-baseline border-tsuka-400 text-base w-full text-left"
                    >
                      <th
                        scope="row"
                        className="w-4 py-2 px-4 text-sm font-normal whitespace-nowrap"
                      >
                        #{item.id}
                      </th>
                      <td className="py-2 px-4 text-tsuka-50 text-sm font-normal whitespace-nowrap">
                        {item.title}
                      </td>
                      {item.orderTokens?.map(
                        (
                          { network, name1, name2, code1, code2, status },
                          index
                        ) => (
                          <td
                            key={index}
                            className="flex py-2 px-4 text-tsuka-50 text-sm font-normal whitespace-nowrap"
                          >
                            <div className="flex text-tsuka-200 items-center font-medium py-1">
                              <span className="text-tsuka-50 font-semibold text-base">
                                {code1}/
                                <span className="text-tsuka-200 text-sm">
                                  {code2}
                                </span>
                              </span>
                              <span className="ml-4">{network}</span>
                            </div>
                            <div className="my-auto ml-auto mr-8 min-w-[128px]">
                              <StatusSpan status={status} />
                            </div>
                          </td>
                        )
                      )}
                      <td className="py-2 px-4 text-tsuka-50 text-sm font-normal whitespace-nowrap">
                        {new Date(
                          Number(item?.createdAt) * 1000
                        ).toDateString()}
                      </td>
                      <td className="py-2 px-4 text-tsuka-50 text-sm font-normal whitespace-nowrap">
                        <div>
                          <Link href={`/strategies/${item.id}`}>
                            <span
                              className={
                                "text-custom-primary hover:text-custom-primary/90 w-full text-center focus:outline-none rounded-md text-sm px-5 py-2 inline-flex justify-center items-center mr-2"
                              }
                            >
                              See details
                              <label className="ml-1">
                                <MdArrowForward />
                              </label>
                            </span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
