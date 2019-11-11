const StockExchange = require("./stockExchange");
let capital = 13000;
let tradeOpen;

const tickHandler = async (candleData) => {
    console.log('RSI', candleData.rsi);
    console.log('time', candleData.time);
    if(candleData.lastCandle) {
        if (candleData.rsi > 50 && !candleData.noTrade ) {
            if  (candleData.rsi < candleData.lastCandle.rsi) return;

            console.log('price', candleData.open);
            StockExchange.removeListener('candleData', tickHandler);
            console.log("trade started");
            console.log("capital start", capital);
            tradeOpen = true;
            await startTrade(candleData);
            tradeOpen = false;
            console.log('capital end', capital);
            console.log('trade ended');
            StockExchange.on('candleData', tickHandler);
        }
    }
};

StockExchange.on('candleData', tickHandler);


// function steppingStopLossStrategy(candleData) {
//     let stopLoss = candleData.lastCandle.low;
//     capital = capital - candleData.close;
//     let resolver;
//     const promise = new Promise((resolve) => {
//         resolver = resolve;
//     });

//     const checkTradeStopCondition = (candle) => {
//         if (candle.close <= stopLoss ) {
//             capital = capital + candle.close;
//             StockExchange.removeListener('candleData', checkTradeStopCondition);
//             resolver();
//         } else {
//             stopLoss = candle.high;
//         }
//     }
//     StockExchange.on('candleData', checkTradeStopCondition);
//     return promise;
// }


function startTrade(candleData, tradeType = 'buy') {
    const stopLoss = candleData.lastCandle.low;
    capital = capital - candleData.close;
    let lowestRsi = candleData.rsi;
    let lastRsiPeak = null;
    let resolver;
    const promise = new Promise((resolve) => {
        resolver = resolve;
    });
    let tradeCloseSignal = false;
    const checkTradeStopCondition = (candle) => {
        lowestRsi = candle.rsi;
        if (!tradeOpen) {
            tradeCloseSignal = true;
            StockExchange.removeListener('candleData', checkTradeStopCondition);
            resolver();
            return;
        }
        if (candle.low <= stopLoss || lowestRsi >= candle.rsi) {
            tradeCloseSignal = true;
            capital = capital + candle.close;
            console.log('stopLoss', capital);
            StockExchange.removeListener('candleData', checkTradeStopCondition);
            resolver();
        } else {
            const isPeak = (candle.lastCandle.rsi > candle.rsi) && (candle.lastCandle.rsi > candle.lastCandle.rsi1);
            if (candle.lastCandle.rsi > 70 && candle.rsi <= 70) {
                tradeCloseSignal = true;
                capital = capital + candle.close;
                console.log('close trade - high priority', capital);
                StockExchange.removeListener('candleData', checkTradeStopCondition);
                resolver();
                return;
            }
            if (isPeak) {
                if(lastRsiPeak && lastRsiPeak >= candle.lastCandle.rsi) {
                    tradeCloseSignal = true;
                    capital = capital + ((candle.close));
                    console.log('close trade - low priority', capital);
                    StockExchange.removeListener('candleData', checkTradeStopCondition);
                    resolver();
                } else {
                    lastRsiPeak = candle.lastCandle.rsi;
                }
                }
            }
            
    }
    if (tradeType === 'buy') {
        StockExchange.on('candleData', checkTradeStopCondition);
    }

    return promise;
}

StockExchange.on('shutDown',function shutdown(candle) {
    if (tradeOpen) {
        capital = capital + candle.close;
        tradeOpen = false;
        console.log('Trade shutDown', capital); 
    }
    // StockExchange.removeListener('shutDown', shutdown);

});