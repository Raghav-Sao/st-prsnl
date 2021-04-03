const StockExchange  = require("../stockExchange");
const moment =  require('moment');

const SimpleRsiBreakOutStrategy = {
    capital: 100,
};

SimpleRsiBreakOutStrategy.checkCondition = (candle) => {
    if (candle.noTrade) return;
    // ((candle.rsi - candle.lastCandle.rsi) > 2)
    if ((candle.rsi21 > 60 && candle.lastCandle.rsi21 <= 60) ) {
        SimpleRsiBreakOutStrategy.tradeCondition = 'buy';
        return true;
    }
    return false;
}

SimpleRsiBreakOutStrategy.init = () => {
    if (!SimpleRsiBreakOutStrategy.tradeCondition)  {
        StockExchange.on('candleData', SimpleRsiBreakOutStrategy.stockExchangeListener);
    }

    StockExchange.on('shutDown', (candle) => {
        SimpleRsiBreakOutStrategy.closeTrade(candle, 'shutDown', candle.close);
    });
}

SimpleRsiBreakOutStrategy.stockExchangeListener = (candle) => {
    // console.log("------------------------------------------------------------------------>");
    // console.log(candle.time, candle.rsi);
    // console.log("------------------------------------------------------------------------>");
    if (SimpleRsiBreakOutStrategy.tradeCondition) {
        return
    } else {
        console.log(candle.rsi21, candle.time);
    }
    if (SimpleRsiBreakOutStrategy.checkCondition(candle)) {
        SimpleRsiBreakOutStrategy.startCandle = candle;
        SimpleRsiBreakOutStrategy.invested = candle.close;
        SimpleRsiBreakOutStrategy.capital = SimpleRsiBreakOutStrategy.capital - candle.close;
        SimpleRsiBreakOutStrategy.stopLoss = candle.low;
        // StockExchange.on('candleData', SimpleRsiBreakOutStrategy.checkTradeStopCondition);
        StockExchange.on('eachTickerData', SimpleRsiBreakOutStrategy.checkTradeStopCondition);
    }
}

SimpleRsiBreakOutStrategy.checkTradeStopCondition = (candle) => {
    if (candle.price < SimpleRsiBreakOutStrategy.stopLoss) {
        SimpleRsiBreakOutStrategy.closeTrade(candle , 'stoploss', SimpleRsiBreakOutStrategy.stopLoss);
        return;
    }
    const profit = candle.price - SimpleRsiBreakOutStrategy.startCandle.close;
    const perProfit = (SimpleRsiBreakOutStrategy.startCandle.close * 90) / 100;
    if(profit >= perProfit) {
        SimpleRsiBreakOutStrategy.closeTrade(candle , 'profitBooking', SimpleRsiBreakOutStrategy.startCandle.close+perProfit);
        return;
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

SimpleRsiBreakOutStrategy.closeTrade = (candle , reason='', profit) => {
    if (!SimpleRsiBreakOutStrategy.tradeCondition)  return;
    console.log(SimpleRsiBreakOutStrategy.tradeCondition,SimpleRsiBreakOutStrategy.invested );
    SimpleRsiBreakOutStrategy.capital = SimpleRsiBreakOutStrategy.capital +  profit;
    // SimpleRsiBreakOutStrategy.setSummary(candle);
    console.log(`Trade close - ${reason} profit:  ${profit-SimpleRsiBreakOutStrategy.startCandle.close}`);
    console.log(`capital : ${SimpleRsiBreakOutStrategy.capital}`);
    console.log(SimpleRsiBreakOutStrategy.startCandle.time, candle.time);
    console.log(SimpleRsiBreakOutStrategy.startCandle.rsi, candle.rsi);
    console.log("------->\n")
    SimpleRsiBreakOutStrategy.tradeCondition = null;
    SimpleRsiBreakOutStrategy.startCandle = null;
    SimpleRsiBreakOutStrategy.invested = null;
    SimpleRsiBreakOutStrategy.stopLoss = null;
    SimpleRsiBreakOutStrategy.lastPeak = null;
    SimpleRsiBreakOutStrategy.lastCup = null;
    // console.log(JSON.stringify(SimpleRsiBreakOutStrategy.summary));
    // StockExchange.removeListener('candleData', SimpleRsiBreakOutStrategy.checkTradeStopCondition);
    StockExchange.removeListener('eachTickerData', SimpleRsiBreakOutStrategy.checkTradeStopCondition);
}

module.exports = SimpleRsiBreakOutStrategy;