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
            12000: {
                chartId: 11809282,
                symbol: 'NIFTY2010212000CE',
            },
            12050: {
                chartId: 11810050,
                symbol: 'NIFTY2010212050CE',
            },
            12100: {
                chartId: 11811074,
                symbol: 'NIFTY2010212100CE',
            },
            12150: {
                chartId: 11811586,
                symbol: 'NIFTY2010212150CE',
            },
            12200: {
                chartId: 11812098,
                symbol: 'NIFTY2010212200CE'
            },
            12250: {
                chartId: 11812866,
                symbol: 'NIFTY2010212250CE'
            }, 
            12300: {
                chartId: 11813634,
                symbol: 'NIFTY2010212300CE'
            }
        },
        put: {
            12000: {
                chartId: 11809538,
                symbol: 'NIFTY2010212000PE',
            },
            12050: {
                chartId: 11810818,
                symbol: 'NIFTY2010212050PE',
            },
            12100: {
                chartId: 11811330,
                symbol: 'NIFTY2010212100PE',
            },
            12150: {
                chartId: 11811842,
                symbol: 'NIFTY2010212150PE',
            },
            12200: {
                chartId: 11812354,
                symbol: 'NIFTY2010212200PE'
            },
            12250: {
                chartId: 11813378,
                symbol: 'NIFTY2010212250PE'
            },
            12300: {
                chartId: 11814914,
                symbol: 'NIFTY2010212300PE'
            }, 
            12350: {
                chartId: 11815426,
                symbol: 'NIFTY2010212350PE'
            }
        }
    }

};


// https://kite.trade/connect/login?api_key=a062yq2tywqk1e4j&v=3