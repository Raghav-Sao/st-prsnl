const EventEmitter = require('events');
const emitter = new EventEmitter();
const moment = require('moment');
const _ =  require('lodash');
// var KiteTicker = require("./KiteVirtual").KiteTicker;
// const KiteConnect = require("./KiteVirtual").KiteConnect;
var KiteTicker = require("kiteconnect").KiteTicker;
const KiteConnect = require("kiteconnect").KiteConnect;
const constants = require('./constants');
const utils = require('./utils');
const fs = require('fs');
const { includeRSI, getNearestITMOptionStrike } = require('./utils');
const INTERVAL = 60*5;
let ACCESS_TOKEN;
let PUBLIC_TOKEN;
let REQUEST_TOKEN = process.argv[2];
let INSTRUMENT_TOKEN = parseInt(process.argv[3]);
let CHART_SYMBOL = process.argv[4];

let lastHistoricalCandle = [];
const EXPIRY = constants.EXPIRY;
let subscribedToken = [256265];
let instrument_tokens = {};
const kc = new KiteConnect({
	api_key: constants.API_KEY
});

let startTime;
const symbolMapping = {256265: "NIFTY"}

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

    async function getHistoricalData({ instrumentToken, interval, fromDate, toDate}) {
        return new Promise(async (resolve, reject) => {
            console.log("getHistoricalData", { instrumentToken, interval, fromDate, toDate})
            try {
                const fSTR = moment(fromDate).utcOffset("+05:30").format("YYYY-MM-DD HH:mm:SS");
                const tSTR = moment(toDate).utcOffset("+05:30").format("YYYY-MM-DD HH:mm:SS");
                console.log(fSTR, tSTR);
                const res = await kc.getHistoricalData(instrumentToken, interval, fSTR,  tSTR);
                resolve(res);
            } catch(error) {
                resolve([])
                console.log(error,"error......");
            }
        })
        .catch(function(err) {
            console.log({err});
        });
    }

    const getInstruments = async(niftyStrike) => {
        const strikes = utils.getOptionStrikes(niftyStrike);
        const tradingsymbols = []; 
        strikes.forEach(strike => {
            tradingsymbols.push(`${EXPIRY}${strike}CE`, `${EXPIRY}${strike}PE`);
        })
        
        const struments = await kc.getInstruments()
        const filteredData = struments.filter(data => {
            return tradingsymbols.includes(data.tradingsymbol)
        });
    
        instrumentTokens = {};
        filteredData.forEach(data => {
            instrumentTokens[data.tradingsymbol] = data.instrument_token;
            subscribedToken.push(parseInt(data.instrument_token));
            symbolMapping[data.instrument_token] = data.tradingsymbol;
        });
        console.log({instrumentTokens});
        return instrumentTokens;
    }

const collectHistoricalData = (toDate, fromDate, ) => {
    for(let i = 0; i< subscribedToken.length; i++ ) {
        const instrumentToken = subscribedToken[i];
        getHistoricalData({ instrumentToken, interval: '5minute', toDate, fromDate }).then(data => {
            let lastCandle;
            data.forEach( candle => {
                lastCandle = includeRSI(candle, lastCandle);
            })
            const symbol = symbolMapping[instrumentToken];
            lastHistoricalCandle[symbol] = lastCandle;
            console.log(lastCandle, symbol)
            
        })
        utils.sleep();
    }
}


