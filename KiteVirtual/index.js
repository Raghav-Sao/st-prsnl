const constants = require('../constants');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const REQUEST_TOKEN = process.argv[2];
let isSubscribed = false;

const RealKiteConnect = require("kiteconnect").KiteConnect;
const kc = new RealKiteConnect({
	api_key: constants.API_KEY
});

kc.generateSession(REQUEST_TOKEN, constants.API_SECRET)
	.then(function(response) {
        ACCESS_TOKEN = response.access_token;
        PUBLIC_TOKEN = response.public_token;
        console.log("response generateSession ------->", response);
        
	})
	.catch(function(err) {
		console.log(err);
    });



const INSTRUMENT_TOKEN = parseInt(process.argv[3]);
const mapedToken = {
    "NIFTY2141514800PE": 13663234
}

const rawdata13663234 = fs.readFileSync(path.join(__dirname,'./data/historicalData.json'));


const _13663234 = JSON.parse(rawdata13663234);


function KiteConnect() {
    this.generateSession = (REQUEST_TOKEN, API_SECRET) => {
        const promise = new Promise((resolve, reject) => {
            try {
                const access_token = "access_token";
                const public_token = "public_token";
                setTimeout(() => resolve({access_token, public_token}), 100);
            } catch(error) {
                reject(error);
            }
        })
        return promise
        
    }

    this.getInstruments = (segment) => {
        const promise = new Promise((resolve, reject) => {
            try {
                const struments = [{"NIFTY21APR14700CE": 17060610, "NIFTY21APR14800PE":17062914}];
                setTimeout(() => resolve(struments), 100);
            } catch(error) {
                reject(error);
            }
        })
        return promise
    }

    this.getPositions = () => {
        const promise = new Promise((resolve, reject) => {
            try {
                setTimeout(() => resolve("getPositions"), 100);
            } catch(error) {
                reject(error);
            }
        })
        return promise
    }

    this.getOrders = () => {
        const promise = new Promise((resolve, reject) => {
            try {
                setTimeout(() => resolve("getOrders"), 100);
            } catch(error) {
                reject(error);
            }
        })
        return promise
    }

    this.getLTP = (tokens) => {
        const promise = new Promise((resolve, reject) => {
            try {
                const res = {
                    [INSTRUMENT_TOKEN]: {
                        last_price: 12000,
                    }
                }
                setTimeout(() => resolve(res), 100);
            } catch(error) {
                reject(error);
            }
        })
        return promise
    };

    this.getHistoricalData = (instrumentToken, interval, fSTR,  tSTR) => {
        return kc.getHistoricalData(instrumentToken, interval, fSTR,  tSTR);
    }

    this.placeOrder = (type) => {

    }

}


function KiteTicker() {
    this.subscribedToken = [];
    this.tickerCount = 180;
    this.autoReconnect = () => {

    }

    this.connect = () => {
        
    }

    makeTickerData = (candleData, instrument_token) => {
        return ["open", "high", "low", "close"].map((type, index) => {
            let candle = {};
            if(Array.isArray(candleData)) {
                candle.date = candleData[0];
                candle.open = candleData[1];
                candle.high = candleData[2];
                candle.low = candleData[3];
                candle.close = candleData[4];
            } else {
                candle = candleData
            }
            // console.log(candle, candleData)
            const dt = new Date(candle.date);
        
            dt.setMinutes(dt.getMinutes()+index*(4));
            const tick = {
                tradable: true,
                mode: 'full',
                instrument_token,
                last_price: candle[type],
                timestamp: dt.toISOString(),
                type,
        
            }
        return tick;
        
        
        })
    }

    handleOnTicks =(callBack) => {
        
        this.interval = setInterval(() => {
            console.log(this.tickerCount)
            if(this.tickerCount >= 205) {
                clearInterval(this.interval);
                return
            }
            const subscribedToken = this.subscribedToken;
            
            const ticks = subscribedToken.map((token) => {
                const data = eval('_'+token);
                const currentData = data[this.tickerCount++];
                const ticker = makeTickerData(currentData, token);
                let i = 0;
                const tickerInterval = setInterval(() => {
                    callBack([ticker[i]]);
                    i++;
                    if(i === ticker.length) {
                        clearInterval(tickerInterval);
                    }
                }, 500)
                // ticker.forEach(tick => {
                //     console.log("ticker")
                //     // callBack([tick])
                //     setTimeout(() => callBack([tick]), 1500);
                // })
            })

            
        }, 5000);
    }

    this.on = (type, callBack) => {
    
        if(type === 'ticks'){
            handleOnTicks(callBack);
            return;
        }

        if(type === "subscribedToken") {
            return;
        }
        callBack();
    }

   
    this.unsubscribe = (passedTokens) => {
        this.subscribedToken = this.subscribedToken.filter(token => {
            return !passedTokens.includes(token);
        })
    }

    this.subscribe = (passedTokens) => {
        passedTokens.forEach(token => {
                if(!this.subscribedToken.includes(token)) {
                    this.subscribedToken.push(token);
                }
        });
    }

    this.setMode = (ticker, subscribedToken) => {

    }

}

module.exports = {
    KiteConnect,
    KiteTicker,
}
