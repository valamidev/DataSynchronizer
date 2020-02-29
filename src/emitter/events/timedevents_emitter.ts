'use strict';

import { Emitter } from '../emitter';

class TimedEventsEmitter {
  constructor() {
    // Snapshot Heartbeat
    const snapshotHeartbeat = Number(process.env.snapshotHeartbeat);
    let lastSnapshot = 0;

    setInterval(() => {
      const time = Date.now();
      if (time > lastSnapshot + snapshotHeartbeat) {
        // Calculate round time for snapshot match with Candle timers
        lastSnapshot = time - (time % snapshotHeartbeat);
        Emitter.emit('OrderbookSnapshot', lastSnapshot);
        Emitter.emit('TradesCandlestickSnapshot', lastSnapshot);
      }
    }, 100);
  }
}

module.exports = new TimedEventsEmitter();
