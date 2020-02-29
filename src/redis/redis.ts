import IORedis, { RedisOptions } from 'ioredis';

const redisConfig: RedisOptions = {
  host: process.env.REDIS_HOST, // Redis host
  port: process.env.REDIS_PORT === undefined ? 6379 : parseInt(process.env.REDIS_PORT, 10), // Redis port
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: process.env.REDIS_AUTH,
  db: process.env.REDIS_DB_ID === undefined ? 0 : parseInt(process.env.REDIS_DB_ID, 10),
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

//
// https://github.com/luin/ioredis#pubsub
//
// Subscription connection it cannot be used for Publish!
export const Redis = new IORedis(redisConfig);
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
Redis.publish = () => {
  throw new Error('Subscription connection cannot be used for publish!');
};
// Publish connection it can be used only for Publish!
export const RedisPub = new IORedis(redisConfig);
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
RedisPub.subscribe = () => {
  throw new Error('Publisher connection cannot be used for subscribe!');
};
