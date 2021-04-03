const mailgun = require("mailgun-js");
const apiKey = "key-8a4180fb3084e2636f4391915dc2ecdd";
const DOMAIN = 'sandbox92ca7d2554944d7c865bed9a2ed02a7a.mailgun.org';
const mg = mailgun({apiKey: apiKey, domain: DOMAIN});


const sendEmail = ({text, subject}) => {
    const data = {
        from: 'Trader <me@samples.mailgun.org>',
        to: 'saoraghav@gmail.com, saoraghavendra@gmail.com, rishabdev919@gmail.com',
        subject: subject || 'Algo Trading Update',
        text
    };
    mg.messages().send(data, function (error, body) {
        // if (error) {
        //     console.log(err)
        // }
        // console.log(body);
    });
}

const getStrikeForOption = ({currentPrice, optionType}) => {
    const modifier  = optionType === "CE" ? - 10 : 60;
    const price = parseInt((currentPrice + modifier )/50)*50
    return price
}

const getNearestITMOptionStrike = niftyStrike => {
    const callStrike = parseInt(niftyStrike / 200) * 200;
    const putStrike = parseInt( (niftyStrike + 200) / 200) * 200;
    return {callStrike, putStrike}
}


const includeRSI = (candle, lastCandle) => {
    const transformedCandle = candle;
    const move = transformedCandle.close - (lastCandle ? lastCandle.close : 0);
    const upMove = move > 0 ? move : 0;
    let lastUpMoveAvg = lastCandle ? lastCandle.upMoveAvg : transformedCandle.close;
    let lastDownMoveAvg = lastCandle ? lastCandle.downMoveAvg : transformedCandle.close;
    let lastUpMoveAvg21 = lastCandle ? lastCandle.upMoveAvg21 : transformedCandle.close;
    let lastDownMoveAvg21 = lastCandle ? lastCandle.upMoveAvg21 : transformedCandle.close;

    const downMove = move < 0  ? Math.abs(move) : 0;
    const period = 14;
    const upMoveAvg = (upMove/period) + (((period -1)*lastUpMoveAvg)/period);
    const downMoveAvg = (downMove/period) + (((period -1)*lastDownMoveAvg)/period);
    const upMoveAvg21 = (upMove/21) + (((21 -1)*lastUpMoveAvg21)/21);
    const downMoveAvg21 = (downMove/21) + (((21 -1)*lastDownMoveAvg21)/21);

    const rs = upMoveAvg/downMoveAvg;
    const rs21 = upMoveAvg21/downMoveAvg21;
    const rsi = (100 - (100/ (1 + rs)));
    const rsi21 = rsi;
    transformedCandle.upMoveAvg = upMoveAvg;
    transformedCandle.downMoveAvg = downMoveAvg;
    transformedCandle.upMoveAvg21 = upMoveAvg21;
    transformedCandle.downMoveAvg21 = downMoveAvg21;
    transformedCandle.rsi = rsi;
    transformedCandle.rsi21 = rsi21;
    return transformedCandle;
}

module.exports = {
    getStrikeForOption,
    sendEmail,
    getNearestITMOptionStrike,
    includeRSI,
}

