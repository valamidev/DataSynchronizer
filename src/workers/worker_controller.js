/* eslint-disable no-inner-declarations */
'use strict';

const { logger } = require('../logger');
const { Emitter } = require('../emitter/emitter');

const { Worker, isMainThread } = require('worker_threads');

// Experiment worker
const worker_class = __dirname + '/worker.js';
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
