import StockInterface from '../../types/Stock'
import rates from '../../data/exchangeRates'
import GetSharePrice from './GetSharePrice'

/**
 * Get the five year average return (stock price) excluding dividends
 * @param stock StockInterface
 * @returns 
 */
function GetFiveYearAverageReturn (stock: StockInterface): number {
  if (!('3_jan_2017' in stock)) {
    return null
  }

  const priceNow = GetSharePrice(stock)
  const fiveYearAgo = parseFloat(stock['3_jan_2017'])

  const fiveYearGain = ((priceNow - fiveYearAgo) / fiveYearAgo) * 100
  const fiveYearGainPct = fiveYearGain / 5
  return parseFloat(fiveYearGainPct.toFixed(2))
}

export default GetFiveYearAverageReturn
