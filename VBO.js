const fs = require('fs');
const rawData = fs.readFileSync('./VBOData.json');
const parsedData = JSON.parse(rawData);

let currentDate = null;
let currentORHigh = null;
let currentORLow = null;
let tradeType = null;
let tradeStartedPrice = null;
let profit = 0;
let totalProfit = 0;

const {
    data: {
        candles = []
    } = {},
} = parsedData;
console.log(candles.length);


const startTrade = candles => {
    candles.forEach(candle => {

        const [timeStamp, open, high, low, close ] = candle;
        const date = new Date(timeStamp);
        const dateValue = date.getDate();
        const minute = date.getMinutes();
        const hour = date.getHours();
        const day = date.getDay();
        if(day === 4) {

        } else {
            if(currentDate && currentDate === dateValue) {
                if(!tradeType && close > currentORHigh) {
                    console.log(`OR Break out done ^^^^^^^^^^^`);
                    tradeType = 'ORBO';
                    tradeStartedPrice = close;
                } else if(!tradeType && close < currentORLow) {
                    console.log(`OR Break donw done VVVVVVVVVVVVVV ${currentORLow} ${close} at ${hour}: ${minute}`);
                    tradeType =  'ORBD';
                    tradeStartedPrice = close;
                } else if(tradeType === 'ORBO') {
                    if(close <= currentORHigh) {
                        console.log(`********EXIT from trade upside *********** at ${hour}: ${minute}`)
                        tradeType = null;
                        profit = close - tradeStartedPrice;
                    } 
                } else if(tradeType === 'ORBD') {
                    if(close >= currentORLow) {
                        console.log(`********EXIT from trade downside*********** at ${hour}: ${minute}`)
                        tradeType = null;
                        profit = tradeStartedPrice - close;  
                    }
                }
                if( hour === 15 && minute === 15 ) {
                    if(tradeType === 'ORBO') {
                        profit = close - tradeStartedPrice;
                    } else if(tradeType === 'ORBD'){
                        profit = tradeStartedPrice - close;   
                    }
                    console.log(`*************** Day End with ${profit} profit***********`)
                    tradeType = null;
                    totalProfit = totalProfit + profit;
                    profit = 0;
                }
            } else {
                console.log(hour, minute)
                if( hour === 9 && minute === 15 ) {
                    console.log(`-------------------- Starting For ${date.toDateString()} --------------------`);
                    console.log(`opening range for today is ${high - low} point ${high} -  ${low}`);
                    currentORHigh = high;
                    currentORLow = low;
                    currentDate = dateValue;
                    profit = 0;
                }
            }
        }
    });
    console.log(`total Profit ${totalProfit}`)
}
startTrade(candles);
