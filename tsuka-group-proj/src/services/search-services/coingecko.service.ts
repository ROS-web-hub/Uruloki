import { CacheType, SearchToken } from '@/types';
import axios from 'axios';
import { checkIfTokenIsErc20 } from './etherscan.service';
import { checkIfTokenIsOnUniswap } from './uniswap.service';

// Simple in-memory cache
const cache = {
  data: [],
  lastFetch: 0,
  expiresIn: 5 * 60 * 1000, // Cache expires in 5 minutes
};
const tokens = [];

export async function searchTokensByName(name: string): Promise<SearchToken[]> {
  console.log("%c Line:15 🍏 name", "color:#465975", name);
  try {
    const now = Date.now();
    // Check if data is cached and still valid
    if (cache.data.length === 0 || now - cache.lastFetch > cache.expiresIn) {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
      cache.data = response.data;
      cache.lastFetch = now;
    }
    // console.log("cache.data",cache.data);
    const tokens = cache.data
      .filter((coin: any) => coin.name.toLowerCase().includes(name.toLowerCase())||coin.symbol.toLowerCase().includes(name.toLowerCase()))
      .sort((a: any, b: any) => {
        if(a.name.toLowerCase().startsWith(name.toLowerCase()))
          return -1; // move a to the front
        if(b.name.toLowerCase().startsWith(name.toLowerCase()))
          return 1; // move b to the front
        if(b.name.toLowerCase() > a.name.toLowerCase())
          return -1; // move a to the front
        if(b.name.toLowerCase() < a.name.toLowerCase())
          return 1; // move b to the front
        return 0; // keep the order of a and b unchanged
      });
    const erc20Tokens: (SearchToken | null)[] = await Promise.all(tokens.map(async (coin: any) => {
      const id = coin.id;
      const tokenName = coin.name;
      const symbol = coin.symbol;
      const address = coin.platforms.ethereum;
      
      // const isErc20 = await checkIfTokenIsErc20(address);
      const isErc20 = true;
      const isOnUniswap = await checkIfTokenIsOnUniswap(address);

      if(isErc20 && isOnUniswap)
        return {
          id,
          name: tokenName,
          symbol,
          address,
        } as SearchToken;
      else
       return null;
    }));

    const erc20Tokens1: SearchToken[] = erc20Tokens.filter(isSearchToken).filter(token=>token.address);
    return erc20Tokens1;
  } catch (error) {
    console.error(`Error searching tokens by name: ${error}`);
    return [];
  }
}

function isSearchToken(token: SearchToken | null): token is SearchToken {
  return token !== null;
}