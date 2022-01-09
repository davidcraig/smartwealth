import { connect } from "react-redux"
import { useState } from "react"
import { Column, Card } from '@davidcraig/react-bulma'
import { addPie, updatePie } from "../src/features/accounts/accountsSlice"
import uuid from "../Functions/uuid"
import GetStock from "../Functions/GetStock"
import FormattedDecimal from "../Functions/Formatting/FormattedDecimal"
import GetFiveYearAverageReturn from "../Functions/Stock/GetFiveYearAverageReturn"
import GetFiveYearTotalReturn from "../Functions/Stock/GetFiveYearTotalReturn"

function SearchResults({ searchFilteredStocks, addStock }) {
  if (!searchFilteredStocks || searchFilteredStocks.length === 0) {
    return null
  }

  return (
    <>
      <p>Results</p>
      <ul>
        {searchFilteredStocks.map((stock, index) => {
          return (
            <li key={`${stock.ticker}${stock.name}${index}`}>
              {stock.ticker} {stock.name} <button onClick={addStock.bind(stock)}>+</button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

const PieWidget = ({ pie, stocks }) => {
  const [expanded, setExpanded] = useState(false)
  const [searchFilteredStocks, setSearchFilteredStocks] = useState([])
  console.log('stocks pieWidget outer', stocks)
  const searchStocks = ({ target }) => {
    console.log(stocks)
    if (!stocks) {
      return setSearchFilteredStocks([])
    }
    if (target.value.length === 0) {
      return setSearchFilteredStocks([])
    }
    const term = target.value.toLowerCase()
    if (term === '') {
      setSearchFilteredStocks([])
    } else {
      const filteredStocks = stocks.filter(s => {
        if (s.name.toLowerCase().match(term)) {
          return true
        }
        if (s.ticker.toLowerCase().match(term)) {
          return true
        }
        return false
      })

      if (filteredStocks.length === 0) {
        setSearchFilteredStocks([])
      } else {
        setSearchFilteredStocks(filteredStocks)
      }
    }
  }
  const addPieStock = () => {
    const updatedPie = {...pie}
    console.log(updatedPie)
  }
  const updatePiePosition = () => {
    const updatedPie = {...pie}
    console.log(updatedPie)
  }

  if (expanded) {
    return (
      <Card key={pie.id} title={pie.name} style={{position: 'relative'}}>
        {
          expanded && (
            <>
            <div className="columns">
              <Column class='is-three-quarters'>
                {
                  pie.positions && pie.positions.length > 0 && (
                    <>
                      <table className='table is-hidden-mobile is-striped is-narrow holdings-table'>
                        <thead>
                          <tr>
                            <th className='header-ticker'>Ticker</th>
                            <th>Stock</th>
                            <th colSpan={2}>Quantity</th>
                            <th>Pie</th>
                            <th>Pie Weight</th>
                            <th>Div. Yield</th>
                            <th>5 Yr Avg Return</th>
                            <th colSpan={2}>5 Yr Total Return</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pie.positions.map((p, idx) => {
                            const stockObj = GetStock(p.ticker, stocks) ?? p.stock
                            return p && (
                              <tr key={`${p.stock.ticker}${p.stock.name}`}>
                                <td className='ticker'>{stockObj.ticker}</td>
                                <td>{stockObj.name}</td>
                                <td>{FormattedDecimal(p.quantity)}</td>
                                <td>
                                  <input
                                    type='text'
                                    placeholder='Quantity owned'
                                    value={p.quantity}
                                    // onChange={updatePositionQuantity.bind(p)}
                                    pattern='[0-9.]+'
                                    data-ticker={stockObj.ticker}
                                    style={{ maxWidth: '9em' }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type='text'
                                    placeholder='Pie Name? or blank if individual'
                                    value={p.pie}
                                    // onChange={updatePositionPieName.bind(p)}
                                    data-ticker={p.stock.ticker}
                                  />
                                </td>
                                <td>
                                  <input
                                    type='text'
                                    placeholder='Pie Weight (%)'
                                    value={p.pieWeight}
                                    // onChange={updatePositionPieWeight.bind(p)}
                                    pattern='[0-9.]+'
                                    data-ticker={p.stock.ticker}
                                    style={{ maxWidth: '3em' }}
                                  />
                                </td>
                                <td>{stockObj.dividend_yield}</td>
                                <td>{GetFiveYearAverageReturn(stockObj)}</td>
                                <td>{GetFiveYearTotalReturn(stockObj)}</td>
                                <td>
                                  <a
                                    onClick={() => {
                                      const x = confirm('Are you sure')
                                      if (x) {
                                        // deletePositionByIndex(idx)
                                      }
                                    }}
                                  >
                                    x
                                  </a>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </>
                  )
                }
              </Column>
              <Column>
                Add Stock
                <input type='text' className='input' onKeyUp={({ target }) => {searchStocks({target})}} />
                <SearchResults searchFilteredStocks={searchFilteredStocks} addStock={addPieStock} />
              </Column>
            </div>
            <button onClick={() => {addPieStock()}}>Add Stock</button>
            <button
              style={{position: 'absolute', top: '0.8rem', right: '0.8rem'}}
              onClick={() => { setExpanded(false) }}
            >-</button>
            </>
          )
        }
      </Card>
    )
  }

  return (
    <div>
      {pie.name} <button onClick={() => { setExpanded(true) }}>+</button>
    </div>
  )
}

const renderBooleanAsEmoji = (bool) => {
  const emojiTick = '✔️'
  const emojiCross = '❌'
  return bool ? emojiTick : emojiCross
}

const AccountPieCreate = ({ stocks, account, dispatch }) => {
  const [name, setName] = useState(null)
  const numPies = account.pies?.length ?? 0
  return (
    <Card title='Create Pie'>
      <div className="flex">
        <label>
          Name: 
          <input className="input" type='text' onChange={({ target }) => {
            setName(target.value)
          }} />
        </label>
        <button className="button is-primary" onClick={() => {
          dispatch(addPie({
            accountId: account.id,
            pie: {
              id: uuid(),
              name,
            }
          }))
        }}>Create Pie</button>
      </div>
      {
        /* If account can have nested pies and we have at least one pie,
           show option to set a pie parent. */
        (numPies > 0) && (account.nestedPiesEnabled) && (
          <p>Parent?</p>
        )
      }
    </Card>
  )
}

const AccountTabContent = ({ stocks, account, dispatch }) => {
  const emojiTick = '✔️'
  const emojiCross = '❌'
  console.log(stocks)

  return (
    <div className="columns">
      <Column class='is-two-thirds'>
        AccountId: {account.id} - Pies: {renderBooleanAsEmoji(account.piesEnabled)} - Nested Pies: {renderBooleanAsEmoji(account.nestedPiesEnabled)}
        {
          account.piesEnabled && account.pies && account.pies.length > 0 && (
            <div>
              <h3>Pies</h3>
              {
                account.pies.map(pie => {
                  return <PieWidget stocks={stocks} pie={pie} />
                })
              }
            </div>
          )
        }
      </Column>
      <Column>
        {
          account.piesEnabled && (
            <AccountPieCreate
              stocks={stocks}
              account={account}
              dispatch={dispatch}
            />
          )
        }
      </Column>
    </div>
  )
}

const mapStateToProps = state => ({
  stocks: state.stocks.data,
  accounts: state.accounts.data
})

export default connect(mapStateToProps)(AccountTabContent)
