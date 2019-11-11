const API = require('indian-stock-exchange');
const MongoClient = require('mongodb').MongoClient;

 
const NSEAPI = API.NSE;
const BSEAPI = API.BSE;
const MONGO_URI = "mongodb+srv://rishabdev919:5%2Aholiday@cluster0-72oko.mongodb.net/test?retryWrites=true&w=majority";
let dbInstance;
MongoClient.connect(MONGO_URI, function(err, client) {
  console.log("Connected successfully to server");
  console.log(err, client);
  dbInstance = client.db("stock_exp");
  // client.close();
});




NSEAPI.getCandleStickData('NIFTY 50', 15, true)
.then(function (response) { 
  console.log(response.data); //return the api data
  const move = response.data.map((item, index) => {
    if (index === 0) {
        return null;
    }
    return (Number(item.g1C)  - Number(response.data[index -1].g1C));
  });
  const result = getRsi(move, 14);
  for(let i = 0; i<result.length; i++) {
      console.log(result[i],  response.data[i].date);
  }
 });

let CAPITAL = 20000;
let tradeOpen = false;
const checkTradeOpenCondition = ({lastRsi, currentRsi, lastCandle, currentCandle}) => {
    let stopLoss;
    if (lastRsi < 50 && currentRsi > 50) {
        // Buy
        stopLoss = Number(lastCandle.g1L); 
        tradeOpen = true;

    } else if (lastRsi > 50 && currentRsi < 50){
        // sell
        stopLoss = Number(lastCandle.g1H);
        tradeOpen = true;

    }
}

((async function openBuyTrade() {
  const response = await NSEAPI.getCandleStickData('NIFTY 50',  15, true);

  console.log("NSEAPI", response.data);
})())

const getRsi = (move, period = 14) => {
  const result = [null];  
  let lastUpAvg = move[1] > 0 ? move[1] : 0;
  let lastDownAvg = move[1] < 0 ? Math.abs(move[1]):0;
  for(let i = 1; i  < move.length; i++) {
    const moveUp = move[i] > 0 ? move[i] : 0;
    const moveDown = move[i] < 0 ? Math.abs(move[i]) : 0;  
    const upMoveAvg = ((1/period) * moveUp) + (((period - 1)/period)*lastUpAvg);
    const downMoveAvg = ((1/period) * moveDown) + (((period - 1)/period)*lastDownAvg);
    lastUpAvg = upMoveAvg;
    lastDownAvg = downMoveAvg;
    const rs = upMoveAvg/downMoveAvg;
    const rsi = 100 - (100/ (1 + rs));
    result.push(rsi);
  }
  return result;
}

const average = (arr, total = arr.length) => {
    const sum = arr.reduce((acc, item) => acc+item, 0);
    return sum/total;
}
