const EventEmitter = require('events');
const emitter = new EventEmitter();
const moment = require('moment');
const _ =  require('lodash');
var KiteTicker = require("kiteconnect").KiteTicker;
const KiteConnect = require("kiteconnect").KiteConnect;
const constants = require('./constants');
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
        const orders = await kc.getOrders();

        console.log(moment().format(""), )
    }) 
    const ticker = new KiteTicker({
        api_key: constants.API_KEY,
        access_token: ACCESS_TOKEN,
    });
    ticker.autoReconnect(true, 10, 5)
    ticker.connect();
    ticker.on("ticks", onTicks);
    ticker.on("connect", subscribe);

    ticker.on("noreconnect", function() {
        console.log("noreconnect");
    });

    ticker.on("reconnect", function(reconnect_count, reconnect_interval) {
        console.log("Reconnecting: attempt - ", reconnect_count, " interval - ", reconnect_interval);
    });

    let store = [];
    function onTicks(ticks) {
        const grouped = _.groupBy(ticks, 'instrument_token');
        const nifty = _.get(grouped[`${constants.NIFTY}`], 0) || store[store.length - 1][0];
        const call = _.get(grouped[`${constants.CALL_WEEKLY}`], 0) || store[store.length - 1][1];
        const put = _.get(grouped[`${constants.PUT_WEEKLY}`], 0) || store[store.length - 1][2];
        const raw = [nifty, call, put];
        const timestamp = ticks[0].timestamp;
        const transformed = _.map(raw, (tick) => {
            return {
                last_price: tick.last_price,
                timestamp: moment(timestamp).unix(),
            }
        });
        if (store.length) {
            const firstTimeStamp = store[0][0].timestamp;
            const diff = transformed[0].timestamp - firstTimeStamp;
            if (diff >= 60) {
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
        };
        if(lastCandle) {
            candle.previousClose =  lastCandle.close;
        }   
        emitter.emit('5_minute_candle', candle);
        lastCandle = candle;

    }

    function getCandle(dataArray) {
        return {
            open: dataArray[0].last_price,
            close: dataArray[dataArray.length - 1].last_price,
            high: Math.max(..._.map(dataArray, 'last_price')),
            low: Math.min(..._.map(dataArray, 'last_price')),
            time: dataArray[0].timestamp,
        } 
    }



    function subscribe() {
        var items = [constants.NIFTY, constants.CALL_WEEKLY, constants.PUT_WEEKLY];
        console.log('subscribed');
        ticker.subscribe(items);
        // ticker.setMode(ticker.modeFull, items);
    }
}

module.exports = {
    emitter,
    buy: async ({chartId, lots}) => {
       const trade = kc.placeOrder('regular', {
            exchange: 'NSE',
            tradingsymbol: constants[chartId],
            quantity: lots,
            order_type: "NRML",
            product: "MIS",
            transaction_type: "BUY",
        });
        console.log(trade);
    },
    sell: () => {
        const trade = kc.placeOrder('regular', {
            exchange: 'NSE',
            tradingsymbol: constants[chartId],
            quantity: lots,
            order_type: "NRML",
            product: "MIS",
            transaction_type: "SELL",
        });
        console.log(trade);
    },
}
