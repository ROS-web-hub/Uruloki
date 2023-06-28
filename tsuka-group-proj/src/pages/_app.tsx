import { DashboardLayout } from "@/components/layouts/dashboard.layout";
import { LoadingBox } from "@/components/ui/loading/loading-box";
import "@/styles/globals.css";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import type { AppProps } from "next/app";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { store } from "../store";

const chains = [arbitrum, mainnet, polygon];
const projectId = process.env.NEXT_PUBLIC_YOUR_PROJECT_ID as string;

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLandingPage = router.pathname === "/index" || router.pathname === "/";
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", () => {
      setIsLoading(true);
    });
    Router.events.on("routeChangeComplete", () => {
      setIsLoading(false);
    });
    Router.events.on("routeChangeError", () => {
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <Provider store={store}>
          {isLoading && (
            <div className="w-screen h-screen">
              <LoadingBox
                title="Loading data"
                description="Please wait patiently as we process your transaction, ensuring it is secure and reliable."
              />
            </div>
          )}
          {isLandingPage ? (
            <Component {...pageProps} />
          ) : (
            <DashboardLayout>
              <Component {...pageProps} />
            </DashboardLayout>
          )}
        </Provider>
      </WagmiConfig>

      <Web3Modal
        projectId={projectId}
        explorerExcludedWalletIds={"ALL"}
        explorerRecommendedWalletIds={[
          process.env.NEXT_PUBLIC_METAMASK_WALLET_ID as string,
          process.env.NEXT_PUBLIC_COINBASE_WALLET_ID as string,
        ]}
        ethereumClient={ethereumClient}
      />
    </>
  );
}
