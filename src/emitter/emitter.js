"use strict"

const EventEmitter = require("eventemitter3")
// Keep memory leak as a possible outcome!
const Emitter = new EventEmitter()

module.exports = Emitter
