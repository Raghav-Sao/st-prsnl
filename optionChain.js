const axios = require('axios');

const getOptionData = async (url) => {
    try {
        const optData = await axios.get(url);
        console.log('optData.data.records.data.length', optData.data.records.data.length);
    } catch(e) {
        console.log("ERRORRRR", e);
    }
}

setInterval(() => {
    getOptionData('https://beta.nseindia.com/api/option-chain-indices?symbol=NIFTY');
}, 10000)

//https://beta.nseindia.com/api/option-chain-indices?symbol=NIFTY