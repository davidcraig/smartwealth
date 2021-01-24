import slug from '../Functions/slug'

function stockTable(stocks) {
  return <table className='table stock-table is-narrow'>
    <thead>
      <tr>
        <th>Ticker</th>
        <th>Name</th>
        <th>Currency</th>
        <th>Price</th>
        <th>Dividend Frequency</th>
        <th>Dividend Yield</th>
        <th>Dividend Aristocrat</th>
        <th>Dividend King</th>
      </tr>
    </thead>
    <tbody>
      {stocks.map(stock => {
        let rowClasses = []
        if (stock.dividend_frequency) { rowClasses.push(slug(stock.dividend_frequency)) }
        else { rowClasses.push('no-dividend') }

        return <tr key={stock.ticker} className={rowClasses.join(' ')}>
          <td>{stock.ticker}</td>
          <td>{stock.name}</td>
          <td>{stock.currency}</td>
          <td>{stock.share_price}</td>
          <td>{stock.dividend_frequency}</td>
          <td>{stock.dividend_yield}</td>
          <td>{stock.dividend_aristocrat}</td>
          <td>{stock.dividend_king}</td>
        </tr>
      })}
    </tbody>
  </table>
}

export default stockTable
