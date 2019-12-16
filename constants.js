const charts = {
    'NIFTY19D1912100CE': 11298050,
    'NIFTY19D1912000PE': 11296770,
    'NIFTY': 256265,
};

module.exports = {
    API_KEY: "a062yq2tywqk1e4j",
    API_SECRET:"im93kns7sjst8ylg8y7ubypjtmz4dqgr",
    REQUEST_TOKEN: "fF0QTR6hAJzSyAFnkjWUL2iKT5wNdyzb",
    CALL_WEEKLY: charts["NIFTY19D1912100CE"],
    PUT_WEEKLY: charts["NIFTY19D1912000PE"],
    NIFTY: charts.NIFTY ,
    [charts["NIFTY19D1912100CE"]]: "NIFTY19D1912100CE",
    [charts["NIFTY19D1912000PE"]]: "NIFTY19D1912000PE",
};


// https://kite.trade/connect/login?api_key=a062yq2tywqk1e4j&v=3