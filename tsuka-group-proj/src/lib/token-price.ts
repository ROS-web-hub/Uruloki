import {
  G_QUERY_GetQuotePrice,
  G_QUERY_GetTokenPair,
} from "@/pages/api/tokens/g_queries";

export const getTokenPrice = async (
  pair_address: string,
  yesterday: boolean = false
) => {
  const timeBefore = (
    yesterday
      ? new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      : new Date()
  ).toISOString();
  const tokenPairResponse = await G_QUERY_GetTokenPair(pair_address);
  if (!tokenPairResponse.data.data.ethereum.dexTrades[0]) {
    return { base_price: 0, quote_price: 0 };
  }
  const {
    token0: { address: token0Address },
    token1: { address: token1Address },
  } = tokenPairResponse.data.data.ethereum.dexTrades[0];
  let tokenAddress, pairedTokenAddress;
  if (
    [
      process.env.WETH_ADDR,
      process.env.DAI_ADDR,
      process.env.USDT_ADDR,
      process.env.USDC_ADDR,
    ].includes(String(token0Address).toLowerCase())
  ) {
    tokenAddress = token1Address;
    pairedTokenAddress = token0Address;
  } else {
    tokenAddress = token0Address;
    pairedTokenAddress = token1Address;
  }

  const quotePriceResponse = await G_QUERY_GetQuotePrice(
    tokenAddress,
    pairedTokenAddress,
    timeBefore
  );
  if (!quotePriceResponse.data.data.ethereum.dexTrades[0]) {
    return { base_price: 0, quote_price: 0 };
  }
  const { quotePrice: basePrice } =
    quotePriceResponse.data.data.ethereum.dexTrades[0];
  if (
    String(pairedTokenAddress).toLowerCase() === process.env.WETH_ADDR ||
    String(pairedTokenAddress).toLowerCase() === process.env.DAI_ADDR
  ) {
    const baseQuotePrice = basePrice;
    const baseCurrency = pairedTokenAddress;
    const quoteCurrency =
      pairedTokenAddress === process.env.WETH_ADDR
        ? process.env.USDC_ADDR
        : process.env.USDT_ADDR;
    const baseQuotePriceResponse = await G_QUERY_GetQuotePrice(
      baseCurrency,
      quoteCurrency as string,
      timeBefore
    );
    if (!baseQuotePriceResponse.data.data.ethereum.dexTrades[0]) {
      return { base_price: 0, quote_price: 0 };
    }
    const { quotePrice: quoteQuotePrice } =
      baseQuotePriceResponse.data.data.ethereum.dexTrades[0];

    return {
      base_price: baseQuotePrice * quoteQuotePrice,
      quote_price: quoteQuotePrice as number,
    };
  }
  return { base_price: basePrice, quote_price: 1 };
};
