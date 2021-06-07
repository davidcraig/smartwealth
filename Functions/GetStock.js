function GetStock (ticker, stocks) {
  if (!stocks) { return null }
  return stocks.filter((s) => {
    return s.ticker === ticker
  })[0]
}

export default GetStock
