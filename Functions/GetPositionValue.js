import exchangeRates from '../data/exchangeRates'

function GetPositionValue (pos, stock, options = { currency: 'GBP' }) {
  let exchangeRate = 1.00
  let stockObject = stock

  // Use stock on pos if stock comes through as null
  if (stock == null) {
    stockObject = pos.stock
  }

  // Last Updated 2021-06-07
  switch (stockObject.currency) {
    // USD -> GBP
    case 'USD': exchangeRate = exchangeRates.USD.GBP; break // Inverse: 1.41734
    case 'EUR':
    case 'EURO':
      exchangeRate = exchangeRates.EURO.GBP; break // Inverse: 1.16201
    case 'GBX p': exchangeRate = 0.01; break // Inverse: 100
  }

  const numShares = parseFloat(pos.quantity)
  const price = parseFloat(stockObject.share_price)
  return (price * numShares) * exchangeRate
}

export default GetPositionValue
