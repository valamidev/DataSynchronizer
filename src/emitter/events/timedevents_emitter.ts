import { EMITTER_EVENTS } from '../../constants';
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
        Emitter.emit(EMITTER_EVENTS.OrderBookSnapshot, lastSnapshot);
        Emitter.emit(EMITTER_EVENTS.CandlestickSnapshot, lastSnapshot);
      }
    }, 100);
  }
}

module.exports = new TimedEventsEmitter();
