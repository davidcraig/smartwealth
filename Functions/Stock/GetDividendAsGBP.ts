import StockInterface from '../../types/Stock'
import rates from '../../data/exchangeRates'

function GetDividendAsGBP (stock: StockInterface): number {
  switch (stock.currency) {
    case 'USD':
      return parseFloat(stock.last_dividend_amount.replace('$', '')) * rates.USD.GBP
  }
  return parseFloat(stock.last_dividend_amount)
}

export default GetDividendAsGBP
