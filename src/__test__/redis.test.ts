/* eslint-disable no-undef */
require('dotenv').config();

import { Redis, RedisPub } from '../redis/redis';

describe('Redis Test', () => {
  it('Redis Connection test', async () => {
    Redis.set('foo_bar_test', 'bar');
    const result = await Redis.get('foo_bar_test');
    Redis.del('foo_bar_test');

    expect(result).toBe('bar');
  });

  it('Redis publish disabled test', async () => {
    expect(() => {
      Redis.publish('news', 'Hello world!');
    }).toThrow();
  });

  it('Redis subscribe disabled test', async () => {
    expect(() => {
      RedisPub.subscribe();
    }).toThrow();
  });
});
