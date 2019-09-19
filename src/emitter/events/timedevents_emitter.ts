"use strict"

import {Emitter} from '../emitter'

class TimedEvents_Emitter {
  constructor() {
    // Snapshot Heartbeat
    const snapshot_heartbeat = Number(process.env.snapshot_heartbeat)
    let last_snapshot = 0

    setInterval(() => {
      let time = Date.now()
      if (time > last_snapshot + snapshot_heartbeat) {
        // Calculate round time for snapshot match with Candle timers
        last_snapshot = time - (time % snapshot_heartbeat)
        Emitter.emit("OrderbookSnapshot", last_snapshot)
        Emitter.emit("TradesCandlestickSnapshot", last_snapshot)
      }
    }, 100)
  }
}

module.exports = new TimedEvents_Emitter()
