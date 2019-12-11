const fs = require('fs');
const _ = require('lodash');
const { getFibonaccitRacement, getLot, checkForPartialProfit, calculatePartialBookLotSize} = require('./utils.js');
let capital = 50000;
let holdingLot = null;
let fibonacciUpperLevel = [];
let fibonacciLowerLevel = [];
let partialBookedProfitCount = 0;
const checkFotTodayData = true;
const rawData = checkFotTodayData ? fs.readFileSync('./toadysNiftMovement.json'): fs.readFileSync('./VBOData.json');
const callPriceRawData = checkFotTodayData ? fs.readFileSync('./todaysNiftyCallPriceData.json') : fs.readFileSync('./call_12000.json');
const putPriceRawData = checkFotTodayData ? fs.readFileSync('./todaysNiftyPutPriceData.json') : fs.readFileSync('./put_12000.json');
const callData = _.groupBy(_.map(JSON.parse(callPriceRawData).data.candles, (data) => {
    return {
        time: data[0],
        open: Number(data[1]),
        high: Number(data[2]),
        low: Number(data[3]),
        close: Number(data[4]), 
    }
}), 'time');

const putData = _.groupBy(_.map(JSON.parse(putPriceRawData).data.candles, (data) => {
    return {
        time: data[0],
        open: Number(data[1]),
        high: Number(data[2]),
        low: Number(data[3]),
        close: Number(data[4]), 
    }
}), 'time');

const parsedData = JSON.parse(rawData);

let currentDate = null;
let currentORHigh = null;
let currentORLow = null;
let tradeType = null;
let tradeStartedPrice = null;
let profit = 0;
let totalProfit = 0;

const {
    data: {
        candles = []
    } = {},
} = parsedData;

const percentageChange = (final, initial) => {
    return ((final - initial)/initial)*100
}

