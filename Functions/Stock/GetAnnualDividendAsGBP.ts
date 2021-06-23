import StockInterface from '../../types/Stock'
import rates from '../../data/exchangeRates'

function GetAnnualDividendAsGBP (stock: StockInterface): number {
  switch (stock.currency) {
    case 'USD':
      return parseFloat(stock.dividend_return.replace('$', '')) * rates.USD.GBP
  }
  return parseFloat(stock.dividend_return)
}

export default GetAnnualDividendAsGBP
