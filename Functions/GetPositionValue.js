import exchangeRates from '../data/exchangeRates'

function GetPositionValue (pos, stock, options = { currency: 'GBP' }) {
  let exchangeRate = 1.00
  let stockObject = stock

  // Use stock on pos if stock comes through as null
  if (!stock || stock === null) {
    stockObject = pos.stock

    if (!pos.stock) {
      return 0
    }
  }

  if (!('currency' in stockObject)) {
    console.debug(`stock: `, stockObject, 'no currency')
    return 0
  }

  if (!('share_price' in stockObject)) {
    console.debug(`stock: `, stockObject, '0 share price')
    return 0
  }

  // Last Updated 2021-06-07
  switch (stockObject?.currency) {
    // USD -> GBP
    case 'USD': exchangeRate = exchangeRates.USD.GBP; break // Inverse: 1.41734
    case 'EUR':
    case 'EURO':
      exchangeRate = exchangeRates.EURO.GBP; break // Inverse: 1.16201
    case 'GBX p': exchangeRate = 0.01; break // Inverse: 100
    default:
      break
  }

  const numShares = parseFloat(pos.quantity)
  if (numShares === 0) {
    return 0
  }

  const price = parseFloat(
    stockObject?.share_price
      .replace(',', '')
      .replace('p', '')
      .replace('$', '')
      .replace('£', '')
  )
  return (price * numShares) * exchangeRate
}

export default GetPositionValue
