const constants = require('../constants');
const fs = require('fs');
const path = require('path');
const INSTRUMENT_TOKEN = parseInt(process.argv[3]);
const mapedToken ={
    "NIFTY21APR14700CE": 17060610,
    "NIFTY21APR14900PE": 17063938,
    "NIFTY2140814700CE": 11217666
}
const rawdata17060610 = fs.readFileSync(path.join(__dirname, './data/nifty18-02apr-15min.json')); 
const rawdata17063938 = fs.readFileSync(path.join(__dirname,'./data/14900pe-18-02apr-15min.json')); 
const rawdata256265 = fs.readFileSync(path.join(__dirname,'./data/historicalData.json'));
const rawdata11217666 = fs.readFileSync(path.join(__dirname,'./data/CEhistoricalData.json'));


const _17060610 = JSON.parse(rawdata17060610);
const _17063938 = JSON.parse(rawdata17063938);
const _256265 = JSON.parse(rawdata256265);
const _11217666 = JSON.parse(rawdata11217666);


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

    this.placeOrder = (type) => {

    }

}


function KiteTicker() {
    this.subscribedToken = [];
    this.tickerCount = 0;
    this.autoReconnect = () => {

    }

    this.connect = () => {
        
    }

    makeTickerData = (candle, instrument_token) => {
        return ["open", "high", "low", "close"].map((type, index) => {
            const dt = new Date(candle.date);
        
            dt.setMinutes(dt.getMinutes()+index*(4));
            const tick = {
                tradable: true,
                mode: 'full',
                instrument_token,
                last_price: candle[type],
                timestamp: dt.toISOString()
        
            }
        return tick;
        
        
        })
    }

    handleOnTicks =(callBack) => {
        
        this.interval = setInterval(() => {
            console.log(this.tickerCount)
            if(this.tickerCount >=10) {
                clearInterval(this.interval);
                return
            }
            const subscribedToken = this.subscribedToken;
            
            const ticks = subscribedToken.map((token) => {
                const data = eval('_'+token);
                const currentData = data[this.tickerCount++];
                console.log("here")
                const ticker = makeTickerData(currentData, token);
                let i = 0;
                const tickerInterval = setInterval(() => {
                    callBack([ticker[i]]);
                    i++;
                    if(i === ticker.length) {
                        clearInterval(tickerInterval);
                    }
                }, 1000)
                // ticker.forEach(tick => {
                //     console.log("ticker")
                //     // callBack([tick])
                //     setTimeout(() => callBack([tick]), 1500);
                // })
            })

            
        }, 10000);
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
// x = new KiteConnect();
// // x.getInstruments().then(data => console.log(data));


// ticker = new KiteTicker();
// ticker.subscribe(["abc", "def"]);
// ticker.on("ticks", handleTick);
// function handleTick(tick) {
//     console.log({tick});
// }
// setTimeout(() => ticker.unsubscribe(["abc"]), 5000);


module.exports = {
    KiteConnect,
    KiteTicker,
}
