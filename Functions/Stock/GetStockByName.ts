import StockInterface from '../../types/Stock'

function GetStockByName (stocks: StockInterface[], name: string): StockInterface | null {
  const filtered = stocks.filter(s => s.name === name)
  if (filtered.length < 1) {
    return null
  }
  return filtered[0]
}

export default GetStockByName
