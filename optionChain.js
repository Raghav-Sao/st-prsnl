const axios = require('axios');
const yargs = require('yargs');
const _ = require('lodash');
const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const proxyRequest = require('request-promise');

const mongoUrl = 'mongodb://admin:optionchain@13.235.179.100:27017';
let DB;

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

const analyse = () => {
    const records = DB.find({});

};
const getOptionData = async (url) => {

    try {
        const momentTime =  moment().utcOffset("+05:30");
        const hours = momentTime.hours();
        const minutes = momentTime.minutes();
        if (true || ((hours > 9) && (hours < 15)) || (hours === 9 && minutes >=15) || (hours === 15 && minutes <= 30)) {
            console.log('requestinng');
            const minuteTimeStamp = Math.floor(moment().unix()/60);
            const config = {
                url,
                //: 'https://support.zerodha.com/category/trading-and-markets/kite-web-and-mobile/articles/kite-option-chain',
                 headers: {
                //     // 'authority': 'beta.nseindia.com',
                //     // ':path' : '/api/option-chain-indices?symbol=NIFTY',
                //     'scheme': 'https',
                //     'accept': 'text/html',
                //     // 'accept-encoding': 'gzip, deflate, br',
                //     'accept-language': 'en-US,en;q=0.9,hi;q=0.8',
                //     'cache-control': 'no-cache',
                //     'cookie': '_ga=GA1.2.1131240121.1572192743; _ga=GA1.3.1131240121.1572192743; _gid=GA1.2.555304031.1577768936; _gid=GA1.3.555304031.1577768936; nseQuoteSymbols=[{"symbol":"NIFTY","identifier":"OPTIDXNIFTY02-01-2020PE12150.00","type":"equity"}]; ak_bmsc=AE32CE01331DFBF003C2A1C9B66D23DEB81AA29AA57D00007B350C5E2DFD9009~ple5KsEwCNLlJhpCY85x7UshpWwX0Kwc9HAOTUXbnj+5y0Frahojy33Dh9bmFczs0ok2byRwwzRSylkrBcyWK4LJuZKRNR07dqPIU2AroWicBP7Uxa9SiK2D/v4H0e6123FWZLX4qnRj8/0ntBHTb3GqpOUdX52E9UZkn/ATPXa5gFEeXLNvuKDnr6aW9s9Ke5TRgTXW6Kn27BUYenTqNwDexMPSNmaZsVQH3rezqGr8uOxm23t8zFuF2EMSIC1jD9; RT="z=1&dm=nseindia.com&si=1de2cb57-2cad-456d-ae3f-656a5883287e&ss=k4uwqzf9&sl=1&tt=p4&bcn=%2F%2F60062f0c.akstat.io%2F&ld=87dl"; bm_sv=621A37A7E90D1F2200BC70788BDA8AFD~wsAxSPr0WOUkJbZBOZHNCfn+dkakgnkHizqFF9oeGJ56/xq7JoHL9hW+ke+88NZAGGW086L9/771C+dwr0J+e3M6qn9HeN/cONrqNS6G+bP17EgioWDW8YM1QEV5R2GQ17s22GjebTcMQtMK+HbOFUJNh25JhzGiNwuaq5I+/pA=',
                //     'pragma': 'no-cache',
                //     'sec-fetch-mode': 'navigate',
                //     'sec-fetch-site': 'none',
                //     // 'sec-fetch-user': '?1',
                //     // 'upgrade-insecure-requests': 1,
                //     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36'
                //     //'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
                //     // cookie: '_ga=GA1.2.1131240121.1572192743; _ga=GA1.3.1131240121.1572192743; _gid=GA1.2.555304031.1577768936; bm_mi=1BB648767874929964069188BB5994F4~l925gU0GDnC000kA3oEisrzSKDtHQQiMvUOldLuz215Ut2gspip0eJ0fj2sMLf+jdTBoMKZC553vGi+bp9DykNxYeZoI82RYOOqEo8rwiS8lbZ/V7+vfpF8lJ+yrsRc0U9L2ynJpD6iw2WCcrgGbPb9cwVlYgCKkM+N69hcPTj0oQYiPqplkNm91pVf7Z6t3moKHCW3Xud9r8aV6TI+N/DJNTQqYx6zclPXLc41CmdQxt0ncRU5fXt7qunHrbYt3wToScpYCYpy7iaDz3nX+3Q==; ak_bmsc=0AAADE5E0D45EFDB4A8B5D8CD1B146D5B81AA29AA57D000072180C5E0776F944~plYiU5FShLZVLWhIaCcDe9N0Gk7lvcigUjbuTmWiDuBr8J4bkH7jeKdyDY212R8ilo0HNFSR9W/BMgpfPAILLPxlZOzGbAtjyRAaaoL+Gq9vU+MbVQ/PVZOQ+S0UHvuAqai7q5dIhJl19bDnfUEUT1IsKknBapJ1HeZV7pSjJpE4DWtOLjHlK/qTqg6aJAlJCCGijEx+/O4m4GbFvWj55m0jaJWVmP9jRzBkvkPAfEoZA4R7G7oPWBzWwXfJNMGcao; _gid=GA1.3.555304031.1577768936; _gat_UA-143761337-1=1; nseQuoteSymbols=[{"symbol":"NIFTY","identifier":"OPTIDXNIFTY02-01-2020PE12150.00","type":"equity"}]; RT="z=1&dm=nseindia.com&si=1de2cb57-2cad-456d-ae3f-656a5883287e&ss=k4us5zg1&sl=4&tt=5rj&bcn=%2F%2F684d0d3d.akstat.io%2F&ld=28y9&nu=6b96127c5a8e328d0702b520ede803c3&cl=2m71"; bm_sv=F1346FA46DE34D3F8CCBB2C502B4DB79~wsAxSPr0WOUkJbZBOZHNCUiDEnt2sCJMoQcScd9YiS59LrBajjoLPDLqRovV0vZ0pfJcq24mdGFbPGtNXvIIk25VM/OmJV7TGBwWxO6QMzqMAgoL4ARu5ODDLYMH5+BU0QHLIoJk6zz99IqzZaXcGtyvpPN6muBxTXxGXKXPg8I=',
                //     // referer: 'https://beta.nseindia.com/get-quotes/derivatives?symbol=NIFTY&identifier=OPTIDXNIFTY02-01-2020PE12150.00'

                 },
                // proxy: 'http://lum-customer-hl_12ca094e-zone-opt_chain:q6ktwr249hph@zproxy.lum-superproxy.io:22225',
            }
            const rawData = await proxyRequest(config);
            console.log('rawData', rawData);
            const readableTime = momentTime.format("DD-MMM-YYYY::HH:mm");
            const optData = JSON.parse(rawData);
            console.log('records', optData.records.data.length);
            console.log(monthExpiry, weekExpiry);
            const currentWeekData = _.filter(optData.records.data, (item) => item.expiryDate === weekExpiry);
            const currentMonthData  = _.filter(optData.records.data, (item) => item.expiryDate === monthExpiry);
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

setTimeout(() => {
   // getOptionData('https://beta.nseindia.com/api/option-chain-indices?symbol=NIFTY');
}, 1000)

//https://beta.nseindia.com/api/option-chain-indices?symbol=NIFTY
//node optionChain --weekExpiry 02-Jan-2020 --monthExpiry 30-Jan-2020