const EventEmitter = require('events');
const StockExchange = new EventEmitter();
const _ =  require('lodash');

const fs = require('fs');
const moment = require("moment");
let rawdata = fs.readFileSync('./data/nifty_1_min.json');
const callData = _.groupBy(_.map(JSON.parse(fs.readFileSync('./data/nifty_ce_1_min_11900.json')).data.candles, (data) => {
    return {
        time: data[0],
        open: Number(data[1]),
        high: Number(data[2]),
        low: Number(data[3]),
        close: Number(data[4]), 
    }
}), 'time');

const putData = _.groupBy(_.map(JSON.parse(fs.readFileSync('./data/nifty_pe_1_min_11900.json')).data.candles, (data) => {
    return {
        time: data[0],
        open: Number(data[1]),
        high: Number(data[2]),
        low: Number(data[3]),
        close: Number(data[4]), 
    }
}), 'time');
let candleData = JSON.parse(rawdata).data;


function emitStockData(data, index, lastCandle = null) {
    if(index < candleData.candles.length) {
        const transformedCandle = {
            time: data[0],
            open: Number(data[1]),
            high: Number(data[2]),
            low: Number(data[3]),
            close: Number(data[4]),            
        }
        const hours = moment(data[0]).hours();
        const minutes = moment(data[0]).minutes(); 
        if (hours < 11) {
            transformedCandle.noTrade = true;
        }
        transformedCandle.lastCandle = lastCandle;
         // console.log(transformedCandle.time);   
        transformedCandle.call  = callData[transformedCandle.time][0]  ||  {};
        transformedCandle.put  = putData[transformedCandle.time][0] || {};

        const move = transformedCandle.close - (lastCandle ? lastCandle.close : 0);
        const upMove = move > 0 ? move : 0;
        let lastUpMoveAvg = lastCandle ? lastCandle.upMoveAvg : transformedCandle.close;
        let lastDownMoveAvg = lastCandle ? lastCandle.downMoveAvg : transformedCandle.close;

        const downMove = move < 0  ? Math.abs(move) : 0;
        const period = 14;
        const upMoveAvg = (upMove/period) + (((period -1)*lastUpMoveAvg)/period);
        const downMoveAvg = (downMove/period) + (((period -1)*lastDownMoveAvg)/period);
        const rs = upMoveAvg/downMoveAvg;
        const rsi = (100 - (100/ (1 + rs)));
        transformedCandle.upMoveAvg = upMoveAvg;
        transformedCandle.downMoveAvg = downMoveAvg;
        transformedCandle.rsi = rsi;
        if (hours >= 14 && minutes >= 0) {
            transformedCandle.noTrade = true;
            if (hours === 15 && minutes === 20) {
                StockExchange.emit('shutDown', transformedCandle);
            } else {
                StockExchange.emit('candleData', transformedCandle);
            }
        }
        else {
            StockExchange.emit('candleData', transformedCandle);
        }
        setTimeout(() => {
            const lastCandle = {...transformedCandle};
            if (lastCandle.lastCandle) {
                lastCandle.rsi1 = lastCandle.lastCandle.rsi;
                delete lastCandle.lastCandle;
            }
            emitStockData(candleData.candles[index +1], index+1, lastCandle);
        }, 1);
    } else {
        console.log("---data finished  -  shutting down---");
        StockExchange.emit('shutDown', lastCandle);
    }
   
}

emitStockData(candleData.candles[0], 0);

module.exports = StockExchange;
// { st: 104, lp: 22, hp: 6 }
