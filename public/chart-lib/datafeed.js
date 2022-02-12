class BinanceDatafeed {
    constructor(options) {
        this.binanceHost = options.url
        this.debug = options.debug || false
        this.symbol = options.symbol || ''
        this.limit = options.limit || 500
    }

    binanceServerTime() {
        return fetch(this.binanceHost + '/time').then(res => {
            return res.json()
        }).then(json => {
            return json.serverTime
        })
    }

    binanceSymbols() {
    return fetch(this.binanceHost + '/symbols?symbol='+this.symbol).then(res => {
            return res.json()
        }).then(json => {
            return json
        })
    }

    binanceKlines(symbol, interval, startTime, endTime, limit) {
        const url = this.binanceHost + '/history' +
            "?symbol=".concat(symbol) +
            "&interval=".concat(interval) +
            "&limit=".concat(limit) +
            "&startTime=".concat(startTime) +
            "&endTime=".concat(endTime)

        return fetch(url).then(res => {
            return res.json()
        }).then(json => {
            return json
        })
    }

    onReady(callback) {
        this.binanceSymbols().then((symbols) => {
            this.symbols = symbols
            callback({
                supports_marks: false,
                supports_group_request: false,
                supports_timescale_marks: false,
                supports_time: true,
                supported_resolutions: [
                '5','60','D','W','M'
                   // '1', '3', '5', '15', '30', '60', '120', '240', '360', '480', '720', '1D', '3D', '1W', '1M'
                ]
            })
        }).catch(err => {
    
            console.error(err)
        })
    }

    searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {

        userInput = userInput.toUpperCase()
        onResultReadyCallback(
            this.symbols.filter((symbol) => {
                return symbol.symbol.indexOf(userInput) >= 0
            }).map((symbol) => {
                return {
                    symbol: symbol.symbol,
                    full_name: symbol.symbol,
                    description: description,
                    ticker: symbol.symbol,
                    //exchange: 'Binance',
                    //type: 'crypto'
                }
            })
        )
    }

    resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {

        this.debug && console.log('👉 resolveSymbol:', symbolName)

        const comps = symbolName.split(':')
        symbolName = (comps.length > 1 ? comps[1] : symbolName).toUpperCase()

        function pricescale(symbol) {
            for (let filter of symbol.filters) {
                if (filter.filterType == 'PRICE_FILTER') {
                    return Math.round(1 / parseFloat(filter.tickSize))
                }
            }
            return 1
        }

        for (let symbol of this.symbols) {
                 if (symbol.symbol == symbolName) {
                setTimeout(() => {
                    onSymbolResolvedCallback({
                        name: symbol.symbol,
                        description: symbol.description,
                        ticker: symbol.symbol,
                        //exchange: 'Binance',
                        //listed_exchange: 'Binance',
                        //type: 'crypto',
                        session: '24x7',
                       // minmov: 1,
                       // pricescale: pricescale(symbol),
                        pricescale: symbol.pricescale,
                        timezone: symbol.timezone,
                        has_no_volume: symbol.has_no_volume,
                        has_intraday: symbol.has_intraday,
                        has_daily: symbol.has_daily,
                        has_weekly_and_monthly: symbol.has_weekly_and_monthly,
                        currency_code: symbol.currency_code,
                        supported_resolutions: symbol.supported_resolutions,
                        volume_precision:symbol.volume_precision,
                    })
                }, 0)
                return
            }
        }

        onResolveErrorCallback('not found')
    }

    getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
        
        if (this.debug) {
            console.log('👉 getBars:', symbolInfo.name, resolution)
            console.log('First:', firstDataRequest)
            console.log('From:', from, '(' + new Date(from * 1000).toGMTString() + ')')
            console.log('To:  ', to, '(' + new Date(to * 1000).toGMTString() + ')')
        }

        const interval = {
            '1': '1m',
            '3': '3m',
            '5': '5m',
            '15': '15m',
            '30': '30m',
            '60': '1h',
            '120': '2h',
            '240': '4h',
            '360': '6h',
            '480': '8h',
            '720': '12h',
            'D': '1d',
            '1D': '1d',
            '3D': '3d',
            'W': '1w',
            '1W': '1w',
            'M': '1M',
            '1M': '1M',
        }[resolution]

        if (!interval) {
            onErrorCallback('Invalid interval')
        }

        let totalKlines = []

        const finishKlines = () => {
            if (this.debug) {
                console.log('📊:', totalKlines.length)
            }

            if (totalKlines['t'].length == 0) {
                onHistoryCallback([], { noData: true })
            } else {

                     
                onHistoryCallback(totalKlines['t'].map((kline,index) => {

                                          return {
                   //  time: kline*1000,
                     time: (kline*1000)-7200000,
                        close: parseFloat(totalKlines['c'][index]),
                        open: parseFloat(totalKlines['o'][index]),
                        high: parseFloat(totalKlines['h'][index]),
                        low: parseFloat(totalKlines['l'][index]),
                        volume: parseFloat(totalKlines['v'][index])
                    }
                }), {
                        noData: false
                    })
            }
        }

        const getKlines = (from, to) => {
            this.binanceKlines(symbolInfo.name, interval, from, to, this.limit).then(klines => {
             
              //  totalKlines = totalKlines.concat(klines)//hide
                totalKlines = klines
      
            /*    if (klines.length == 500) {
                    from = klines[klines.length - 1][0] + 1
                    getKlines(from, to)
                } else {
                    finishKlines()
                }*///hide
                 finishKlines()
            }).catch(err => {
                
                onErrorCallback('Some problem')
            })
        }

        from *= 1000
        to *= 1000

        getKlines(from, to)
    }

    subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
        this.debug && console.log('👉 subscribeBars:', subscriberUID)
    }

    unsubscribeBars(subscriberUID) {
        this.debug && console.log('👉 unsubscribeBars:', subscriberUID)
    }

    getServerTime(callback) {
        this.binanceServerTime().then(time => {
           // callback(Math.floor(time / 1000))
            callback(Math.floor(time))
        }).catch(err => {
            console.error(err)
        })
    }
}