const startTrade = candles => {
    let prevClose = 0;
    candles.forEach(candle => {

        const [timeStamp, open, high, low, close ] = candle;

        const date = new Date(timeStamp);
        const dateValue = date.getDate();
        const minute = date.getMinutes();
        const hour = date.getHours();
        const day = date.getDay();
        if(day === 4) {

        } else {
            if(currentDate && currentDate === dateValue) {
                if(!tradeType && close > currentORHigh && hour != 15 && (prevClose <= currentORHigh)) {
                    tradeType = 'ORBO';
                    tradeStartedPrice = callData[timeStamp][0].close;
                    const { lot, price } = getLot(capital, tradeStartedPrice, 75);
                    capital = capital - price;
                    holdingLot = lot;
                    console.log(`OR Break out done ^^^^^^^^^^^ ${timeStamp}  - ${tradeStartedPrice} buying ${holdingLot} lot in ${tradeStartedPrice} price with total ${price} investing`);

                } else if(!tradeType && close < currentORLow && hour !== 15  && (prevClose >= currentORLow)) {
                    tradeType =  'ORBD';
                    tradeStartedPrice = putData[timeStamp][0].close;
                    const { lot, price } = getLot(capital, tradeStartedPrice, 75);
                    capital = capital - price;
                    holdingLot = lot;
                    console.log(`OR Break down done ^^^^^^^^^^^ ${timeStamp}  - ${tradeStartedPrice}  buying ${holdingLot} lot in ${tradeStartedPrice} price total ${price} investing`);
                } else if(tradeType === 'ORBO') {
                    const currentOptionPrice = callData[timeStamp][0].close;
                    const margin = callData[timeStamp][0].close - tradeStartedPrice;
                    if(close <= currentORHigh) {
                        const percentageProfit = percentageChange(currentOptionPrice, tradeStartedPrice);
                        capital = capital + currentOptionPrice * holdingLot * 75;
                        console.log(`********EXIT from trade upside *********** at ${hour}: ${minute} -> percentageProfit is${percentageProfit}, selling ${holdingLot} lots in ${currentOptionPrice} price, available capital ${capital}`);
                        holdingLot = null;
                        tradeType = null;
                        profit += percentageProfit;
                        partialBookedProfitCount = 0;
                    } else if(partialBookedProfitCount === 0) {
                        const canBook = checkForPartialProfit(close, fibonacciUpperLevel, partialBookedProfitCount, true);
                        if(canBook) {
                            const partialBookLot = calculatePartialBookLotSize(holdingLot);
                            capital = capital + partialBookLot * 75 * currentOptionPrice;
                            holdingLot = holdingLot - partialBookLot;
                            partialBookedProfitCount = partialBookedProfitCount + 1;
                            console.log(`booking ${partialBookedProfitCount} time partial lot with ${partialBookLot} lot, now capital is ${capital} and holdingLot is ${holdingLot}`)
                        }
                    }
                } else if(tradeType === 'ORBD') {
                    const margin = putData[timeStamp][0].close - tradeStartedPrice;
                    const currentOptionPrice = putData[timeStamp][0].close;
                    if(close >= currentORLow) {
                        const percentageProfit = percentageChange(currentOptionPrice, tradeStartedPrice);
                        capital = capital + currentOptionPrice * holdingLot * 75;
                        console.log(`********EXIT from trade downside ${tradeType}*********** at ${hour}: ${minute}  -> ${percentageProfit} selling ${holdingLot} lots in ${currentOptionPrice} price, available capital ${capital}`);
                        holdingLot = null;
                        tradeType = null;
                        profit += percentageProfit;
                        partialBookedProfitCount = 0;
                    } else if(partialBookedProfitCount < 3) {
                        const canBook = checkForPartialProfit(close, fibonacciLowerLevel, partialBookedProfitCount, false);
                        if(canBook) {
                            const partialBookLot = calculatePartialBookLotSize(holdingLot);
                            capital = capital + partialBookLot * 75 * currentOptionPrice;
                            holdingLot = holdingLot - partialBookLot;
                            partialBookedProfitCount = partialBookedProfitCount + 1;
                            console.log(`booking ${partialBookedProfitCount} time partial lot with ${partialBookLot} lot in ${currentOptionPrice} price, now capital is ${capital} and holdingLot is ${holdingLot}`)
                        }
                    }
                }
                if( hour === 15 && minute > 10 ) {
                    if(tradeType === 'ORBO') {
                        const currentOptionPrice = callData[timeStamp][0].close;
                        const percentageProfit = percentageChange(currentOptionPrice , tradeStartedPrice);
                        profit += percentageProfit;
                        capital = capital + currentOptionPrice * holdingLot * 75;
                        console.log(`last profit  ${percentageProfit} and selling ${holdingLot} lots in ${currentOptionPrice} price, available capital ${capital}`);
                    } else if(tradeType === 'ORBD'){
                        const currentOptionPrice = putData[timeStamp][0].close;
                        const percentageProfit = percentageChange(currentOptionPrice, tradeStartedPrice);
                        profit += percentageProfit;
                        capital = capital + currentOptionPrice * holdingLot * 75;
                        console.log(`last profit  ${percentageProfit} selling ${holdingLot} lots in ${currentOptionPrice} price, available capital ${capital}`);
                    }
                    console.log(`*************** Day End with ${profit} profit***********`)
                    tradeType = null;
                    currentORHigh = null;
                    currentORLow = null;
                    holdingLot = null;
                    totalProfit = totalProfit + profit;
                    profit = 0;
                    partialBookedProfitCount = 0;
                }
                prevClose = close;
            } else {
                console.log(hour, minute)
                if( hour === 9 && minute === 15 ) {
                    console.log('\x1b[36m%s\x1b[0m',`-------------------- Starting For ${date.toDateString()} --------------------`);
                    console.log(`opening range for today is ${high - low} point ${high} -  ${low}`);
                    currentORHigh = high;
                    currentORLow = low;
                    currentDate = dateValue;
                    profit = 0;
                    tradeType = null;
                    const range = high - low;
                    fibonacciUpperLevel = getFibonaccitRacement(low, range, true);
                    fibonacciLowerLevel = getFibonaccitRacement(high, range, false);
                    console.log("fibonacciLevel for today is", '\n', fibonacciUpperLevel, '\n', fibonacciLowerLevel, '\n\n\n\n\n\n\n');
                    partialBookedProfitCount = 0;
                }
            }
        }
    });
    console.log(`total Profit ${totalProfit}`)
}
startTrade(candles);
