const getLiveDexTrades = (
  tradeSide: string,
  baseAddress: string
): { query: string } => {
  return {
    query: `
    subscription {
      EVM(network: eth) {
        DEXTrades(
          where: {Trade: {Buy: {Currency: {SmartContract: {is: "${baseAddress}"}}}}}
        ) {
          Trade {
            ${tradeSide} {
              Currency {
                Symbol
                SmartContract
              }
              Price
              Amount
            }
          }
        }
      }
    }
    `,
  };
};

export default getLiveDexTrades;
