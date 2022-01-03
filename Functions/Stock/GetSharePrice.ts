import StockInterface from '../../types/Stock'
import rates from '../../data/exchangeRates'

export function GetSharePrice (stock: StockInterface): number {
  return parseFloat(
    stock.share_price
      .replace(',', '')
      .replace('p', '')
  )
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
  const price = GetSharePrice(stock)

  switch (stock.currency) {
    case 'GBP':
      return price
    case 'USD':
      return price * rates.USD.GBP
    case 'GBX p':
      return price * rates.GBX.GBP
  }
}

export default GetSharePrice
