const StockExchange  = require("../stockExchange");

const FirstPeak = {
    capital: 0,
};

FirstPeak.checkCondition = (candle) => {
    if (candle.rsi >= 50 && candle.lastCandle.rsi < 50) {
        FirstPeak.tradeCondition = 'call';
        return true;
    } else if (candle.rsi < 50 && candle.lastCandle.rsi >= 50) {
        FirstPeak.tradeCondition = 'put';
        return true;
    }
    return false;
}

FirstPeak.init = () => {
    if (!FirstPeak.tradeCondition)  {
        StockExchange.on('candleData', FirstPeak.stockExchangeListener);
    }

    StockExchange.on('shutdown', (candle) => {
        FirstPeak.closeTrade(candle, 'shutDown');
    });
}

FirstPeak.stockExchangeListener = (candle) => {
    if (FirstPeak.tradeCondition) return;
    if (FirstPeak.checkCondition(candle)) {
        FirstPeak.invested = candle[FirstPeak.tradeCondition].close;
        FirstPeak.capital = FirstPeak.capital - candle[FirstPeak.tradeCondition].close;
        FirstPeak.stopLoss = candle.high;
        StockExchange.on('candleData', FirstPeak.checkTradeStopCondition);
    }
}

FirstPeak.checkTradeStopCondition = (candle) => {
    if (candle.close < FirstPeak.stopLoss) {
        FirstPeak.closeTrade(candle , 'stoploss');
    }
    if (FirstPeak.tradeCondition === 'call') {
        if (candle.rsi < 70 && candle.lastCandle.rsi >= 70) {
            FirstPeak.closeTrade(candle, 'crossingDown70');
        } else {
            const isPeak = (candle.rsi < candle.lastCandle.rsi) &&  (candle.lastCandle.rsi > candle.lastCandle.rsi1);
            if (isPeak) {
                FirstPeak.closeTrade(candle,  'secondLowerPeak');
            } else {
                // FirstPeak.lastPeak = candle.lastCandle.rsi;
            }
        }
    } else if(FirstPeak.tradeCondition === 'put'){
        if (candle.rsi >= 30 && candle.lastCandle.rsi < 30) {
            FirstPeak.closeTrade(candle, 'crossingUp30');
        } else {
            const isCup = (candle.rsi > candle.lastCandle.rsi) &&  (candle.lastCandle.rsi < candle.lastCandle.rsi1);
            if (isCup) {
                FirstPeak.closeTrade(candle,  'secondLowerPeak');
            } else {
                //FirstPeak.lastCup = candle.lastCandle.rsi;
            }
        }
    }
}

FirstPeak.closeTrade = (candle , reason='') => {
    if (!FirstPeak.tradeCondition)  return;
    console.log(FirstPeak.tradeCondition,FirstPeak.invested );
    FirstPeak.capital = FirstPeak.capital +  candle[FirstPeak.tradeCondition].close;
    console.log(`Trade close - ${reason} profit:  ${candle[FirstPeak.tradeCondition].close  -  FirstPeak.invested}`);
    console.log(`capital : ${FirstPeak.capital}`);
    FirstPeak.tradeCondition = null;
    FirstPeak.invested = null;
    FirstPeak.stopLoss = null;
    FirstPeak.lastPeak = null;
    FirstPeak.lastCup = null;
    StockExchange.removeListener('candleData', FirstPeak.checkTradeStopCondition);
}

module.exports = FirstPeak;