import Stock from '../src/features/stocks/stock'

export function GetStock (ticker, stocks) {
  if (!stocks) { return null }
  return stocks.filter((s) => {
    return s.ticker === ticker ? (new Stock(s)) : null
  })[0]
}

export default GetStock
