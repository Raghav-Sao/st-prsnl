(base) office@Raghav stock_exp (15minrsi) $ node dynamicOptionExchange.js tV5sSIKipV0gvdCwLFrSlpKwP4m5yfkO
REQUEST_TOKEN IU21Hgx3P4m85PWOFjyAsuiRlFteW71z
response { user_type: 'individual',
  email: 'saoraghavendra@gmail.com',
  user_name: 'Raghavendra Sao',
  user_shortname: 'Raghavendra',
  broker: 'ZERODHA',
  exchanges: [ 'BFO', 'CDS', 'BSE', 'MCX', 'NFO', 'MF', 'NSE' ],
  products: [ 'CNC', 'NRML', 'MIS', 'BO', 'CO' ],
  order_types: [ 'MARKET', 'LIMIT', 'SL', 'SL-M' ],
  avatar_url: null,
  user_id: 'YM0807',
  api_key: 'axtws9lg5tx5oonh',
  access_token: '7uXZ9jg05yR8ti4uuyqqTO0tzyZ0Mqiu',
  public_token: 'crOqrdzt5cymvSkfltm2wVDKZOZ6d0Op',
  refresh_token: '',
  silo: '',
  login_time: 2021-04-01T03:28:31.000Z,
  meta: { demat_consent: 'physical' } }
{ callStrike: 44800, putStrike: 45000, niftyStrike: 44970 }
[ { instrument_token: '58257927',
    exchange_token: '227570',
    tradingsymbol: 'GOLDM21APR44800CE',
    name: 'GOLDM',
    last_price: 0,
    expiry: 2021-04-05T00:00:00.000Z,
    strike: 44800,
    tick_size: 0.5,
    lot_size: 1,
    instrument_type: 'CE',
    segment: 'MCX-OPT',
    exchange: 'MCX' },
  { instrument_token: '58258695',
    exchange_token: '227573',
    tradingsymbol: 'GOLDM21APR45000PE',
    name: 'GOLDM',
    last_price: 0,
    expiry: 2021-04-05T00:00:00.000Z,
    strike: 45000,
    tick_size: 0.5,
    lot_size: 1,
    instrument_type: 'PE',
    segment: 'MCX-OPT',
    exchange: 'MCX' } ] 'filteredData'
{ instrument_tokens:
   { GOLDM21APR44800CE: '58257927', GOLDM21APR45000PE: '58258695' } }
GOLDM21APR44800CE key
GOLDM21APR45000PE key
{ GOLDM21APR44800CE: '58257927', GOLDM21APR45000PE: '58258695' }
subscribed token is---> [ 58108679, 58257927, 58258695 ]
[ { tradable: true,
    mode: 'full',
    instrument_token: 58258695,
    last_price: 715,
    last_quantity: 0,
    average_price: 0,
    volume: 0,
    buy_quantity: 0,
    sell_quantity: 0,
    ohlc: { open: 0, high: 0, low: 0, close: 1004.5 },
    change: -28.820308611249377,
    last_trade_time: null,
    timestamp: 2021-04-01T15:23:46.000Z,
    oi: 0,
    oi_day_high: 0,
    oi_day_low: 0,
    depth: { buy: [Array], sell: [Array] } },
  { tradable: true,
    mode: 'full',
    instrument_token: 58108679,
    last_price: 44970,
    last_quantity: 1,
    average_price: 44830.7,
    volume: 131,
    buy_quantity: 52,
    sell_quantity: 18,
    ohlc: { open: 44500, high: 45002, low: 44500, close: 44418 },
    change: 1.2427394299608268,
    last_trade_time: 2021-04-01T17:47:31.000Z,
    timestamp: 2021-04-01T17:48:52.000Z,
    oi: 414,
    oi_day_high: 414,
    oi_day_low: 306,
    depth: { buy: [Array], sell: [Array] } },
  { tradable: true,
    mode: 'full',
    instrument_token: 58257927,
    last_price: 117.5,
    last_quantity: 0,
    average_price: 0,
    volume: 0,
    buy_quantity: 0,
    sell_quantity: 0,
    ohlc: { open: 0, high: 0, low: 0, close: 39.5 },
    change: 197.46835443037975,
    last_trade_time: null,
    timestamp: 2021-04-01T15:23:46.000Z,
    oi: 0,
    oi_day_high: 0,
    oi_day_low: 0,
    depth: { buy: [Array], sell: [Array] } } ]
