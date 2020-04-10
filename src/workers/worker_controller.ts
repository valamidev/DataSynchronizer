/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-inner-declarations */

import { Worker, isMainThread } from 'worker_threads';
import { logger } from '../logger';
import { Emitter } from '../emitter/emitter';

// We need to use the .js worker file in any case
const relativePath = process.env.DEBUG_WORKER === 'true' ? '/../../build/workers' : '';

const workerClass = `${__dirname}${relativePath}/worker.js`;
const workerConfig = { workerData: '' };

enum threadStatus {
  stopped = 'STOPPED',
  loading = 'LOADING',
  ready = 'READY',
}

export class ThreadManager {
  private threadStatus: string;
  private workerThread: Worker | undefined;

  constructor() {
    this.threadStatus = threadStatus.stopped;

    this.startThread();
    this.threadWatcher();
  }

  private threadWatcher(): void {
    setInterval(() => {
      if (this.threadStatus === threadStatus.stopped || this.workerThread === undefined) {
        logger.verbose('ThreadWatcher restart');

        this.startThread();
      }
    }, 5000);
  }

  startThread(): void {
    if (isMainThread) {
      this.workerThread = new Worker(workerClass, workerConfig);

      this.threadStatus = threadStatus.loading;

      // On online
      this.workerThread.on('online', () => {
        logger.verbose('workerThread online');

        this.threadStatus = threadStatus.ready;
      });

      // On message
      this.workerThread.on('message', (time) => {
        logger.verbose(`TradesCandlestick done at: ${time}`);
      });

      // On error
      this.workerThread.on('error', (e) => {
        this.threadStatus = threadStatus.stopped;
        logger.error('Worker error with exit code: ', e);
      });

      // On exit
      this.workerThread.on('exit', (code) => {
        this.threadStatus = threadStatus.stopped;
        logger.error('Worker stopped with exit code: ', code);
      });

      // Transfer events into the worker thread
      Emitter.on('TradesCandlestickSnapshot', (lastSnapshot) => {
        logger.verbose('TradesCandlestick snapshot');
        if (this.workerThread && this.threadStatus === threadStatus.ready) {
          this.workerThread.postMessage(lastSnapshot);
        }
      });
    }
  }
}
