import type Stock from "../../types/Stock"

const GetDividendYield = (stock: Stock): number => {
  if (!('dividend_yield' in stock)) {
    return null
  }

  const dividendYield = parseFloat(
    stock.dividend_yield
      .replace('$', '')
      .replace('p', '')
      .replace('£', '')
      .replace('€', '')
  )
  return dividendYield
}

export default GetDividendYield
