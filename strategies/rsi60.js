const moment = require('moment');
const EventEmitter = require('events');
const fs = require('fs');
const emitter = new EventEmitter();
const utils = require('../utils');

const MAX_NUMBER = 200000;
const defaultNoNewTradeTime = {minute: 45, hour: 14};
const defaultShutDownTime = {minute: 10, hour: 15};
const defaultTickInterval = 9000;
let rsi;
let previousRSI;
const TARGET = process.argv[5];
let triggerPrice = null;
let INSTRUMENT_TOKEN = parseInt(process.argv[3]);
let CHART_SYMBOL = process.argv[4];

function rsi60({ capital, tickInterval, noNewTradeTime , shutDownTime}, Exchange, getHistoricalData) {
    noNewTradeTime = noNewTradeTime || defaultNoNewTradeTime;
    shutDownTime = shutDownTime || defaultShutDownTime;
    tickInterval = tickInterval || defaultTickInterval;

    const tickEventName = getEventName(tickInterval);

    /* change this value to morning 9:15 candle incase of restart */
    let activeTrade = null;
    let stopLoss = null;
    let target = null;
    let lots;
    let currentCandle;
    let totalLots;
    let candleCount = 0;


    const tradeStartCondition = (candle) => {
        if (candle.rsi > 60 && candle.previousRSI < 60 ) {
            return 'BUY';
        }
    };

    const stopLossCondition = (candle, stopLoss) => {
        console.log("stopLossCondition", candle.close, stopLoss)
        return candle.close <= stopLoss
    }

    const targetCondition = (candle, target) => {
        console.log("targetCondition", candle.close, target)

        return candle.close >= target;
    }

    const reCalculateTarget = (candle) => {
        let toDate = new Date(candle.time);
        toDate.setMinutes(toDate.getMinutes()+14);
        toDate = new Date(toDate);
        let fromDate = new Date(candle.time);
        fromDate = new Date(fromDate.setDate(fromDate.getDate()-130));
        getHistoricalData({instrumentToken: 256265, interval: '60minute', toDate, fromDate}).then(data=> {
            let lastCandle;
            data.forEach( (candle, index )=> {
                lastCandle = utils.includeRSI(candle, lastCandle);
                if(data.length - 2 === index) {
                    console.log("calculated historical RSI, -------------->", lastCandle.rsi, new Date(candle.date))
                }
            })
            console.log("calculated current RSI, -------------->", lastCandle.rsi, moment(lastCandle.date).utcOffset("+05:30").format())
            if(lastCandle.rsi > 60 && CHART_SYMBOL.includes('CE')) {
                target = triggerPrice * 1.8;
                console.log("target reset to ---->", target);
            }
            if(lastCandle.rsi < 40 && CHART_SYMBOL.includes('PE')) {
                target = triggerPrice * 1.8;
                console.log("target reset to ---->", target);
            }
        })
    }

    const handleEachTick = tick => {
        console.log(tick, "handleEachTick");
        const lastPrice = tick && tick[0] && tick[0].last_price;
        console.log(tick, "handleEachTick", lastPrice);
        if(!lastPrice) {
            return;
        }
        const candle = {
            close: lastPrice
        }
        if (stopLossCondition(candle, stopLoss)) {
            console.log({stopLoss}, "achived")
            emitter.emit("endTrade", {
                candle,
                tradeType: activeTrade,
                lots,
                capital,
                event: "endTrade",
                // rsi: candle.rsi,
                // previousRSI: candle.previousRSI,
            });
            return;
        }
        if(targetCondition(candle, target)) {
            console.log({target}, "achived")
            emitter.emit("endTrade", {
                candle,
                tradeType: activeTrade,
                lots,
                capital,
                event: "profitBooking",
                profitBooking: true
                // rsi: candle.rsi,
                // previousRSI: candle.previousRSI,
            });
            return;
        }
        
    }

    const handler = (candle) => {
        currentCandle = candle;
        const time = moment(candle.time).utcOffset("+05:30");
        const hour = time.hours();
        const minute = time.minutes();

        console.log(`hour - ${hour} minute ${minute}`, {INSTRUMENT_TOKEN}, {CHART_SYMBOL});
        console.log('candleCount', candleCount);
        console.log('15_min_candle', candle);
        candleCount++; 

        if (isShutDownTime({hour, minute}, shutDownTime)) {
            if (activeTrade) {
                emitter.emit("endTrade", {
                    candle,
                    tradeType: activeTrade,
                    lots,
                    capital,
                    rsi: candle.rsi,
                    previousRSI: candle.previousRSI,
                    event: "endTrade",
                    isDayEnd: true,
                });
            }  else {
                emitter.emit('dayEnd');
            }

            return;           
        }

        if (hour === 9 && minute === 15) {
            rsi = candle.rsi;
            previousRSI = candle.previousRSI;
            const saveData =  {
                rsi,
                previousRSI,
                time: candle.time,
            };
            utils.sendEmail({
                text: `${JSON.stringify(saveData)} `,
                subject: "Todays High Low",
            });
            fs.writeFileSync('./todaysHighLow.json', JSON.stringify(saveData));

        } 
        if (!activeTrade && !isNoNewTradeTime({hour, minute}, noNewTradeTime)) {
            console.log("checking..............>")
            activeTrade = tradeStartCondition(candle);

            if (activeTrade) {
                
                stopLoss = candle.low;
                target = candle.close * (TARGET && parseFloat(TARGET) || 1.1); //taget
                triggerPrice = candle.close;
                reCalculateTarget(candle);
                console.log("starting trade with sl is" + stopLoss + "and target is" + target);
                const investment = calculateInvestment(activeTrade, candle, capital);
                totalLots = investment.lots;
                emitter.emit('startTrade', {
                    candle,
                    tradeType: activeTrade,
                    lots: investment.lots,
                    capital,
                    event: "startTrade",
                    rsi: candle.rsi,
                    previousRSI: candle.previousRSI,
                });
                Exchange.on("tick-candle", handleEachTick); //add callback
                return;
            }
        } else if (activeTrade) {
            if (stopLossCondition(candle, stopLoss)) {
                console.log({stopLoss})
                emitter.emit("endTrade", {
                    candle,
                    tradeType: activeTrade,
                    lots,
                    capital,
                    event: "endTrade",
                    rsi: candle.rsi,
                    previousRSI: candle.previousRSI,
                });
                return;
            }
        }
        
    }

    const tradeReset  = () => {
        tradeType = null;
        lots = 0;
        currentCandle = null;
        totalLots = 0;
        activeTrade = null;
        stopLoss = null;
        target = null;
        triggerPrice = null;
        Exchange.removeListener("tick-candle", handleEachTick);
    }

    const dayReset = () => {
        tradeReset();
        rsi = null;
        previousRSI = null;
    }

    const updateCapital = (newCapital) => {
        capital = newCapital;
    }
   
    const updateLots = (newLots) => {
        lots = newLots;
    }

    const getCapital = () => capital;
    const getLots = () => lots;

    const destroy = () => {
        if (activeTrade) {
            emitter.emit('endTrade', {
                candle: currentCandle,
                capital,
                lots,
                tradeType: activeTrade,
            });
        }
        Exchange.removeListener(tickEventName, handler);
        dayReset();
    }

    Exchange.on(tickEventName, handler);

    return {
        updateCapital,
        updateLots,
        getCapital,
        getLots,
        destroy,
        tradeReset,
        emitter,
        dayReset
    };
}

function calculateInvestment(tradeType, candle, capital, deployCapitalPercentage = 100, lotSize = 75) {
    const price = candle.close;
    const deployableCapital = (capital*deployCapitalPercentage)/ 100;
    const lots =  1;//Math.floor(deployableCapital/(price*lotSize));
    console.log(lots, deployableCapital);
    console.log(price);
    console.log('----');
    return {lots, investment: lots*price*lotSize, remainingCapital: capital -  lots*price*lotSize};
}


function isNoNewTradeTime(currentTime, noNewTradeTime) {
    if (currentTime.hour < noNewTradeTime.hour) {
        return false;
    } else if (currentTime.hour === noNewTradeTime.hour) {
        return currentTime.minute >= noNewTradeTime.minute;
    }
    return false;
}


function isShutDownTime(currentTime, shutDownTime) {
    if (currentTime.hour < shutDownTime.hour) {
        return false;
    } else if (currentTime.hour === shutDownTime.hour) {
        return currentTime.minute >= shutDownTime.minute;
    }
    return false;
}

function getEventName(milliseconds) {
    const minutes = milliseconds/(60*10);
    return `${minutes}-minute-candle`;
}

module.exports = rsi60;