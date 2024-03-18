import Card from './Card'

const StockCardGrid = (stocks) => {
  if (!stocks) return false

  return (
    <div className='grid'>
      {stocks.map(stock => {
        return <Card key={stock.ticker} title={stock.name} />
      })}
    </div>
  )
}

export default StockCardGrid
