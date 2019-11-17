const StockExchange  = require("../stockExchange");
const moment =  require('moment');

const SimpleRsiBreakOutStrategy = {
    capital: 0,
};

SimpleRsiBreakOutStrategy.checkCondition = (candle) => {
    if (candle.noTrade) return;
    // ((candle.rsi - candle.lastCandle.rsi) > 2)
    if ((candle.rsi21 > 52 && candle.lastCandle.rsi21 <= 50) ) {
        SimpleRsiBreakOutStrategy.tradeCondition = 'call';
        return true;
    } else if ((candle.rsi21 <  46 && candle.lastCandle.rsi21 >= 50)) {
        console.log(candle.rsi, candle.rsi21);
        // ((candle.lastCandle.rsi - candle.rsi) > 2)
        // SimpleRsiBreakOutStrategy.tradeCondition = 'put';
        // return true;
    }
    return false;
}

SimpleRsiBreakOutStrategy.init = () => {
    if (!SimpleRsiBreakOutStrategy.tradeCondition)  {
        StockExchange.on('candleData', SimpleRsiBreakOutStrategy.stockExchangeListener);
    }

    StockExchange.on('shutDown', (candle) => {
        SimpleRsiBreakOutStrategy.closeTrade(candle, 'shutDown');
    });
}

SimpleRsiBreakOutStrategy.stockExchangeListener = (candle) => {
    if (SimpleRsiBreakOutStrategy.tradeCondition) return;
    if (SimpleRsiBreakOutStrategy.checkCondition(candle)) {
        SimpleRsiBreakOutStrategy.startCandle = candle;
        SimpleRsiBreakOutStrategy.invested = candle[SimpleRsiBreakOutStrategy.tradeCondition].close;
        SimpleRsiBreakOutStrategy.capital = SimpleRsiBreakOutStrategy.capital - candle[SimpleRsiBreakOutStrategy.tradeCondition].close ;
        SimpleRsiBreakOutStrategy.stopLoss = SimpleRsiBreakOutStrategy.tradeCondition === 'buy' ? candle.high : candle.low;
        StockExchange.on('candleData', SimpleRsiBreakOutStrategy.checkTradeStopCondition);
    }
}

SimpleRsiBreakOutStrategy.checkTradeStopCondition = (candle) => {
    
    
    if (SimpleRsiBreakOutStrategy.tradeCondition === 'call') {
        if (candle.close <= SimpleRsiBreakOutStrategy.stopLoss) {
            SimpleRsiBreakOutStrategy.closeTrade(candle , 'stoploss');
            return;
        }
        if (candle.rsi < 70 && candle.lastCandle.rsi >= 70) {
            SimpleRsiBreakOutStrategy.closeTrade(candle, 'crossingDown70');
        } else {
            const isPeak = (candle.rsi < candle.lastCandle.rsi) &&  (candle.lastCandle.rsi > candle.lastCandle.rsi1);
            // && SimpleRsiBreakOutStrategy.lastPeak && (SimpleRsiBreakOutStrategy.lastPeak  > candle.lastCandle.rsi)
            if (isPeak && SimpleRsiBreakOutStrategy.lastPeak && (SimpleRsiBreakOutStrategy.lastPeak  < candle.lastCandle.rsi) ) {
                SimpleRsiBreakOutStrategy.closeTrade(candle,  'secondLowerPeak');
            } else {
                SimpleRsiBreakOutStrategy.lastPeak = candle.lastCandle.rsi;
            }
        }
    } else if(SimpleRsiBreakOutStrategy.tradeCondition === 'put'){
        if (candle.close >= SimpleRsiBreakOutStrategy.stopLoss) {
            SimpleRsiBreakOutStrategy.closeTrade(candle , 'stoploss');
            return;
        }
        if (candle.rsi > 30 && candle.lastCandle.rsi <= 30) {
            SimpleRsiBreakOutStrategy.closeTrade(candle, 'crossingUp30');
        } else {
            const isCup = (candle.rsi > candle.lastCandle.rsi) &&  (candle.lastCandle.rsi < candle.lastCandle.rsi1);
            //
            if (isCup && SimpleRsiBreakOutStrategy.lastCup && (SimpleRsiBreakOutStrategy.lastCup  > candle.lastCandle.rsi)) {
                SimpleRsiBreakOutStrategy.closeTrade(candle,  'secondLowerPeak');
            } else {
                SimpleRsiBreakOutStrategy.lastCup = candle.lastCandle.rsi;
            }
        }
    }
}

SimpleRsiBreakOutStrategy.setSummary =  (candle)=> {
   const summary = SimpleRsiBreakOutStrategy.summary;
   SimpleRsiBreakOutStrategy.summary = summary || {};
   const startCandle  = SimpleRsiBreakOutStrategy.startCandle;
   const  day = moment(startCandle.time).date();
   const hours  = moment(startCandle.time).hours();
   const daySumm = SimpleRsiBreakOutStrategy.summary[day];
   SimpleRsiBreakOutStrategy.summary[day] = daySumm || {
       total: 0
   };
   const hrSummary = SimpleRsiBreakOutStrategy.summary[day][hours];
   SimpleRsiBreakOutStrategy.summary[day][hours] = hrSummary || {};
   const callPutSummary = SimpleRsiBreakOutStrategy.summary[day][hours][SimpleRsiBreakOutStrategy.tradeCondition];
   SimpleRsiBreakOutStrategy.summary[day][hours][SimpleRsiBreakOutStrategy.tradeCondition] = callPutSummary || [];
   SimpleRsiBreakOutStrategy.summary[day][hours][SimpleRsiBreakOutStrategy.tradeCondition].push(candle[SimpleRsiBreakOutStrategy.tradeCondition].close  - SimpleRsiBreakOutStrategy.invested - (40/500));
   SimpleRsiBreakOutStrategy.summary[day].total += (candle[SimpleRsiBreakOutStrategy.tradeCondition].close  - SimpleRsiBreakOutStrategy.invested - (40/500))
}

SimpleRsiBreakOutStrategy.closeTrade = (candle , reason='') => {
    if (!SimpleRsiBreakOutStrategy.tradeCondition)  return;
    console.log(SimpleRsiBreakOutStrategy.tradeCondition,SimpleRsiBreakOutStrategy.invested );
    SimpleRsiBreakOutStrategy.capital = SimpleRsiBreakOutStrategy.capital +  candle[SimpleRsiBreakOutStrategy.tradeCondition].close  - (40/500);
    SimpleRsiBreakOutStrategy.setSummary(candle);
    console.log(`Trade close - ${reason} profit:  ${candle[SimpleRsiBreakOutStrategy.tradeCondition].close  -  SimpleRsiBreakOutStrategy.invested - 40/500}`);
    console.log(`capital : ${SimpleRsiBreakOutStrategy.capital}`);
    console.log(SimpleRsiBreakOutStrategy.startCandle.time, candle.time);
    console.log(SimpleRsiBreakOutStrategy.startCandle.rsi, candle.rsi);
    SimpleRsiBreakOutStrategy.tradeCondition = null;
    SimpleRsiBreakOutStrategy.startCandle = null;
    SimpleRsiBreakOutStrategy.invested = null;
    SimpleRsiBreakOutStrategy.stopLoss = null;
    SimpleRsiBreakOutStrategy.lastPeak = null;
    SimpleRsiBreakOutStrategy.lastCup = null;
    console.log(JSON.stringify(SimpleRsiBreakOutStrategy.summary));
    StockExchange.removeListener('candleData', SimpleRsiBreakOutStrategy.checkTradeStopCondition);
}

module.exports = SimpleRsiBreakOutStrategy;