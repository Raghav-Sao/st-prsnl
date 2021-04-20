const rsi60 = require('./strategies/rsi60');
const Exchange = require('./dynamicOptionExchange');
const utils = require('./utils');

const todaysCapital = 5000000;
function trader(strategy) {
    const currentStrategyTrader =  strategy({
        capital: todaysCapital,
    }, Exchange.emitter, Exchange.getHistoricalData);
    let startPrice = 0;
    let profit = 0;
    let dayProfit = 0;
    currentStrategyTrader.emitter.on('startTrade', (data) => {
        console.log("start buy");
        const chart = {
            symbol: data.candle.symbol
        };
        const price = data.candle.close;
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
                    text: `Bought ${chart.symbol}, lots - ${data.lots},   price - ${price} trade - ${JSON.stringify(trade)}`
                });
            }).catch((e) => {
                console.log(`BUY FAIL ${data.tradeType}  ${data.lots} ${data.candle.time}`, e);
                utils.sendEmail({
                    subject: 'URGENT!!!!!',
                    text: `BUY FAIL!!!!!! ${chart.symbol}, lots - ${data.lots}   price - ${price} \n ${JSON.stringify(e)} \n ${JSON.stringify(data)}`
                });
                // currentStrategyTrader.tradeReset();
            });
        
    });

    const closeHandler = (data) => {
        console.log("close");
        currentStrategyTrader.tradeReset();
        if (data.isDayEnd) {
            onDayEnd();
        }
        if(data.profitBooking) {
            console.log({profitBooking: data.profitBooking}, "done");
        }
        const chart = {
            symbol: data.candle.symbol
        };
        const price = data.candle.close;
        const prospectProfit = dayProfit+ ((price  - startPrice)*currentStrategyTrader.getLots());
        let bookLots = data.lots;
        // if (prospectProfit >= 0.75*todaysCapital)  {
        //     bookLots = currentStrategyTrader.getLots();
        // } else if (prospectProfit >= 0.5*todaysCapital) {
        //     bookLots = Math.floor(currentStrategyTrader.getLots()*0.75); 
        // } 

        Exchange.sell({
            chart,
            lots: Number(bookLots),
        }).then((trade) => {
            const currentLots = currentStrategyTrader.getLots() - bookLots;
            const currentCapital = data.capital + price*bookLots*75;
            profit  += ((price - startPrice)*bookLots*75);
            dayProfit +=((price - startPrice)*bookLots*75);
            currentStrategyTrader.updateLots(currentLots);
            currentStrategyTrader.updateCapital(currentCapital);
            console.log(`price  -  ${price}  tradeType  - ${data.tradeType}  capital - ${currentStrategyTrader.getCapital()}  event - ${data.event} lot - ${data.lots} time - ${data.candle.time}`);
            console.log(`orlow: ${data.orLow} orHigh: ${data.orHigh}  close: ${data.candle.close}`);
           
            console.log('currentLots', currentLots);
            
            if (currentLots <= 0) {
                console.log(`Trade Profit ---- ${profit}`);
                utils.sendEmail({
                    text: `Sold ${chart.symbol}, lots - ${bookLots},   price - ${price} trade - ${JSON.stringify(trade)},\n  Net Profit this trade: ${profit} `,
                    subject: "Trade Ended",
                });
                profit = 0;
                currentStrategyTrader.tradeReset();
                if (data.isDayEnd) {
                    onDayEnd();
                }
            } else {
                utils.sendEmail({
                    text: `Sold ${chart.symbol}, lots - ${bookLots},   price - ${price} trade - ${JSON.stringify(trade)},\n  Profit: ${profit} `,
                    subject: "Partial Profit booking",
                });
            }
            
        }).catch((e) => {
            console.log(`SELL FAIL ${data.tradeType}  ${bookLots} ${data.candle.time}`, e);
            utils.sendEmail({
                subject: 'URGENT!!!!!',
                text: `SELL FAIL!!!!!! ${chart.symbol}, lots - ${bookLots}   price - ${price} \n ${JSON.stringify(e)}   \n ${JSON.stringify(data)}`
            });
        });
             
    };


    function onDayEnd() {
        currentStrategyTrader.dayReset();
        console.log(`......Day End Profit...... ${dayProfit}`)
        utils.sendEmail({
            subject: 'Trade summary today',
            text: `Todays profit - ${dayProfit}`
        });
        dayProfit= 0;
    }

    currentStrategyTrader.emitter.on('partialClose', closeHandler);
    currentStrategyTrader.emitter.on('endTrade', closeHandler);
    currentStrategyTrader.emitter.on('dayEnd', onDayEnd);

    currentStrategyTrader.emitter.on('shutDown', (data) => {
        currentStrategyTrader.destroy();
    });
} 


const getPrice = (tradeType, candle) => tradeType === 'call' ? candle.callCandle.close : candle.putCandle.close;
const getChart = (data) => data.tradeType === 'call' ? data.candle.callChart :  data.candle.putChart;

trader(rsi60);

