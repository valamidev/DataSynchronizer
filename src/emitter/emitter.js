"use strict"

const EventEmitter = require("eventemitter3")
const Emitter = new EventEmitter()

// Snapshot Heartbeat
const snapshot_heartbeat = Number(process.env.snapshot_heartbeat)
let last_snapshot = 0

setInterval(() => {
  let time = Date.now()
  if (time > last_snapshot + snapshot_heartbeat) {
    // Calculate round time for snapshot match with Candle timers
    last_snapshot = time - (time % snapshot_heartbeat)
    Emitter.emit("OrderbookSnapshot", last_snapshot)
  }
}, 100)

module.exports = Emitter
