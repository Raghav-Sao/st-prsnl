const EventEmitter = require('events');
const emitter = new EventEmitter();
const moment = require('moment');
const _ =  require('lodash');
var KiteTicker = require("kiteconnect").KiteTicker;
const KiteConnect = require("kiteconnect").KiteConnect;
const constants = require('./constants');
const utils = require('./utils');
const fs = require('fs');
const { reject } = require('lodash');
const INTERVAL = 900;
let ACCESS_TOKEN;
let PUBLIC_TOKEN;
let REQUEST_TOKEN = process.argv[2];
console.log('REQUEST_TOKEN...', REQUEST_TOKEN);
const EXPIRY = constants.EXPIRY;
let subscribedToken = [];
let instrument_tokens = {};
const kc = new KiteConnect({
	api_key: constants.API_KEY
});




async function getHistoricalData({ instrumentTokens, interval, fromDate, toDate}) {
    return new Promise((resolve, reject) => {

        kc.generateSession(REQUEST_TOKEN, constants.API_SECRET)
        .then(async function(response) {
            console.log("response", response.access_token)
            ACCESS_TOKEN = response.access_token;
            PUBLIC_TOKEN = response.public_token;
            // console.log("response", response);
            init();
        
        console.log("here", { instrumentTokens, interval, fromDate, toDate})
        const today = new Date();
        // if(instrument_tokens.length < 1) {
        //     return {success: false, data: []};
        // }

        // if(!interval) {
        //     return {success: false, data: []};
        // }

        // if(!fromDate) {
        //     fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-40);
        // }

        // if(!toDate) {
        //     toDate = today;
        // }
        // console.log(instrumentTokens, interval, fromDate, toDate,"-->");
    
            // instrumentTokens.forEach(async token => {
                const token = instrumentTokens[0]
                try {
                // const res = await kc.getHistoricalData(token, interval, fromDate, toDate);
                // const res = await kc.getHistoricalData(token, interval, new Date("2021-04-01T03:45:00.000Z"), new Date("2021-04-01T09:45:00.000Z"));
                // const candle = res.data.candels;
                // console.log(JSON.stringify(res));
                // console.log(res[0], new Date(res[0].date).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'}))
                // console.log(res[res.length -1], new Date(res[res.length -1].date).toLocaleString('en-US', {timeZone: 'Asia/Kolkata'}))

                // let fromStr = new Date("2021-04-01T03:45:00.000Z");
                // fromStr = fromStr.getFullYear
                const fSTR = moment(fromDate).format("YYYY-MM-DD HH:mm:SS");
                const tSTR = moment(toDate).format("YYYY-MM-DD HH:mm:SS");
                // const fSTR = moment("2021-04-01T03:45:00.000Z").format("YYYY-MM-DD HH:mm:SS");
                // const tSTR = moment("2021-04-01T09:45:00.000Z").format("YYYY-MM-DD HH:mm:SS");
                // const res1 = await kc.getHistoricalData(token, interval, fSTR, tSTR);
                console.log(fSTR, tSTR);
                // const res1 = await kc.getHistoricalData(token, interval, new Date("2021-04-01 09:15:00"),  new Date("2021-04-01 15:15:00"));
                const res1 = await kc.getHistoricalData(token, interval, fSTR,  tSTR);
                // const res1 = await kc.getHistoricalData(token, interval, fSTR,  tSTR);
                // console.log(JSON.stringify(res1));


                resolve(res1);
            } catch(error) {
                reject(error)
                console.log(error,"error......");
            }
                //calculate rsi for last candle and add to last candle
            // })
        
        
    

})
.catch(function(err) {
    console.log({err});
});
    
    });
    
}
async function init() {  
    console.log("init"); 
    setInterval(async () => {
        const postions = await kc.getPositions();
        // console.log('positions', 'postions');
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
    }, 10*1000);
}

console.log("here,,,")
module.exports = {
    getHistoricalData,
}
