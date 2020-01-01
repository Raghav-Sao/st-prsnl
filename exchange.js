const EventEmitter = require('events');
const emitter = new EventEmitter();
const moment = require('moment');
const _ =  require('lodash');
var KiteTicker = require("kiteconnect").KiteTicker;
const KiteConnect = require("kiteconnect").KiteConnect;
const constants = require('./constants');
const utils = require('./utils');

let ACCESS_TOKEN;
let PUBLIC_TOKEN;
let REQUEST_TOKEN = process.argv[2];
console.log('REQUEST_TOKEN', REQUEST_TOKEN);

const kc = new KiteConnect({
	api_key: constants.API_KEY
});

kc.generateSession(REQUEST_TOKEN, constants.API_SECRET)
	.then(function(response) {
        ACCESS_TOKEN = response.access_token;
        PUBLIC_TOKEN = response.public_token;
        console.log("response", response);
        init();
        
	})
	.catch(function(err) {
		console.log(err);
    });
    




function init() {   
    setInterval(async () => {
        const postions = await kc.getPositions();
        console.log('positions', postions);
        const orders = kc.getOrders().then((data) => {
            //console.log(moment().format(), orders )
        }).catch((e) => {
            console.log('session expired');
            console.log(e);
            utils.sendEmail({
                text: 'URGENT!! SESSION EXPIRED',
                subject: `URGENT!! SESSION EXPIRED \n ${JSON.stringify(e)}`
            });
        });         
        
    }, 60*1000);

    const ticker = new KiteTicker({
        api_key: constants.API_KEY,
        access_token: ACCESS_TOKEN,
    });

    ticker.autoReconnect(true, 10, 5)
    ticker.connect();

    ticker.on("connect", subscribe);
    ticker.on("ticks", onTicks);

    ticker.on("noreconnect", function() {
        console.log("noreconnect");
    });

    ticker.on("reconnect", function(reconnect_count, reconnect_interval) {
        console.log("Reconnecting: attempt - ", reconnect_count, " interval - ", reconnect_interval);
    });

    let store = [];
    let tickCount = 0;
    let callChart = constants.CALL_WEEKLY;
    let putChart = constants.PUT_WEEKLY;
    let lastTicksGrouped;
    function onTicks(ticks) {
        // timestamp in ticks is in second, always convert to millisecond for conversion
        // console.log(ticks);
        const grouped = _.groupBy(ticks, 'instrument_token');
        if (!grouped[`${constants.NIFTY}`]) {
            grouped[`${constants.NIFTY}`] = lastTicksGrouped[`${constants.NIFTY}`];
        }  
        if (!grouped[`${callChart.chartId}`]) {
            grouped[`${callChart.chartId}`] = lastTicksGrouped[`${callChart.chartId}`];
        } 
        if (!grouped[`${putChart.chartId}`]) {
            grouped[`${putChart.chartId}`] = lastTicksGrouped[`${putChart.chartId}`];
        }
        lastTicksGrouped = grouped;

        const secondsTimeStamp = moment(ticks[0].timestamp).unix();

        if  (tickCount === 0) {
            console.log('grouped', grouped);
            console.log('ticks.length', ticks);
            // ignore first tick when not multiple of 5minute
            // otherwise candle will shift
            console.log(ticks[0].timestamp, secondsTimeStamp%900);
            if ( secondsTimeStamp%900 !== 0) {
                console.log('ignoring initial ticks at - ', moment((secondsTimeStamp)*1000).utcOffset("+05:30").format());
                return;
            }
            console.log('Candle creation starts', ticks);
        }
        // console.log(store);
        const nifty = _.get(grouped[`${constants.NIFTY}`], 0) || store[store.length - 1][0];
        const call = _.get(grouped[`${callChart.chartId}`], 0) || store[store.length - 1][1];
        const put = _.get(grouped[`${putChart.chartId}`], 0) || store[store.length - 1][2];
        const raw = [nifty, call, put];
        const timestamp = ticks[0].timestamp;

        const transformed = _.map(raw, (tick) => {
            return {
                last_price: tick.last_price,
                timestamp: moment(timestamp).unix(),
            }
        });

        if (tickCount === 0) {
            tickCount++;
            const callStrike = utils.getStrikeForOption({currentPrice: transformed[0].last_price, optionType: 'CE'});
            const putStrike = utils.getStrikeForOption({currentPrice: transformed[0].last_price, optionType: 'PE'});
            console.log('transformed[0].last_price', transformed[0].last_price);
            console.log('STRIKES')
            console.log(callStrike, putStrike);
            ticker.unsubscribe([callChart.chartId, putChart.chartId]);
            callChart = constants.chartByStrike.call[callStrike];
            putChart = constants.chartByStrike.put[putStrike];
            console.log('charts');
            console.log(callChart, putChart);
            ticker.subscribe([callChart.chartId, putChart.chartId]);
        }

        if (store.length) {
            const firstTimeStamp = store[0][0].timestamp;
            const diff = transformed[0].timestamp - firstTimeStamp;

            // after 5 minutes create and emit candle
            if (diff >= 900) {
                createAndEmitCandle(store);
                store = [];
            }
        }
        
        store.push(transformed);

    }

    let lastCandle;
    function createAndEmitCandle(data) {
        const nifty = _.map(data, (item)  => item[0]);
        const call = _.map(data, (item)  => item[1]);
        const put = _.map(data, (item)  => item[2]);
        const candle = {
            ...getCandle(nifty),
            callCandle: getCandle(call),
            putCandle: getCandle(put),
            callChart,
            putChart,
        };
        if(lastCandle) {
            candle.previousClose =  lastCandle.close;
        }   
        emitter.emit('5-minute-candle', candle);
        lastCandle = candle;

    }

    function getCandle(dataArray) {
        return {
            open: dataArray[0].last_price,
            close: dataArray[dataArray.length - 1].last_price,
            high: Math.max(..._.map(dataArray, 'last_price')),
            low: Math.min(..._.map(dataArray, 'last_price')),
            time: dataArray[0].timestamp*1000, // seconds to milliseconds
        } 
    }



    function subscribe() {
        var items = [constants.NIFTY, constants.CALL_WEEKLY.chartId, constants.PUT_WEEKLY.chartId];
        console.log('subscribed');
        ticker.subscribe(items);
        ticker.setMode(ticker.modeFull, items);
    }
}


const buy = async ({chart, lots}) => {
    console.log('chart')
    console.log(chart, lots);
    return kc.placeOrder('regular', {
         exchange: 'NFO',
         tradingsymbol: chart.symbol,
         quantity: lots*75,
         order_type: "MARKET",
         product: "MIS",
         transaction_type: "BUY",
     });
 };

 const sell = async ({chart, lots}) => {
     console.log('chart')
     console.log(chart, lots);
     const positions = await kc.getPositions();
     const targetPosition = _.filter(positions, (pos) => pos.tradingsymbol === chart.symbol);
     const quantity = _.sum(_.map(targetPosition, 'day_buy_quantity'));
     console.log('Total lots  available', quantity);
     return kc.placeOrder('regular', {
        exchange: 'NFO',
        tradingsymbol: chart.symbol,
        quantity: lots*75,
        order_type: "MARKET",
        product: "MIS",
        transaction_type: "SELL",
    });
};

module.exports = {
    emitter,
    buy,
    sell,
}
