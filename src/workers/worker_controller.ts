/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-inner-declarations */
'use strict';

import { logger } from '../logger';
import { Emitter } from '../emitter/emitter';

import { Worker, isMainThread } from 'worker_threads';

// We need to use the .js worker file in any case
const relativePath = process.env.DEBUG_WORKER === 'true' ? '/../../build/workers' : '';

const workerClass = __dirname + `${relativePath}/worker.js`;
const workerConfig = { workerData: '' };

export const controller = {
  startThread: (): void => {
    if (isMainThread) {
      const workerThhread = new Worker(workerClass, workerConfig);

      // On message
      workerThhread.on('message', time => {
        logger.verbose(`TradesCandlestick done at: ${time}`);
      });

      // On error
      workerThhread.on('error', e => logger.error(`Worker error with exit code: `, e));

      // On exit
      workerThhread.on('exit', code => logger.error(`Worker stopped with exit code: `, code));

      // Transfer events into the worker thread
      Emitter.on('TradesCandlestickSnapshot', lastSnapshot => {
        logger.verbose('TradesCandlestick snapshot');
        workerThhread.postMessage(lastSnapshot);
      });
    }
  },
};
