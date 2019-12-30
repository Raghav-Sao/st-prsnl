const axios = require('axios');
const yargs = require('yargs');
const tr = require('tor-request');
const _ = require('lodash');
const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const shttp = require('socks5-http-client');

const mongoUrl = 'mongodb://admin:optionchain@13.235.179.100:27017';
let DB;

function fetchViaTor(url) {
    const promise = new Promise((resolve, reject) => {
        console.log("sending");
        tr.request(url, function (err, res, body) {
            console.log(err, res);
            if (!err && res.statusCode == 200) {
              resolve({
                  res,
                  body,
              });
            } else {
                reject(err);
            }
          });
    });
    return promise;  
}



MongoClient.connect(mongoUrl, function(err, client) {
    if (err) {
        console.log('ERROR CONNECTING DB', err);
    } else {
        console.log('connection successfull');
        DB = client.db('option_chain').collection('nifty');
    }
});

const PARSED_ARGS = yargs.parse(process.argv);
const weekExpiry = PARSED_ARGS.weekExpiry;
const monthExpiry = PARSED_ARGS.monthExpiry;

const getOptionData = async (url) => {

    try {
        const momentTime =  moment().utcOffset("+05:30");
        const hours = momentTime.hours();
        const minutes = momentTime.minutes();
        if (true || ((hours > 9) && (hours < 15)) || (hours === 9 && minutes >=15) || (hours === 15 && minutes <= 30)) {
            const minuteTimeStamp = Math.floor(moment().unix()/60);
            const rawData = await axios.get(url);
            console.log(rawData, rawData);
            const readableTime = momentTime.format("DD-MMM-YYYY::HH:mm");
            const optData = rawData.data;
            console.log(monthExpiry, weekExpiry);
            // console.log(optData.records.data);
            const currentWeekData = _.filter(optData.records.data, (item) => item.expiryDate === weekExpiry);
            const currentMonthData  = _.filter(optData.records.data, (item) => item.expiryDate === monthExpiry);
            // console.log('currentWeekData', currentWeekData);
            const strikePrices = _.map(optData.records.data, 'strikePrice');
            const groupedWeekData = _.groupBy(currentWeekData, 'strikePrice');
            const groupedMonthData = _.groupBy(currentMonthData, 'strikePrice');
            const nearStrikePrices = _.filter(strikePrices, (val) => Math.abs(optData.records.underlyingValue - val) < 500);
            const weeklyRecord = createOptionRecord(nearStrikePrices, groupedWeekData, weekExpiry);
            const monthlyRecord = createOptionRecord(nearStrikePrices, groupedMonthData, monthExpiry)
            const record = {minuteTimeStamp,readableTime, currentPrice: optData.records.underlyingValue, weeklyRecord, monthlyRecord};
            DB.insertOne(record,  (err, result) => {
                if (err) {
                    console.log('SAVE  FAILED');
                    console.log(record);
                } else {
                    console.log('successfully saved record at ',  readableTime);
                }
            });
        } else {
            console.log('Waiting for market to open');
        }
        
    } catch(e) {
        console.log("ERRORRRR", e);
    }
}

function createOptionRecord(strikePrices, groupedData, expiry) {
    const result = {
        expiry,
        dataByStrikePrice: {},
    }
    _.forEach(strikePrices, (price) => {
        const datum = groupedData[`${price}`][0];
        const put  = datum['PE'];
        const call = datum['CE'];
        result.dataByStrikePrice[price] = {
            coi: _.get(call, 'openInterest'),
            cv: _.get(call, 'totalTradedVolume'),
            cdoi: _.get(call, 'changeinOpenInterest'),
            cbp: _.get(call, 'bidprice'),
            cbq: _.get(call, 'bidQty'),
            civ: _.get(call,'impliedVolatility'),
            ctbq: _.get(call, 'totalBuyQuantity'),
            ctsq: _.get(call, 'totalSellQuantity'),
            poi: _.get(put, 'openInterest'),
            pv: _.get(put, 'totalTradedVolume'),
            pdoi: _.get(put, 'changeinOpenInterest'),
            pbp:  _.get(put, 'bidprice'),
            pbq: _.get(put, 'bidQty'),
            piv: _.get(put,'impliedVolatility'),
            ptbq: _.get(put, 'totalBuyQuantity'),
            ptsq:_.get(put, 'totalSellQuantity'),
        };
    });
    return result;
}

// setInterval(() => {
//     getOptionData('https://beta.nseindia.com/api/option-chain-indices?symbol=NIFTY');
// }, 1000*5)

//https://beta.nseindia.com/api/option-chain-indices?symbol=NIFTY

var Agent = require('socks5-http-client/lib/Agent');

axios({
	url: 'https://beta.nseindia.com/api/option-chain-indices?symbol=NIFTY',
	agentClass: Agent,
	agentOptions: {
		socksHost: 'my-tor-proxy-host', // Defaults to 'localhost'.
		socksPort: 9050 // Defaults to 1080.
	}
}, function(err, res) {
	console.log(err || res.body);
}).then((res)=>{
    console.log(res);
});