grouped grouped
ticks.length ticks
2021-04-01T15:23:46.000Z 46
Candle creation starts [ { tradable: true,
    mode: 'full',
    instrument_token: 58258695,
    last_price: 715,
    last_quantity: 0,
    average_price: 0,
    volume: 0,
    buy_quantity: 0,
    sell_quantity: 0,
    ohlc: { open: 0, high: 0, low: 0, close: 1004.5 },
    change: -28.820308611249377,
    last_trade_time: null,
    timestamp: 2021-04-01T15:23:46.000Z,
    oi: 0,
    oi_day_high: 0,
    oi_day_low: 0,
    depth: { buy: [Array], sell: [Array] } },
  { tradable: true,
    mode: 'full',
    instrument_token: 58108679,
    last_price: 44970,
    last_quantity: 1,
    average_price: 44830.7,
    volume: 131,
    buy_quantity: 52,
    sell_quantity: 18,
    ohlc: { open: 44500, high: 45002, low: 44500, close: 44418 },
    change: 1.2427394299608268,
    last_trade_time: 2021-04-01T17:47:31.000Z,
    timestamp: 2021-04-01T17:48:52.000Z,
    oi: 414,
    oi_day_high: 414,
    oi_day_low: 306,
    depth: { buy: [Array], sell: [Array] } },
  { tradable: true,
    mode: 'full',
    instrument_token: 58257927,
    last_price: 117.5,
    last_quantity: 0,
    average_price: 0,
    volume: 0,
    buy_quantity: 0,
    sell_quantity: 0,
    ohlc: { open: 0, high: 0, low: 0, close: 39.5 },
    change: 197.46835443037975,
    last_trade_time: null,
    timestamp: 2021-04-01T15:23:46.000Z,
    oi: 0,
    oi_day_high: 0,
    oi_day_low: 0,
    depth: { buy: [Array], sell: [Array] } } ]
{ '58108679':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58108679,
       last_price: 44970,
       last_quantity: 1,
       average_price: 44830.7,
       volume: 131,
       buy_quantity: 52,
       sell_quantity: 18,
       ohlc: [Object],
       change: 1.2427394299608268,
       last_trade_time: 2021-04-01T17:47:31.000Z,
       timestamp: 2021-04-01T17:48:52.000Z,
       oi: 414,
       oi_day_high: 414,
       oi_day_low: 306,
       depth: [Object] } ],
  '58257927':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58257927,
       last_price: 117.5,
       last_quantity: 0,
       average_price: 0,
       volume: 0,
       buy_quantity: 0,
       sell_quantity: 0,
       ohlc: [Object],
       change: 197.46835443037975,
       last_trade_time: null,
       timestamp: 2021-04-01T15:23:46.000Z,
       oi: 0,
       oi_day_high: 0,
       oi_day_low: 0,
       depth: [Object] } ],
  '58258695':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58258695,
       last_price: 715,
       last_quantity: 0,
       average_price: 0,
       volume: 0,
       buy_quantity: 0,
       sell_quantity: 0,
       ohlc: [Object],
       change: -28.820308611249377,
       last_trade_time: null,
       timestamp: 2021-04-01T15:23:46.000Z,
       oi: 0,
       oi_day_high: 0,
       oi_day_low: 0,
       depth: [Object] } ] } 58108679
{ '58108679':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58108679,
       last_price: 44970,
       last_quantity: 1,
       average_price: 44830.7,
       volume: 131,
       buy_quantity: 52,
       sell_quantity: 18,
       ohlc: [Object],
       change: 1.2427394299608268,
       last_trade_time: 2021-04-01T17:47:31.000Z,
       timestamp: 2021-04-01T17:48:52.000Z,
       oi: 414,
       oi_day_high: 414,
       oi_day_low: 306,
       depth: [Object] } ],
  '58257927':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58257927,
       last_price: 117.5,
       last_quantity: 0,
       average_price: 0,
       volume: 0,
       buy_quantity: 0,
       sell_quantity: 0,
       ohlc: [Object],
       change: 197.46835443037975,
       last_trade_time: null,
       timestamp: 2021-04-01T15:23:46.000Z,
       oi: 0,
       oi_day_high: 0,
       oi_day_low: 0,
       depth: [Object] } ],
  '58258695':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58258695,
       last_price: 715,
       last_quantity: 0,
       average_price: 0,
       volume: 0,
       buy_quantity: 0,
       sell_quantity: 0,
       ohlc: [Object],
       change: -28.820308611249377,
       last_trade_time: null,
       timestamp: 2021-04-01T15:23:46.000Z,
       oi: 0,
       oi_day_high: 0,
       oi_day_low: 0,
       depth: [Object] } ] } 58257927
{ '58108679':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58108679,
       last_price: 44970,
       last_quantity: 1,
       average_price: 44830.7,
       volume: 131,
       buy_quantity: 52,
       sell_quantity: 18,
       ohlc: [Object],
       change: 1.2427394299608268,
       last_trade_time: 2021-04-01T17:47:31.000Z,
       timestamp: 2021-04-01T17:48:52.000Z,
       oi: 414,
       oi_day_high: 414,
       oi_day_low: 306,
       depth: [Object] } ],
  '58257927':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58257927,
       last_price: 117.5,
       last_quantity: 0,
       average_price: 0,
       volume: 0,
       buy_quantity: 0,
       sell_quantity: 0,
       ohlc: [Object],
       change: 197.46835443037975,
       last_trade_time: null,
       timestamp: 2021-04-01T15:23:46.000Z,
       oi: 0,
       oi_day_high: 0,
       oi_day_low: 0,
       depth: [Object] } ],
  '58258695':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58258695,
       last_price: 715,
       last_quantity: 0,
       average_price: 0,
       volume: 0,
       buy_quantity: 0,
       sell_quantity: 0,
       ohlc: [Object],
       change: -28.820308611249377,
       last_trade_time: null,
       timestamp: 2021-04-01T15:23:46.000Z,
       oi: 0,
       oi_day_high: 0,
       oi_day_low: 0,
       depth: [Object] } ] } 58258695
