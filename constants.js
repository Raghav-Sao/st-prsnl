const charts = {
    'NIFTY19D1912100CE': 11298050,
    'NIFTY19D1912000PE': 11296770,
    'NIFTY': 256265,
};

module.exports = {
    API_KEY: "a062yq2tywqk1e4j",
    API_SECRET:"im93kns7sjst8ylg8y7ubypjtmz4dqgr",
    REQUEST_TOKEN: "fF0QTR6hAJzSyAFnkjWUL2iKT5wNdyzb",
    CALL_WEEKLY: {chartId: 11300098, symbol: "NIFTY19D1912250CE"},
    PUT_WEEKLY: {chartId: 11298818, symbol: "NIFTY19D1912150PE"},
    NIFTY: charts.NIFTY,
    chartByStrike:  {
        call: {
            11950: {
                chartId: 11296002,
                symbol: 'NIFTY19D1911950CE',
            },
            12000: {
                chartId: 11296514,
                symbol: 'NIFTY19D1912000CE',
            },
            12050: {
                chartId: 11297026,
                symbol: 'NIFTY19D1912050CE',
            },
            12100: {
                chartId: 11298050,
                symbol: 'NIFTY19D1912100CE',
            },
            12150: {
                chartId: 11298562,
                symbol: 'NIFTY19D1912150CE',
            },
            12200: {
                chartId: 11299586,
                symbol: 'NIFTY19D1912200CE'
            },
            12250: {
                chartId: 11300098,
                symbol: 'NIFTY19D1912250CE'
            },
        },
        put: {
            11950: {
                chartId: 11296258,
                symbol: 'NIFTY19D1911950PE',
            },
            12000: {
                chartId: 11296770,
                symbol: 'NIFTY19D1912000PE',
            },
            12050: {
                chartId: 11297282,
                symbol: 'NIFTY19D1912050PE',
            },
            12100: {
                chartId: 11298306,
                symbol: 'NIFTY19D1912100PE',
            },
            12150: {
                chartId: 11298818,
                symbol: 'NIFTY19D1912150PE',
            },
            12200: {
                chartId: 11299842,
                symbol: 'NIFTY19D1912200PE'
            },
            12250: {
                chartId: 11300354,
                symbol: 'NIFTY19D1912250PE'
            },

        }
    }

};


// https://kite.trade/connect/login?api_key=a062yq2tywqk1e4j&v=3