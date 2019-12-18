const orbStrategy = require('./strategies/orb');
const Exchange = require('./exchange');
const utils = require('./utils');


function trader(strategy) {
    const currentStrategyTrader =  strategy({
        capital: 30000,
    }, Exchange.emitter);

    let startPrice = 0;
    let profit = 0;
    let dayProfit = 0;
    currentStrategyTrader.emitter.on('startTrade', (data) => {
        const chart = getChart(data);
        const price = getPrice(data.tradeType, data.candle);
        Exchange.buy({
            chart,
            lots: Number(data.lots),
            }).then((trade) => {
                startPrice = price;
                currentStrategyTrader.updateLots(data.lots);
                currentStrategyTrader.updateCapital(data.capital - price*data.lots*75);
                console.log(`price  -  ${price}  tradeType  - ${data.tradeType} capital - ${currentStrategyTrader.getCapital()}  \n event - ${data.event} \nlot - ${data.lots}  \ntime - ${data.candle.time}`);
                console.log(`orlow: ${data.orLow} orHigh: ${data.orHigh} close: ${data.candle.close}`);
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
            profit  += ((price - startPrice)*data.lots*75);
            dayProfit+=((price - startPrice)*data.lots*75);
            console.log('currentLots', currentLots);
            if (currentLots === 0) {
                console.log(`Trade Profit ---- ${profit}`);
                profit = 0;
                currentStrategyTrader.tradeReset();
            }
            utils.sendEmail({
                text: `Sold ${chart.symbol}, lots - ${data.lots},   price - ${price} trade - ${trade},\n Net Profit this trade: ${profit} `
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
    currentStrategyTrader.emitter.on('dayEnd', () => {
        currentStrategyTrader.dayReset();
        console.log(`......Day End Profit...... ${dayProfit}`)
        utils.sendEmail({
            subject: 'Trade summary today',
            text: `Todays profit - ${dayProfit}`
        });
        dayProfit= 0;
    });

    currentStrategyTrader.emitter.on('shutDown', (data) => {
        currentStrategyTrader.destroy();
    });
} 


const getPrice = (tradeType, candle) => tradeType === 'call' ? candle.callCandle.close : candle.putCandle.close;
const getChart = (data) => data.tradeType === 'call' ? data.candle.callChart :  data.candle.putChart;

trader(orbStrategy);

