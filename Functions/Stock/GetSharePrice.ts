import StockInterface from '../../types/Stock'
import rates from '../../data/exchangeRates'

export function GetSharePrice (stock: StockInterface): number {
  return parseFloat(stock.share_price)
}

export function GetSharePriceFormatted (stock: StockInterface): string {
  const price = GetSharePrice(stock)
  switch (stock.currency) {
    case 'USD':
      return `$${price.toFixed(2)}`
    case 'EUR':
      return `€${price.toFixed(2)}`
    case 'GBP':
      return `£${price.toFixed(2)}`
    case 'GBX p':
      if (price >= 100) {
        return `£${(price / 100).toFixed(2)}`
      }
      return `${GetSharePrice(stock).toFixed(2)}`
  }
}

export function GetSharePriceAsGBP (stock: StockInterface): number {
  switch (stock.currency) {
    case 'GBP':
      return parseFloat(stock.share_price)
    case 'USD':
      return parseFloat(stock.share_price) * rates.USD.GBP
    case 'GBX p':
      return parseFloat(stock.share_price) * rates.GBX.GBP
  }
}

export default GetSharePrice
