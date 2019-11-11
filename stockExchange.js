const EventEmitter = require('events');
const StockExchange = new EventEmitter();
const fs = require('fs');
const moment = require("moment");
let rawdata = fs.readFileSync('11900_ce_1min.json');
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
        if (hours < 10) {
            transformedCandle.noTrade = true;
        }
        transformedCandle.lastCandle = lastCandle;
        const move = transformedCandle.close - (lastCandle ? lastCandle.close : 0);
        const upMove = move > 0 ? move : 0;
        let lastUpMoveAvg = lastCandle ? lastCandle.upMoveAvg : transformedCandle.close;
        let lastDownMoveAvg = lastCandle ? lastCandle.downMoveAvg : transformedCandle.close;

        const downMove = move < 0  ? Math.abs(move) : 0;
        const upMoveAvg = (upMove/14) + ((13*lastUpMoveAvg)/14);
        const downMoveAvg = (downMove/14) + ((13*lastDownMoveAvg)/14);
        const rs = upMoveAvg/downMoveAvg;
        const rsi = (100 - (100/ (1 + rs)));
        transformedCandle.upMoveAvg = upMoveAvg;
        transformedCandle.downMoveAvg = downMoveAvg;
        transformedCandle.rsi = rsi;
        if (hours === 15 && minutes >= 15) {
            transformedCandle.noTrade = true;
            StockExchange.emit('shutDown', transformedCandle);
        } else {
            StockExchange.emit('candleData', transformedCandle);
        }
        setTimeout(() => {
            const lastCandle = {...transformedCandle};
            if (lastCandle.lastCandle) {
                lastCandle.rsi1 = lastCandle.lastCandle.rsi;
                delete lastCandle.lastCandle;
            }
            emitStockData(candleData.candles[index +1], index+1, lastCandle);
        }, 10);
    } else {
        console.log("---data finished  -  shutting down---");
        StockExchange.emit('shutDown', lastCandle);
    }
   
}

emitStockData(candleData.candles[0], 0);

module.exports = StockExchange;