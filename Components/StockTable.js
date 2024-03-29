import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'

import slug from '../Functions/slug'

const CROWN = <FontAwesomeIcon icon={faCrown} size='xs' />

const visibleColumns = [
  { name: 'Ticker', view: stock => stock.ticker },
  { name: 'Name', view: stock => stock.name },
  { name: 'Currency', view: stock => stock.currency },
  { name: 'Price', view: stock => stock.share_price },
  { name: 'Dividend Frequency', view: stock => stock.dividend_frequency }
]

function StockTable ({ stocks }) {
  if (!stocks || stocks === null || stocks.length === 0) {
    return (
      <p>No stocks to view</p>
    )
  }

  return (
    <table className='table stock-table is-narrow'>
      <thead>
        <tr>
          {
            visibleColumns.map(col => {
              return <th key={`${col.name}-heading`}>{col.name}</th>
            })
          }
          <th>Dividend Yield</th>
          <th>Dividend Aristocrat</th>
          <th>Dividend King</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map(stock => {
          const rowClasses = []

          if (stock.dividend_frequency) {
            rowClasses.push(slug(stock.dividend_frequency))
          } else {
            rowClasses.push('no-dividend')
          }

          return (
            <tr key={stock.ticker} className={rowClasses.join(' ')}>
              {
                visibleColumns.map(col => {
                  return <td key={`${stock.ticker}-col-${col.name}`}>{col.view(stock)}</td>
                })
              }
              <td>{stock.dividend_yield}</td>
              <td>{stock.dividend_aristocrat === 'Yes' ? CROWN : ''}</td>
              <td>
                {
                  stock.dividend_king === 'Yes'
                    ? (
                      <>
                        {CROWN}
                        {CROWN}
                        {CROWN}
                      </>
                    )
                    : ''
                }
              </td>
            </tr>
          )
        })}
      </tbody>
      <tfoot>
        <tr><td colSpan={8}>Showing: {stocks.length} stocks</td></tr>
      </tfoot>
    </table>
  )
}

export default StockTable
