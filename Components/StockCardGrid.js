import { ItemGrid, Card } from '@davidcraig/react-bulma'

const StockCardGrid = (stocks) => {
  if (!stocks) return false

  return (
    <ItemGrid>
      {stocks.map(stock => {
        return <Card key={stock.ticker} title={stock.name} />
      })}
    </ItemGrid>
  )
}

export default StockCardGrid