async function init() {   
    setInterval(async () => {
        const postions = await kc.getPositions();
        // console.log('positions', 'postions');
        const orders = kc.getOrders().then((data) => {
            console.log("session active current time:",moment().format() )
        }).catch((e) => {
            console.log('session expired');
            console.log(e);
            utils.sendEmail({
                text: 'URGENT!! SESSION EXPIRED',
                subject: `URGENT!! SESSION EXPIRED \n ${JSON.stringify(e)}`
            });
        });
    }, 15*60*1000);

    try {

        const data = await kc.getLTP([constants.NIFTY]);
        const  niftyStrike = data[constants.NIFTY].last_price;
        const instrument = await getInstruments(niftyStrike );
    }
    catch(error) {
        console.log({error});
    }

    
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
    let lastTicksGrouped;
    async function onTicks(ticks) {
        // timestamp in ticks is in second, always convert to millisecond for conversion
        const grouped = _.groupBy(ticks, 'instrument_token');
        subscribedToken.forEach( token  => {
            if (!grouped[token] && lastTicksGrouped) {
                grouped[token] = lastTicksGrouped[token];
            }
        })
        lastTicksGrouped = grouped;

        const secondsTimeStamp = moment(ticks[0].timestamp).unix();
        if  (tickCount === 0) {
            /* ignore first tick when not multiple of 15minute
                otherwise candle will shift */
            if (secondsTimeStamp%INTERVAL !== 0) {
                console.log('ignoring initial ticks at - ', ticks[0].timestamp, secondsTimeStamp, moment((secondsTimeStamp)*1000).utcOffset("+05:30").format());
                return;
            } else {
                let toDate = new Date(ticks[0].timestamp);
                toDate.setMinutes(toDate.getMinutes()-1);
                toDate = new Date(toDate);
                let fromDate = new Date(ticks[0].timestamp);
                fromDate = new Date(fromDate.setDate(fromDate.getDate()-20));
                console.log(moment(toDate).utcOffset("+05:30").format(), "todate");
                console.log(moment(fromDate).utcOffset("+05:30").format(), "fromDate");
                collectHistoricalData(toDate, fromDate);      
            }
        }
        const raw = subscribedToken.map( token  => {
            return _.get(grouped[token], 0) || store[store.length - 1][0];
        })

        const timestamp = ticks[0].timestamp;
        const mappedTransform = {};
        const transformed = _.map(raw, (tick) => {
            const transformedTick = {
                last_price: tick.last_price,
                timestamp: moment(timestamp).unix(),
                time: timestamp,
                instrumentToken: tick.instrument_token,
                symbol: symbolMapping[tick.instrument_token],
            }
            mappedTransform[symbolMapping[tick.instrument_token]] = transformedTick;
            return transformedTick;
        });

        if (tickCount === 0) {
            tickCount++;
            // const {callStrike, putStrike} = utils.getNearestITMOptionStrike(transformed[0].last_price);
            // const callTradingsymbols = `${EXPIRY}${callStrike}CE`;
            // const putTradingsymbols =  `${EXPIRY}${putStrike}PE`;
            // if(!subscribedToken[callTradingsymbols] || !subscribedToken[putTradingsymbols]) {
            //     ticker.unsubscribe(subscribedToken);
            //     console.log({oldSubscribedTocken: subscribedToken})
            //     const newSubscribeToken = [callTradingsymbols, putTradingsymbols];
            //     ticker.subscribe(newSubscribeToken); //map??
            //     subscribedToken = newSubscribeToken;
            //     console.log({newSubscribeToken})
            // }
        }
        if (store.length) {
            const firstTimeStamp = store[0][0].timestamp;
            const diff = transformed[0].timestamp - firstTimeStamp;
            /*if(diff%10 === 0) {
                fs.appendFileSync('./tickData.json', JSON.stringify(grouped));
            }*/
            /* after 5 minutes create and emit candle */
            if (diff >= INTERVAL) {
                
                createAndEmitCandle(store);
                store = [];
            } else {
                emitter.emit('tick-candle', mappedTransform);
            }
        }
        
        store.push(transformed);

    }

    let lastCandle;
    function createAndEmitCandle(data) {
        if(!lastCandle && lastHistoricalCandle) {
            lastCandle = lastHistoricalCandle;
        }
        const tickData = {};
        const nifty = _.forEach(data, (item)  => {
            _.forEach(item, (tickInfo) => {
                if(tickData[tickInfo.symbol]) {
                    tickData[tickInfo.symbol].push(tickInfo);
                } else {
                    tickData[tickInfo.symbol] = [tickInfo]
                }
            })
        });
        const candleData = {
            
        };
        for(const symbol in tickData) {
            const prevCandle = lastHistoricalCandle[symbol];
            const candle = getCandle(tickData[symbol]);
            const candleWithRSI = utils.includeRSI(candle, prevCandle);
            if(prevCandle) {
                candleWithRSI.previousClose =  prevCandle.close;
                candleWithRSI.previousRSI = prevCandle.rsi;
            }
            candleData[symbol] = candleWithRSI;
        }
        const candle = candleData;

        
        const niftyStrike = candle['NIFTY'].close;
        const {callStrike, putStrike} = getNearestITMOptionStrike(niftyStrike);
        const callSymbol = `${EXPIRY}${callStrike}CE`;
        const putSymbol = `${EXPIRY}${putStrike}PE`;
        emitter.emit('5-minute-candle', {candle, callSymbol, putSymbol});
        lastCandle = candle;
        lastHistoricalCandle = candle;

    }

    function getCandle(dataArray) {
        return {
            open: dataArray[0].last_price,
            high: Math.max(..._.map(dataArray, 'last_price')),
            low: Math.min(..._.map(dataArray, 'last_price')),
            close: dataArray[dataArray.length - 1].last_price,
            time: dataArray[0].timestamp*1000, /* seconds to milliseconds */
            timeStr: new Date(dataArray[0].time).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'}),
            symbol: dataArray[0].symbol,
            instrumentToken: dataArray[0].instrumentToken,
        } 
    }

    function subscribe() {
        // subscribedToken = [9891586, 9890818]
        // for (const key in instrument_tokens) {
        //     console.log(key, "key");
        //     subscribedToken.push(parseInt(instrument_tokens[key]))
        // }
        console.log(subscribedToken, instrument_tokens,"hello" );
        console.log('subscribed token is--->', subscribedToken);
        ticker.subscribe(subscribedToken);
        ticker.setMode(ticker.modeFull, subscribedToken);
    }
}


const buy = async ({chart, lots}) => {
    chart = {
        symbol: CHART_SYMBOL,
    };
    console.log('exc buy')
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
    chart = {
        symbol: CHART_SYMBOL,
    };
     console.log('exc sell')
     console.log(chart, lots);
     const positions = await kc.getPositions();
     console.log('positions', positions);
     const targetPosition = _.filter(_.get(positions, 'net'), (pos) => pos.tradingsymbol === chart.symbol);
     console.log('targetPosition', targetPosition);
     const quantity = _.sum(_.map(targetPosition, 'quantity')) || 999999;
     console.log('Total quantity  available', quantity);
     return kc.placeOrder('regular', {
        exchange: 'NFO',
        tradingsymbol: chart.symbol,
        quantity: Math.min(lots*75, quantity) || 1*75,
        order_type: "MARKET",
        product: "MIS",
        transaction_type: "SELL",
    });
};

module.exports = {
    emitter,
    buy,
    sell,
    getHistoricalData
}
