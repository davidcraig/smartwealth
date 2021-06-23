import StockInterface from '../../types/Stock'

function GetSharePrice (stock: StockInterface): number {
  return parseFloat(stock.share_price)
}

export default GetSharePrice
