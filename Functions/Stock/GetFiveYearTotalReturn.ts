import GetFiveYearAverageReturn from "./GetFiveYearAverageReturn"
import GetDividendYield from "./GetDividendYield"

/**
 * Get the total return (%) over the last five years for a given stock.
 * @param stock 
 * @returns 
 */
const GetFiveYearTotalReturn = (stock) => {
  if (!GetFiveYearAverageReturn(stock)) {
    return GetDividendYield(stock)
  }

  return parseFloat(
    ((GetDividendYield(stock) + GetFiveYearAverageReturn(stock)) * 5).toFixed(2)
  )
}

export default GetFiveYearTotalReturn
