const getStrikeForOption = ({currentPrice, optionType}) => {
    const modifier  = optionType === "CE" ? - 10 : 60;
    const price = parseInt((currentPrice + modifier )/50)*50
    return price
}

module.exports = {
    getStrikeForOption,
}

