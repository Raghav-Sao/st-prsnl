const EventEmitter = require('events');
const StockExchange = new EventEmitter();
const _ =  require('lodash');

const fs = require('fs');
const moment = require("moment");
let rawdata = fs.readFileSync('./data/nifty_15_min_11800ce.json');
const callData = _.groupBy(_.map(JSON.parse(fs.readFileSync('./data/week/11900_ce.json')).data.candles, (data) => {
    return {
        time: data[0],
        open: Number(data[1]),
        high: Number(data[2]),
        low: Number(data[3]),
        close: Number(data[4]), 
    }
}), 'time');

const putData = _.groupBy(_.map(JSON.parse(fs.readFileSync('./data/week/12000_pe.json')).data.candles, (data) => {
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
        // if (hours < 10) {
        //     transformedCandle.noTrade = true;
        // }
        transformedCandle.lastCandle = lastCandle;
         // console.log(transformedCandle.time);   
        // transformedCandle.call  = callData[transformedCandle.time][0]  ||  {};
        // transformedCandle.put  = putData[transformedCandle.time][0] || {};

        const move = transformedCandle.close - (lastCandle ? lastCandle.close : 0);
        const upMove = move > 0 ? move : 0;
        let lastUpMoveAvg = lastCandle ? lastCandle.upMoveAvg : transformedCandle.close;
        let lastDownMoveAvg = lastCandle ? lastCandle.downMoveAvg : transformedCandle.close;
        let lastUpMoveAvg21 = lastCandle ? lastCandle.upMoveAvg21 : transformedCandle.close;
        let lastDownMoveAvg21 = lastCandle ? lastCandle.upMoveAvg21 : transformedCandle.close;

        const downMove = move < 0  ? Math.abs(move) : 0;
        const period = 14;
        const upMoveAvg = (upMove/period) + (((period -1)*lastUpMoveAvg)/period);
        const downMoveAvg = (downMove/period) + (((period -1)*lastDownMoveAvg)/period);
        const upMoveAvg21 = (upMove/21) + (((21 -1)*lastUpMoveAvg21)/21);
        const downMoveAvg21 = (downMove/21) + (((21 -1)*lastDownMoveAvg21)/21);

        const rs = upMoveAvg/downMoveAvg;
        const rs21 = upMoveAvg21/downMoveAvg21;
        const rsi = (100 - (100/ (1 + rs)));
        const rsi21 = rsi;
        transformedCandle.upMoveAvg = upMoveAvg;
        transformedCandle.downMoveAvg = downMoveAvg;
        transformedCandle.upMoveAvg21 = upMoveAvg21;
        transformedCandle.downMoveAvg21 = downMoveAvg21;
        transformedCandle.rsi = rsi;
        transformedCandle.rsi21 = rsi21;

        if (hours >= 15 && minutes >= 0) {
            transformedCandle.noTrade = true;
            if (hours === 15 && minutes === 15) {
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
