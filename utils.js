module.exports.getFibonaccitRacement = (startPrice, range, upperLevel) => {
    const retracementLevel = [1.618, 2.618, 3.618, 4.236];
    return retracementLevel.map(( level) => upperLevel ? startPrice + range * level : startPrice - range * level);
}

module.exports.getLot = (capital, optionPrice, lotSize = 75) => {
    const lot = parseInt(capital / (optionPrice * lotSize));
    const price = lot * lotSize * optionPrice;
    return {lot, price}
}

module.exports.checkForPartialProfit = (close, fibonaciLevel, calculatePartialBookLotSize, isUpperBreakout) => {
    return isUpperBreakout ? fibonaciLevel[calculatePartialBookLotSize] < close : fibonaciLevel[calculatePartialBookLotSize] > close
}

module.exports.calculatePartialBookLotSize = (lotSize) => {
    return parseInt(lotSize * 20 / 100); /* booking 20 of lot */
}