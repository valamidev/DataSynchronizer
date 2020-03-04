'use strict';

import { Emitter } from '../../emitter/emitter';

import { RedisPub } from '../redis';

// Broadcast final candle updates
Emitter.on('CandleUpdateFinal', (exchange, interval, candle) => {
  setImmediate(() => {
    RedisPub.publish('CandleUpdateFinal', JSON.stringify({ exchange, interval, candle }));
  });
});

/* Receive code */
/*
const { Redis } = require("../index")


Redis.subscribe("CandleUpdate", function(err, count) {
 
})

Redis.on("message", function(channel, message) {
  
})
*/
