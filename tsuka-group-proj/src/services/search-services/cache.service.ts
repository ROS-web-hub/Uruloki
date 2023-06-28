import { CacheType, SearchToken } from '@/types';
import Cache from "../../lib/api/cache";
import axios from 'axios';
import { PrismaClient } from '@prisma/client'
// TTL definition
const TTL = 5 * 60 * 1000 * 3600;

let cachedTokens: CacheType[] = [];

function isCacheExpired(token: CacheType): boolean {
  const now = Date.now();
  return now > token.timestamp + token.ttl;
}

export async function searchTokensByName_DB(name: string): Promise<CacheType[]> {
  try {
    const now = Date.now();
    // Check if data is cached and still valid
    if (cachedTokens.length == 0) {
      await loadCacheData();
      if (cachedTokens.length == 0) {
        updateCacheDB(now);
        await loadCacheData();
      }
    }
    else if (isCacheExpired(cachedTokens[0])) {
      updateCacheDB(now);
    }

    const tokens = cachedTokens
      .filter((coin: any) => coin.name.toLowerCase().includes(name.toLowerCase()) || coin.symbol.toLowerCase().includes(name.toLowerCase()))
      .sort((a: any, b: any) => {
        if (a.name.toLowerCase().startsWith(name.toLowerCase()))
          return -1; // move a to the front
        if (b.name.toLowerCase().startsWith(name.toLowerCase()))
          return 1; // move b to the front
        if (b.name.toLowerCase() > a.name.toLowerCase())
          return -1; // move a to the front
        if (b.name.toLowerCase() < a.name.toLowerCase())
          return 1; // move b to the front
        return 0; // keep the order of a and b unchanged
      });

    return tokens;
  } catch (error) {
    console.error(`Error searching tokens by name: ${error}`);
    return [];
  }
}

function isSearchToken(token: SearchToken | null): token is SearchToken {
  return token !== null;
}

async function updateCacheDB(now: number) {
  const prisma = new PrismaClient();
  await Cache.deleteCache();
  for (let i = 0; i < cachedTokens.length; i++) {
    await Cache.saveCache(cachedTokens[i]);

  }
}

async function loadCacheData() {
  const prisma = new PrismaClient();
  
  const caches = await Cache.findCache();

  if (caches.length == 0) {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
    const tokens = response.data;

    let id = 1;
    cachedTokens = await Promise.all(tokens.map(async (coin: any) => {
      // console.log(coin);
      return {
        id: id++,
        timestamp: Date.now(),
        data_key: coin.id,
        cached_data: coin.string,
        ttl: TTL
      } as CacheType;
    }));
  } else {
    cachedTokens = [];
    for (let i = 0; i < caches.length; i++) {
      cachedTokens.push(caches[i] as CacheType);
    }
  }
}