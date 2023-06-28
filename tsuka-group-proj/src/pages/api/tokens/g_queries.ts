import axios from "axios";

export const G_QUERY_GetTokenPair = (pair_address: string) => {
  return axios.post(
    "https://graphql.bitquery.io",
    {
      query: `
    query getPairTokenPrice($pair_address: String)
    {
      ethereum(network: ethereum) {
        dexTrades(
          smartContractAddress: {is: $pair_address}
          options: {limit: 1}
        ) {
          exchange {
            fullName
          }
          token0: baseCurrency {
            symbol
            address
            name
          }
          token1: quoteCurrency {
            symbol
            address
            name
          }
        }
      }
    }
    `,
      variables: {
        pair_address,
      },
    },
    {
      headers: {
        "X-API-KEY": process.env.BITQUERY_API_KEY,
      },
    }
  );
};

export const G_QUERY_GetTokenVolume = (baseTokenAddress: string) => {
  return axios.post(
    "https://graphql.bitquery.io",
    {
      query: `
    query getTokenVolume($baseTokenAddress: String, $timeSince: ISO8601DateTime, $timeTill: ISO8601DateTime)
    {
      ethereum(network: ethereum) {
        dexTrades(baseCurrency: {is: $baseTokenAddress}
        time: {since: $timeSince till: $timeTill}
        ) {
          tradeAmount(in: USD)
        }
      }
    }
    `,
      variables: {
        baseTokenAddress,
        timeSince: new Date(
          new Date().getTime() - 24 * 60 * 60 * 1000
        ).toISOString(),
        timeTill: new Date().toISOString(),
      },
    },
    {
      headers: {
        "X-API-KEY": process.env.BITQUERY_API_KEY,
      },
    }
  );
};

export const G_QUERY_GetQuotePrice = async (
  baseCurrency: string,
  quoteCurrency: string,
  timeBefore: string
) => {
  return axios.post(
    "https://graphql.bitquery.io",
    {
      query: `
      query getQuotePrice($baseCurrency: String, $quoteCurrency: String, $timeBefore: ISO8601DateTime)
      {
        ethereum(network: ethereum) {
          dexTrades(
            baseCurrency: {is: $baseCurrency}
            quoteCurrency: {is: $quoteCurrency}
            options: {desc: ["block.timestamp.time", "transaction.index"], limit: 1}
            time: {before: $timeBefore}
          ) {
            block {
              height
              timestamp {
                time(format: "%Y-%m-%d %H:%M:%S")
              }
            }
            transaction {
              index
            }
            baseCurrency {
              symbol
            }
            quoteCurrency {
              symbol
            }
            quotePrice
          }
        }
      }
      `,
      variables: {
        baseCurrency,
        quoteCurrency,
        timeBefore,
      },
    },
    {
      headers: {
        "X-API-KEY": process.env.BITQUERY_API_KEY,
      },
    }
  );
};
