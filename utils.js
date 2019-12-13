module.exports.getFibonaccitRacement = (startPrice, range, upperLevel) => {
    const retracementLevel = [1.618, 2.618, 3.618, 4.236];
    return retracementLevel.map(( level) => upperLevel ? startPrice + range * level : startPrice - range * level);
}

module.exports.getLot = (capital, optionPrice, lotSize = 75) => {
    const lot = parseInt(capital / (optionPrice * lotSize));
    const price = lot * lotSize * optionPrice;
    return {lot, price}
}

module.exports.checkForPartialProfit = (close, fibonaciLevel, calculatePartialBookLotSize, isUpperBreakout, range) => {
    let additionalRange = 0;
    if(range < 20) {
        additionalRange = 3;
    }
    return isUpperBreakout ? fibonaciLevel[calculatePartialBookLotSize + additionalRange] < close : fibonaciLevel[calculatePartialBookLotSize + additionalRange] > close
}

module.exports.calculatePartialBookLotSize = (lotSize) => {
    return parseInt(lotSize * 20 / 100); /* booking 20 of lot */
}