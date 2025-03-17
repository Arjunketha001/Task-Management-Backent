import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 }); // TTL in seconds

export const cacheSet = (key, value) => {
  cache.set(key, value);
};

export const cacheGet = (key) => {
  return cache.get(key);
};
