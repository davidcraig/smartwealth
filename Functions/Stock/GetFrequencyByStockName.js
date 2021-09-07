import GetStockByName from './GetStockByName'

function GetFrequencyByStockName (stocks, stockName) {
  if (stocks && stocks.length > 0) {
    const stock = GetStockByName(stocks, stockName)
    if (stock) {
      switch (stock.dividend_frequency) {
        case 'Monthly': return 'monthly'
        case 'Quarterly': return 'quarterly'
        default: return stock.dividend_frequency
      }
    }
  }

  switch (stockName) {
    default:
      console.log(`GetFrequencyByStockName.js - stock: "${stockName}" frequency not set`)
      return 'unknown'
  }
}

export default GetFrequencyByStockName
