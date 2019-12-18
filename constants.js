const charts = {
    'NIFTY19D1912100CE': 11298050,
    'NIFTY19D1912000PE': 11296770,
    'NIFTY': 256265,
};

module.exports = {
    API_KEY: "a062yq2tywqk1e4j",
    API_SECRET: "im93kns7sjst8ylg8y7ubypjtmz4dqgr",
    REQUEST_TOKEN: "fF0QTR6hAJzSyAFnkjWUL2iKT5wNdyzb",
    CALL_WEEKLY: { chartId: 11300098, symbol: "NIFTY19D1912250CE" },
    PUT_WEEKLY: { chartId: 11298818, symbol: "NIFTY19D1912150PE" },
    NIFTY: charts.NIFTY,
    chartByStrike: {
        call: {
            12100: {
                chartId: 9505794,
                symbol: 'NIFTY19DEC12100CE',
            },
            12150: {
                chartId: 13257986,
                symbol: 'NIFTY19DEC12150CE',
            },
            12200: {
                chartId: 10481922,
                symbol: 'NIFTY19DEC12200CE'
            },
            12250: {
                chartId: 13275138,
                symbol: 'NIFTY19DEC12250CE'
            },
            12300: {
                chartId: 11129858,
                symbol: 'NIFTY19DEC12300CE'
            },
            12350: {
                chartId: 13276418,
                symbol: 'NIFTY19DEC12350CE'
            },
            12400: {
                chartId: 10292994,
                symbol: 'NIFTY19DEC12400CE'
            },
        },
        put: {
            12100: {
                chartId: 9506562,
                symbol: 'NIFTY19DEC12100PE',
            },
            12150: {
                chartId: 13273858,
                symbol: 'NIFTY19DEC12150PE',
            },
            12200: {
                chartId: 10483458,
                symbol: 'NIFTY19DEC12200PE'
            },
            12250: {
                chartId: 13275394,
                symbol: 'NIFTY19DEC12250PE'
            },
            12300: {
                chartId: 11130114,
                symbol: 'NIFTY19DEC12300PE'
            },
            12350: {
                chartId: 13277442,
                symbol: 'NIFTY19DEC12350PE'
            },
            12400: {
                chartId: 10294018,
                symbol: 'NIFTY19DEC12400PE'
            },
        }
    }

};


// https://kite.trade/connect/login?api_key=a062yq2tywqk1e4j&v=3