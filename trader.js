const orbStrategy = require('./strategies/orb');
const Exchange = require('./testExchange');
const constants = require('./constants');


function trader(strategy) {
    const currentStrategyTrader =  strategy({
        capital: 30000,
    }, Exchange.emitter);

    currentStrategyTrader.emitter.on('startTrade', (data) => {
        const chartId = getChartId(data.tradeType);
        const price = getPrice(data.tradeType, data.candle);
         Exchange.buy({
            chartId,
            quantity: data.lots,
         });
        currentStrategyTrader.updateLots(data.lots);
        currentStrategyTrader.updateCapital(data.capital - price*data.lots*75);
        console.log(`price  -  ${price}  tradeType  - ${data.tradeType} capital - ${currentStrategyTrader.getCapital()}  event - ${data.event} lot - ${data.lots}  time - ${data.candle.time}`);
        console.log(`orlow: ${data.orLow} orHigh: ${data.orHigh}  close: ${data.candle.close}`);
    });

    const closeHandler = (data) => {
        const chartId = getChartId(data.tradeType);
        const price = getPrice(data.tradeType, data.candle);
        Exchange.sell({
            chartId,
            quantity: data.lots,
        });
        const currentLots = currentStrategyTrader.getLots() - data.lots;
        const currentCapital = data.capital + price*data.lots*75;
        currentStrategyTrader.updateLots(currentLots);
        currentStrategyTrader.updateCapital(currentCapital);
        console.log(`price  -  ${price}  tradeType  - ${data.tradeType}  capital - ${currentStrategyTrader.getCapital()}  event - ${data.event} lot - ${data.lots} time - ${data.candle.time}`);
        console.log(`orlow: ${data.orLow} orHigh: ${data.orHigh}  close: ${data.candle.close}`);
        if (currentLots === 0) {
            currentStrategyTrader.tradeReset();
        }
    };

    currentStrategyTrader.emitter.on('partialClose', closeHandler);
    currentStrategyTrader.emitter.on('endTrade', closeHandler);

    currentStrategyTrader.emitter.on('shutDown', (data) => {
        currentStrategyTrader.destroy();
    });
} 


const getPrice = (tradeType, candle) => tradeType === 'call' ? candle.callCandle.close : candle.putCandle.close;
const getChartId = (tradeType) => tradeType === 'call' ? constants.CALL_WEEKLY : constants.PUT_WEEKLY;

trader(orbStrategy)
