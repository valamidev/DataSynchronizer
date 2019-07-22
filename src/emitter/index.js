"use strict";

const EventEmitter = require("events");
// Keep memory leak as a possible outcome!
const Emitter = new EventEmitter().setMaxListeners(10000);

module.exports = Emitter;