[ { tradable: true,
    mode: 'full',
    instrument_token: 58108679,
    last_price: 44970,
    last_quantity: 1,
    average_price: 44830.7,
    volume: 131,
    buy_quantity: 52,
    sell_quantity: 16,
    ohlc: { open: 44500, high: 45002, low: 44500, close: 44418 },
    change: 1.2427394299608268,
    last_trade_time: 2021-04-01T17:47:31.000Z,
    timestamp: 2021-04-01T17:48:58.000Z,
    oi: 414,
    oi_day_high: 414,
    oi_day_low: 306,
    depth: { buy: [Array], sell: [Array] } } ]
{ '58108679':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58108679,
       last_price: 44970,
       last_quantity: 1,
       average_price: 44830.7,
       volume: 131,
       buy_quantity: 52,
       sell_quantity: 16,
       ohlc: [Object],
       change: 1.2427394299608268,
       last_trade_time: 2021-04-01T17:47:31.000Z,
       timestamp: 2021-04-01T17:48:58.000Z,
       oi: 414,
       oi_day_high: 414,
       oi_day_low: 306,
       depth: [Object] } ],
  '58257927':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58257927,
       last_price: 117.5,
       last_quantity: 0,
       average_price: 0,
       volume: 0,
       buy_quantity: 0,
       sell_quantity: 0,
       ohlc: [Object],
       change: 197.46835443037975,
       last_trade_time: null,
       timestamp: 2021-04-01T15:23:46.000Z,
       oi: 0,
       oi_day_high: 0,
       oi_day_low: 0,
       depth: [Object] } ],
  '58258695':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58258695,
       last_price: 715,
       last_quantity: 0,
       average_price: 0,
       volume: 0,
       buy_quantity: 0,
       sell_quantity: 0,
       ohlc: [Object],
       change: -28.820308611249377,
       last_trade_time: null,
       timestamp: 2021-04-01T15:23:46.000Z,
       oi: 0,
       oi_day_high: 0,
       oi_day_low: 0,
       depth: [Object] } ] } 58108679
{ '58108679':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58108679,
       last_price: 44970,
       last_quantity: 1,
       average_price: 44830.7,
       volume: 131,
       buy_quantity: 52,
       sell_quantity: 16,
       ohlc: [Object],
       change: 1.2427394299608268,
       last_trade_time: 2021-04-01T17:47:31.000Z,
       timestamp: 2021-04-01T17:48:58.000Z,
       oi: 414,
       oi_day_high: 414,
       oi_day_low: 306,
       depth: [Object] } ],
  '58257927':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58257927,
       last_price: 117.5,
       last_quantity: 0,
       average_price: 0,
       volume: 0,
       buy_quantity: 0,
       sell_quantity: 0,
       ohlc: [Object],
       change: 197.46835443037975,
       last_trade_time: null,
       timestamp: 2021-04-01T15:23:46.000Z,
       oi: 0,
       oi_day_high: 0,
       oi_day_low: 0,
       depth: [Object] } ],
  '58258695':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58258695,
       last_price: 715,
       last_quantity: 0,
       average_price: 0,
       volume: 0,
       buy_quantity: 0,
       sell_quantity: 0,
       ohlc: [Object],
       change: -28.820308611249377,
       last_trade_time: null,
       timestamp: 2021-04-01T15:23:46.000Z,
       oi: 0,
       oi_day_high: 0,
       oi_day_low: 0,
       depth: [Object] } ] } 58257927
{ '58108679':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58108679,
       last_price: 44970,
       last_quantity: 1,
       average_price: 44830.7,
       volume: 131,
       buy_quantity: 52,
       sell_quantity: 16,
       ohlc: [Object],
       change: 1.2427394299608268,
       last_trade_time: 2021-04-01T17:47:31.000Z,
       timestamp: 2021-04-01T17:48:58.000Z,
       oi: 414,
       oi_day_high: 414,
       oi_day_low: 306,
       depth: [Object] } ],
  '58257927':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58257927,
       last_price: 117.5,
       last_quantity: 0,
       average_price: 0,
       volume: 0,
       buy_quantity: 0,
       sell_quantity: 0,
       ohlc: [Object],
       change: 197.46835443037975,
       last_trade_time: null,
       timestamp: 2021-04-01T15:23:46.000Z,
       oi: 0,
       oi_day_high: 0,
       oi_day_low: 0,
       depth: [Object] } ],
  '58258695':
   [ { tradable: true,
       mode: 'full',
       instrument_token: 58258695,
       last_price: 715,
       last_quantity: 0,
       average_price: 0,
       volume: 0,
       buy_quantity: 0,
       sell_quantity: 0,
       ohlc: [Object],
       change: -28.820308611249377,
       last_trade_time: null,
       timestamp: 2021-04-01T15:23:46.000Z,
       oi: 0,
       oi_day_high: 0,
       oi_day_low: 0,
       depth: [Object] } ] } 58258695
[ { last_price: 44970, timestamp: 1617290626 } ] [ { last_price: 117.5, timestamp: 1617290626 } ] [ { last_price: 715, timestamp: 1617290626 } ] '===data====>'
{ open: 44970,
  close: 44970,
  high: 44970,
  low: 44970,
  time: 1617290626000,
  callCandle: [ { last_price: 117.5, timestamp: 1617290626 } ],
  putCandle: [ { last_price: 715, timestamp: 1617290626 } ],
  callChart: { chartId: 9907714, symbol: 'NIFTY19D1912250CE' },
  putChart: { chartId: 9907970, symbol: 'NIFTY19D1912150PE' } }
----1 min candle---> { open: 44970,
  close: 44970,
  high: 44970,
  low: 44970,
  time: 1617290626000,
  callCandle: [ { last_price: 117.5, timestamp: 1617290626 } ],
  putCandle: [ { last_price: 715, timestamp: 1617290626 } ],
  callChart: { chartId: 9907714, symbol: 'NIFTY19D1912250CE' },
  putChart: { chartId: 9907970, symbol: 'NIFTY19D1912150PE' } }
^C
(base) office@Raghav stock_exp (15minrsi) $ 