const orbStrategy = require('./strategies/orb');
const Exchange = require('./exchange');
const constants = require('./constants');
const utils = require('./utils');


function trader(strategy) {
    const currentStrategyTrader =  strategy({
        capital: 30000,
    }, Exchange.emitter);

    currentStrategyTrader.emitter.on('startTrade', (data) => {
        const chart = getChart(data);
        const price = getPrice(data.tradeType, data.candle);
        Exchange.buy({
            chart,
            lots: Number(data.lots),
            }).then((trade) => {
                currentStrategyTrader.updateLots(data.lots);
                currentStrategyTrader.updateCapital(data.capital - price*data.lots*75);
                console.log(`price  -  ${price}  tradeType  - ${data.tradeType} capital - ${currentStrategyTrader.getCapital()}  event - ${data.event} lot - ${data.lots}  time - ${data.candle.time}`);
                console.log(`orlow: ${data.orLow} orHigh: ${data.orHigh}  close: ${data.candle.close}`);
                utils.sendEmail({
                    text: `Bought ${chart.symbol}, lots - ${data.lots},   price - ${price} trade - ${trade}`
                });
            }).catch((e) => {
                console.log(`BUY FAIL ${data.tradeType}  ${data.lots} ${data.candle.time}`);
                utils.sendEmail({
                    subject: 'URGENT!!!!!',
                    text: `BUY FAIL!!!!!! ${chart.symbol}, lots - ${data.lots}   price - ${price} \n ${JSON.stringify(e)} \n ${JSON.stringify(data)}`
                });
                currentStrategyTrader.tradeReset();
            });
        
    });

    const closeHandler = (data) => {
        const chart = getChart(data);
        const price = getPrice(data.tradeType, data.candle);
        Exchange.sell({
            chart,
            lots: Number(data.lots),
        }).then((trade) => {
            const currentLots = currentStrategyTrader.getLots() - data.lots;
            const currentCapital = data.capital + price*data.lots*75;
            currentStrategyTrader.updateLots(currentLots);
            currentStrategyTrader.updateCapital(currentCapital);
            console.log(`price  -  ${price}  tradeType  - ${data.tradeType}  capital - ${currentStrategyTrader.getCapital()}  event - ${data.event} lot - ${data.lots} time - ${data.candle.time}`);
            console.log(`orlow: ${data.orLow} orHigh: ${data.orHigh}  close: ${data.candle.close}`);
            if (currentLots === 0) {
                currentStrategyTrader.tradeReset();
            }
            utils.sendEmail({
                text: `Bought ${chart.symbol}, lots - ${data.lots},   price - ${price} trade - ${trade}`
            });
        }).catch((e) => {
            console.log(`SELL FAIL ${data.tradeType}  ${data.lots} ${data.candle.time}`);
            utils.sendEmail({
                subject: 'URGENT!!!!!',
                text: `SELL FAIL!!!!!! ${chart.symbol}, lots - ${data.lots}   price - ${price} \n ${JSON.stringify(e)}   \n ${JSON.stringify(data)}`
            });
        });
             
        
    };

    currentStrategyTrader.emitter.on('partialClose', closeHandler);
    currentStrategyTrader.emitter.on('endTrade', closeHandler);

    currentStrategyTrader.emitter.on('shutDown', (data) => {
        currentStrategyTrader.destroy();
    });
} 


const getPrice = (tradeType, candle) => tradeType === 'call' ? candle.callCandle.close : candle.putCandle.close;
const getChart = (data) => data.tradeType === 'call' ? data.candle.callChart :  data.candle.putChart;

trader(orbStrategy);

