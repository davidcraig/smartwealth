import rates from '../../../data/exchangeRates'

export class Stock {
  constructor (stockData) {
    Object.keys(stockData).forEach(key => {
      this[key] = stockData[key]
    })
  }

  /* Dividends */

  GetDividendAsGBP () {
    switch (this.currency) {
      case 'USD':
        return parseFloat(this.last_dividend_amount.replace('$', '')) * rates.USD.GBP
    }
    return parseFloat(this.last_dividend_amount)
  }
}

export default Stock
