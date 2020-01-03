const charts = {
    'NIFTY19D1912100CE': 11298050,
    'NIFTY19D1912000PE': 11296770,
    'NIFTY': 256265,
};

module.exports = {
    API_KEY: "a062yq2tywqk1e4j",
    API_SECRET: "im93kns7sjst8ylg8y7ubypjtmz4dqgr",
    REQUEST_TOKEN: "fF0QTR6hAJzSyAFnkjWUL2iKT5wNdyzb",
    CALL_WEEKLY: { chartId: 9907714, symbol: "NIFTY19D1912250CE" },
    PUT_WEEKLY: { chartId: 9907970, symbol: "NIFTY19D1912150PE" },
    NIFTY: charts.NIFTY,
    chartByStrike: {
        call: {
            12000: {
                chartId: 9888770,
                symbol: 'NIFTY2010912000CE',
            },
            12050: {
                chartId: 9889282,
                symbol: 'NIFTY2010912050CE',
            },
            12100: {
                chartId: 9889794,
                symbol: 'NIFTY2010912100CE',
            },
            12150: {
                chartId: 9890818,
                symbol: 'NIFTY2010912150CE',
            },
            12200: {
                chartId: 9891330,
                symbol: 'NIFTY2010912200CE'
            },
            12250: {
                chartId: 9899522,
                symbol: 'NIFTY2010912250CE'
            }, 
            12300: {
                chartId: 9907714,
                symbol: 'NIFTY2010912300CE'
            }
        },
        put: {
            12000: {
                chartId: 9889026,
                symbol: 'NIFTY2010912000PE',
            },
            12050: {
                chartId: 9889538,
                symbol: 'NIFTY2010912050PE',
            },
            12100: {
                chartId: 9890050,
                symbol: 'NIFTY2010912100PE',
            },
            12150: {
                chartId: 9891074,
                symbol: 'NIFTY2010912150PE',
            },
            12200: {
                chartId: 9891586,
                symbol: 'NIFTY2010912200PE'
            },
            12250: {
                chartId: 9900034,
                symbol: 'NIFTY2010912250PE'
            },
            12300: {
                chartId: 9907970,
                symbol: 'NIFTY2010912300PE'
            },
        }
    }

};


// https://kite.trade/connect/login?api_key=a062yq2tywqk1e4j&v=3