const moment = require('moment');
const EventEmitter = require('events');
const fs = require('fs');
const emitter = new EventEmitter();

const MAX_NUMBER = 200000;
const defaultNoNewTradeTime = {minute: 45, hour: 14};
const defaultShutDownTime = {minute: 10, hour: 15};
const defaultTickInterval = 3000;

function orbStrategy({ capital, tickInterval, call, put, fibonacciPartialBooking, noNewTradeTime , shutDownTime}, Exchange) {
    noNewTradeTime = noNewTradeTime || defaultNoNewTradeTime;
    shutDownTime = shutDownTime || defaultShutDownTime;
    tickInterval = tickInterval || defaultTickInterval;

    const tickEventName = getEventName(tickInterval);

    // change this value to morning 9:15 candle incase of restart
    let orLow = -1*MAX_NUMBER;
    let orHigh = MAX_NUMBER;
    let activeTrade = null;
    let stopLoss = null;
    let lots;
    let fibonacciLevels;
    let currentCandle;
    let totalLots;
    let fibonacciCrossing = -1;
    let candleCount = 0;


    const tradeStartCondition = (candle) => {
        if (candle.close < orLow && candle.previousClose >= orLow ) {
            return 'put';
        } else if(candle.close > orHigh && candle.previousClose <= orHigh) {
            return 'call';
        }
    };

    const stopLossCondition = (candle, stopLoss) => {
        if (activeTrade === 'call') {
            if (candle.close <= stopLoss) {
                return true;
            }
        } else if (activeTrade === 'put') {
            if (candle.close >= stopLoss) {
                return true;
            }
        }
        return false;
    }

    const handler = (candle) => {
        currentCandle = candle;
        const time = moment(candle.time);
        const hour = time.hours();
        const minute = time.minutes();
        /**
         * incase of restart at a later time pick high,low from file
         */
        if (candleCount === 0 && (hour > 9 || minute > 15))  {
            // readFrom files;
            const todaysHighLow = JSON.parse(fs.readFileSync('./todaysHighLow.json'));
            orLow = todaysHighLow.orLow;
            orHigh  = todaysHighLow.orHigh;
            fibonacciLevels = todaysHighLow.fibonacciLevels;
        }
        candleCount++; 

        if (isShutDownTime({hour, minute}, shutDownTime)) {
            if (activeTrade) {
                emitter.emit("endTrade", {
                    candle,
                    tradeType: activeTrade,
                    lots,
                    capital,
                    orLow,
                    orHigh,
                });
            }
            dayReset();
            return;           
        }

        if (hour === 9 && minute === 15) {
            orLow = candle.low;
            orHigh = candle.high;
            fibonacciLevels = getFibonacciLevels(orHigh, orLow);
            const saveData =  {
                orLow,
                orHigh,
                fibonacciLevels,
                time: candle.time,
            };
            fs.writeFileSync('./todaysHighLow.json', JSON.stringify(saveData));

            console.log('fibonacciLevels', fibonacciLevels);
        } else {
            if (!activeTrade && !isNoNewTradeTime({hour, minute}, noNewTradeTime)) {
                activeTrade = tradeStartCondition(candle);

                if (activeTrade) {
                    stopLoss = activeTrade === 'call' ? orHigh : orLow;
                    const investment = calculateInvestment(activeTrade, candle, capital);
                    totalLots = investment.lots;
                    emitter.emit('startTrade', {
                        candle,
                        tradeType: activeTrade,
                        lots: investment.lots,
                        capital,
                        event: "startTrade",
                        orLow,
                        orHigh,
                    });
                    return;
                }
            } else if (activeTrade) {
                if (stopLossCondition(candle, stopLoss)) {
                    emitter.emit("endTrade", {
                        candle,
                        tradeType: activeTrade,
                        lots,
                        capital,
                        event: "endTrade",
                        orLow,
                        orHigh,
                    });
                    return;
                }

                const currFibLevels = fibonacciLevels[activeTrade];
                let crossing;
                if (activeTrade === 'put') {
                    crossing = checkFibonacciCrossDown(currFibLevels, candle.close, candle.previousClose, fibonacciCrossing);
                } else {
                    crossing = checkFibonacciCrossUp(currFibLevels, candle.close, candle.previousClose, fibonacciCrossing);
                }
                if (crossing) {
                    fibonacciCrossing = crossing.crossingLevel;
                    emitter.emit("partialClose", {
                        candle,
                        lots:  Math.max(1, Math.floor(totalLots/5)),
                        tradeType: activeTrade,
                        capital,
                        event: "partialClose",
                        orLow,
                        orHigh,
                    });
                    return;
                }
            }
        }
    }

    const tradeReset  = () => {
        tradeType = null;
        lots = 0;
        currentCandle = null;
        totalLots = 0;
        activeTrade = null;
        fibonacciCrossing = -1;
    }

    const dayReset = () => {
        tradeReset();
        orLow = null;
        orHigh = null;
        stopLoss = null;
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
        fibonacciLevels = null;
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
    };
}







function calculateInvestment(tradeType, candle, capital, deployCapitalPercentage = 100, lotSize = 75) {
    const price = tradeType === 'call' ? candle.callCandle.close : candle.putCandle.close;
    const deployableCapital = (capital*deployCapitalPercentage)/ 100;
    const lots =  Math.floor(deployableCapital/(price*lotSize));
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

const getFibonacciLevels = (high, low) => {
    const range = Math.abs(high - low);
    const retracementLevel = [1.618, 2.618, 3.618, 4.236];
    return {
        call: retracementLevel.map(( level) => low + (range * level)),
        put: retracementLevel.map(( level) => high - (range * level)),
    };
}

const checkFibonacciCrossUp = (levels, price, previousPrice, fibonacciCrossing) => {
    let level = -1;
    for (let i = 0; i < levels.length; i++) {
        if (price > levels[i]) {
            level = i;
        }
    }
    if (level <= fibonacciCrossing) {
        return false;
    }

    if (level > -1) {
        if (previousPrice <= levels[level]) {
            return {
                crossingLevel: level
            };
        } 
    }
    return false;
}

const checkFibonacciCrossDown = (levels, price, previousPrice, fibonacciCrossing) => {
    let level = -1;
    for (let i = 0; i < levels.length; i++) {
        if (price < levels[i]) {
            level = i;
        }
    }

    console.log(level, fibonacciCrossing);
    if (level <= fibonacciCrossing) {
        return false;
    }

    if (level > -1) {
        if (previousPrice >= levels[level]) {
            return {
                crossingLevel: level
            };
        } 
    }
    return false;
}

module.exports = orbStrategy;