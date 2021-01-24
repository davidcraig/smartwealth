import { ItemGrid, Card } from '@davidcraig/react-bulma'

const StockCardGrid = (stocks) => {
  if (!stocks) return false

  return <ItemGrid>
    {stocks.map(stock => {
      return <Card title={stock.name}></Card>
    })}
  </ItemGrid>
}

export default StockCardGrid
