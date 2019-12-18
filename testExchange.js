const moment = require('moment');
const EventEmitter = require('events');
const fs = require('fs');
const _ = require('lodash');
const emitter = new EventEmitter();
let rowData = JSON.parse(fs.readFileSync('./testData/nifty.json')).data.candles;

const callData = _.groupBy(_.map(JSON.parse(fs.readFileSync('./testData/ce_12050.json')).data.candles, (data) => {
    return {
        time: data[0],
        open: Number(data[1]),
        high: Number(data[2]),
        low: Number(data[3]),
        close: Number(data[4]), 
    }
}), 'time');

const putData = _.groupBy(_.map(JSON.parse(fs.readFileSync('./testData/pe_12000.json')).data.candles, (data) => {
    return {
        time: data[0],
        open: Number(data[1]),
        high: Number(data[2]),
        low: Number(data[3]),
        close: Number(data[4]), 
    }
}), 'time');


function testExchange() {
    const buy = () => {
        return Promise.resolve("wew");
    };
    const sell = () => {
        return  Promise.resolve("wew");
    };

    const emitData = (index, previousCandlePrice) => {
        const candle = {};
        const currCandle = rowData[index];
        candle.time = currCandle[0];
        candle.callCandle = callData[currCandle[0]][0];
        candle.putCandle = putData[currCandle[0]][0];
        candle.open = currCandle[1];
        candle.high = currCandle[2];
        candle.low = currCandle[3];
        candle.close = currCandle[4];
        candle.previousClose = previousCandlePrice;

        setTimeout(() => {
            emitter.emit("5-minute-candle", candle);
            emitData(index + 1, candle.close);
        }, 10);
    };
    emitData(0, null);

    return {
        buy,
        sell,
        emitter,
    }

}

const exchange = testExchange();

module.exports = exchange;