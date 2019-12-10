const fs = require('fs');
const _ = require('lodash');
const rawData = fs.readFileSync('./VBOData.json');
const callData = _.groupBy(_.map(JSON.parse(fs.readFileSync('./call_12000.json')).data.candles, (data) => {
    return {
        time: data[0],
        open: Number(data[1]),
        high: Number(data[2]),
        low: Number(data[3]),
        close: Number(data[4]), 
    }
}), 'time');

const putData = _.groupBy(_.map(JSON.parse(fs.readFileSync('./put_12000.json')).data.candles, (data) => {
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
console.log(candles.length);

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
                    console.log(`OR Break out done ^^^^^^^^^^^ ${timeStamp}  - ${tradeStartedPrice}`);

                } else if(!tradeType && close < currentORLow && hour !== 15  && (prevClose >= currentORLow)) {
                    tradeType =  'ORBD';
                    tradeStartedPrice = putData[timeStamp][0].close;
                    console.log(`OR Break down done ^^^^^^^^^^^ ${timeStamp}  - ${tradeStartedPrice}`);
                } else if(tradeType === 'ORBO') {
                    const margin = callData[timeStamp][0].close - tradeStartedPrice;
                    if(close <= currentORHigh) {
                        const percentageProfit = percentageChange(callData[timeStamp][0].close, tradeStartedPrice);
                        console.log(`********EXIT from trade upside *********** at ${hour}: ${minute} -> ${percentageProfit}`)
                        tradeType = null;
                        profit += percentageProfit;
                    } 
                } else if(tradeType === 'ORBD') {
                    const margin = putData[timeStamp][0].close - tradeStartedPrice;

                    if(close >= currentORLow) {
                        const percentageProfit = percentageChange(putData[timeStamp][0].close, tradeStartedPrice);
                        console.log(`********EXIT from trade downside*********** at ${hour}: ${minute}  -> ${percentageProfit}`)
                        console.log(tradeType);
                        tradeType = null;
                        profit += percentageProfit;  
                    }
                }
                if( hour === 15 && minute > 0 ) {
                    if(tradeType === 'ORBO') {
                        const percentageProfit = percentageChange(callData[timeStamp][0].close , tradeStartedPrice);
                        profit += percentageProfit;
                        console.log(`last profit  ${percentageProfit}`)
                    } else if(tradeType === 'ORBD'){
                        const percentageProfit = percentageChange(putData[timeStamp][0].close, tradeStartedPrice);
                        profit += percentageProfit;
                        console.log(`last profit  ${percentageProfit}`)
                    }
                    console.log(`*************** Day End with ${profit} profit***********`)
                    tradeType = null;
                    currentORHigh = null;
                    currentORLow = null;

                    totalProfit = totalProfit + profit;
                    profit = 0;
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
                }
            }
        }
    });
    console.log(`total Profit ${totalProfit}`)
}
startTrade(candles);
