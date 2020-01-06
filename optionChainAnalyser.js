const moment = require("moment");
const fs = require('fs');

const candles = JSON.parse(fs.readFileSync('./testData/200_pe.json')).data.candles;
const analyser = () => {
    let dayStartCandle = candles[0];
    candles.forEach((candle) => {
        const time = moment(candle[0]);
        if (time.hours() === 9 && time.minutes() === 15 ) {
            console.log(candle);
            dayStartCandle = candle;
            console.log(candle[6]);
            console.log("------ NEW DAY  ----")
        }

        console.log(dayStartCandle[6]);
        console.log(`${candle[0]} - OI CHANGE - ${((candle[6] - dayStartCandle[6])*100)/dayStartCandle[6]} <<<->>> VOL CHANGE  - ${((candle[5] - dayStartCandle[5])*100)/dayStartCandle[5]}`)
    });
}

analyser();