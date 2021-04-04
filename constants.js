const charts = {
    'NIFTY19D1912100CE': 11298050,
    'NIFTY19D1912000PE': 11296770,
    'NIFTY': 11217666,
    // 'NIFTY': 256265,
    // 'NIFTY': 58108679,
};

module.exports = {
    API_KEY: "axtws9lg5tx5oonh",
    API_SECRET: "zfvu6s5u1llgwv54mgmrqdivbzdmru29",
    REQUEST_TOKEN: "IU21Hgx3P4m85PWOFjyAsuiRlFteW71z",
    CALL_WEEKLY: { chartId: 9907714, symbol: "NIFTY19D1912250CE" },
    PUT_WEEKLY: { chartId: 9907970, symbol: "NIFTY19D1912150PE" },
    NIFTY: charts.NIFTY,
    EXPIRY: "NIFTY21408",
    chartByStrike: {
        call: {
            11800: {
                chartId: 10870274,
                symbol: 'NIFTY2011611800CE',
            },
            11850: {
                chartId: 10870786,
                symbol: 'NIFTY2011611850CE',
            },
            11900: {
                chartId: 10875906,
                symbol: 'NIFTY2011611900CE',
            },
            11950: {
                chartId: 10877954,
                symbol: 'NIFTY2011611950CE',
            },
            12000: {
                chartId: 10879490,
                symbol: 'NIFTY2011612000CE',
            },
            12050: {
                chartId: 10880002,
                symbol: 'NIFTY2011612050CE',
            },
            12100: {
                chartId: 10880514,
                symbol: 'NIFTY2011612100CE',
            },
            12150: {
                chartId: 10881026,
                symbol: 'NIFTY2011612150CE',
            },
            12200: {
                chartId: 10881538,
                symbol: 'NIFTY2011612200CE'
            },
            12250: {
                chartId: 10882050,
                symbol: 'NIFTY2011612250CE'
            },
            12300: {
                chartId: 10882562,
                symbol: 'NIFTY2011612300CE'
            },
            12350: {
                chartId: 10883074,
                symbol: 'NIFTY2011612350CE'
            },
            12400: {
                chartId: 10883586,
                symbol: 'NIFTY2011612400CE'
            },
        },
        put: {
            11800: {
                chartId: 10870530,
                symbol: 'NIFTY2011611800PE',
            },
            11850: {
                chartId: 10871042,
                symbol: 'NIFTY2011611850PE',
            },
            11900: {
                chartId: 10876162,
                symbol: 'NIFTY2011611900PE',
            },
            11950: {
                chartId: 10878210,
                symbol: 'NIFTY2011611950PE',
            },
            12000: {
                chartId: 10879746,
                symbol: 'NIFTY2011612000PE',
            },
            12050: {
                chartId: 10880258,
                symbol: 'NIFTY2011612050PE',
            },
            12100: {
                chartId: 10880770,
                symbol: 'NIFTY2011612100PE',
            },
            12150: {
                chartId: 10881282,
                symbol: 'NIFTY2011612150PE',
            },
            12200: {
                chartId: 10881794,
                symbol: 'NIFTY2011612200PE'
            },
            12250: {
                chartId: 10882306,
                symbol: 'NIFTY2011612250PE'
            },
            12300: {
                chartId: 10882818,
                symbol: 'NIFTY2011612300PE'
            },
            12350: {
                chartId: 10883330,
                symbol: 'NIFTY2011612350PE'
            },
            12400: {
                chartId: 10883842,
                symbol: 'NIFTY2011612400PE'
            }
        }
    }

};


// https://kite.trade/connect/login?api_key=axtws9lg5tx5oonh&v=3