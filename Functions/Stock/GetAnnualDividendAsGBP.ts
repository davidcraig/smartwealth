import StockInterface from '../../types/Stock'
import rates from '../../data/exchangeRates'

function GetAnnualDividendAsGBP (stock: StockInterface): number {
  switch (stock.currency) {
    case 'USD':
      return parseFloat(stock.dividend_return.replace('$', '')) * rates.USD.GBP
    case 'GBP':
      return parseFloat(stock.dividend_return.replace('£', ''))
    case 'GBX p':
      return parseFloat(stock.dividend_return.replace('p', '')) * rates.GBX.GBP
  }
  return parseFloat(stock.dividend_return)
}

export default GetAnnualDividendAsGBP
