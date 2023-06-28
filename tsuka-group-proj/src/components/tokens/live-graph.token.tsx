import { useState } from "react";
import { TokenGraphChart } from "../charts/token-graph.chart";

export const LiveGraphToken: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="h-full md:h-[58%] relative">
      <div className="bg-tsuka-500 rounded-xl text-tsuka-100 mb-4 md:mb-0 p-4">
        <TokenGraphChart
          onLoaded={() =>
            setTimeout(() => {
              setIsLoading(false);
            }, 1000)
          }
        />
      </div>
      {isLoading && (
        <div className="absolute top-20 left-6 md:left-[30%] md:right-[70%] shadow-lg flex flex-col items-center w-[311px] md:w-[440px] h-[261px] md:h-[250px] pt-16 pb-10 px-6 md:py-12 rounded-2xl text-center bg-tsuka-500 z-30">
          <img className="rotate mb-4" src="/icons/loading.png" alt="loading" />
          <h3 className="mb-2 font-Steradian-500 text-lg leading-6 text-tsuka-50">
            Loading graph
          </h3>
          <p className="font-Steradian-400 text-sm leading-[18px] text-tsuka-200">
            Please wait patiently as we process your transaction, ensuring it is
            secure and reliable.
          </p>
        </div>
      )}
    </div>
  );
};
