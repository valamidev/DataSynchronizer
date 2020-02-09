/* eslint-disable no-inner-declarations */
'use strict';

const { logger } = require('../logger');
const { Emitter } = require('../emitter/emitter');

const { Worker, isMainThread } = require('worker_threads');

// We need to use the .js worker file in any case
const relativePath = process.env.DEBUG_WORKER === 'true' ? '/../../build/workers' : '';

const worker_class = __dirname + `${relativePath}/worker.js`,;
const worker_config = { workerData: '' };

if (isMainThread) {
  const controller = {
    start_thread: () => {
      const worker = new Worker(worker_class, worker_config);

      // On message
      worker.on('message', time => {
        logger.verbose(`TradesCandlestick done at: ${time}`);
      });

      // On error
      worker.on('error', e => logger.error(`Worker error with exit code: `, e));

      // On exit
      worker.on('exit', code => logger.error(`Worker stopped with exit code: `, code));

      // Transfer events into the worker thread
      Emitter.on('TradesCandlestickSnapshot', last_snapshot => {
        logger.verbose('TradesCandlestick snapshot');
        worker.postMessage(last_snapshot);
      });
    },
  };
  module.exports = controller;
}
