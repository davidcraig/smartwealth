import { connect } from "react-redux"
import { useState } from "react"
import Card from "./Card"
import { addPie, updatePie } from "../src/features/accounts/accountsSlice"
import uuid from "../Functions/uuid"
import GetStock from "../Functions/GetStock"
import FormattedDecimal from "../Functions/Formatting/FormattedDecimal"

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
              {stock.ticker} {stock.name} <button onClick={() => {addStock(stock)}}>+</button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

const PieWidget = ({ account, pie, stocks, dispatch }) => {
  const [expanded, setExpanded] = useState(false)
  const [searchFilteredStocks, setSearchFilteredStocks] = useState([])
  const searchStocks = ({ target }) => {
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
  const addPieStock = (stock) => {
    const updatedPie = {...pie}
    if (pie.positions && pie.positions.some(p => p.ticker === stock.ticker)) {
      console.error('Stock is already in the pie')
      return
    }
    const position = {
      ticker: stock.ticker,
      weight: 0
    }
    if (!updatedPie.positions || updatedPie.positions.length === 0) {
      updatedPie.positions = [position]
    } else {
      updatedPie.positions = [...updatedPie.positions, position]
    }
    dispatch(updatePie({
      pieId: pie.id,
      accountId: account.id,
      pie: updatedPie
    }))
  }
  const updatePiePosition = ({ pie, position, weight = 0, quantity = 0 }) => {
    const updatedPie = JSON.parse(JSON.stringify(pie))
    updatedPie.positions = updatedPie.positions.map(p => {
      if (p.ticker === position.ticker) {
        // Update the things
        p.weight = weight || 0
        p.quantity = quantity || 0
      }
      return p
    })
    dispatch(updatePie({
      pieId: pie.id,
      accountId: account.id,
      pie: updatedPie
    }))
  }
  const deletePiePosition = (ticker) => {
    const updatedPie = {...pie}
    updatedPie.positions = updatedPie.positions.filter(p => p.ticker !== ticker)
    dispatch(updatePie({
      pieId: pie.id,
      accountId: account.id,
      pie: updatedPie
    }))
  }

  const getPieTotalWeight = () => {
    if (!pie.positions) {
      return 0
    }
    return pie.positions.reduce((previous, current) => {
      return previous + current.weight
    }, 0)
  }

  const pieTotalWeight = getPieTotalWeight()
  const pieIsComplete = pieTotalWeight === 100.0

  if (expanded) {
    return (
      <Card key={pie.id} title={( <div className="flex flex-row justify-between">{pie.name} <button
        onClick={() => { setExpanded(false) }}
        className="px-2"
      >
        -
      </button></div> )}>
        {
          expanded && (
            <>
              <div className="grid grid-cols-2 relative">
                <div className='is-three-quarters'>
                  {
                    pie.positions && !pieIsComplete && (
                      <p className="error">Pie is not 100% weighted</p>
                    )
                  }
                  {
                    pie.positions && pie.positions.length > 0 && (
                      <>
                        <table className='table is-hidden-mobile is-striped is-narrow holdings-table'>
                          <thead>
                            <tr>
                              <th className='header-ticker'>Ticker</th>
                              <th>Stock</th>
                              <th colSpan={2}>Quantity</th>
                              <th>Pie Weight</th>
                              <th>Div. Yield</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pie.positions.map((p, idx) => {
                              const stockObj = GetStock(p.ticker, stocks) ?? p.stock
                              return p && (
                                <tr key={p.ticker}>
                                  <td className='ticker'>{p.ticker}</td>
                                  <td>{stockObj.name}</td>
                                  <td>{FormattedDecimal(p.quantity)}</td>
                                  <td>
                                    <input
                                      type='text'
                                      data-prop='quantity'
                                      placeholder='Quantity owned'
                                      defaultValue={p.quantity}
                                      pattern='[0-9.]+'
                                      data-ticker={stockObj.ticker}
                                      style={{ maxWidth: '9em' }}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type='text'
                                      placeholder='Pie Weight (%)'
                                      data-prop='weight'
                                      defaultValue={p.weight}
                                      pattern='[0-9.]+'
                                      data-ticker={p.ticker}
                                      style={{ maxWidth: '3em' }}
                                    />
                                  </td>
                                  <td>{stockObj.dividend_yield}</td>
                                  <td>
                                    <a
                                      onClick={() => {
                                        const weight = parseFloat(
                                          document.querySelector(`input[data-ticker='${p.ticker}'][data-prop='weight']`).value || 0
                                        )
                                        const quantity = parseFloat(
                                          document.querySelector(`input[data-ticker='${p.ticker}'][data-prop='quantity']`).value || 0
                                        )

                                        if (p.weight !== weight || p.quantity !== quantity) {
                                          updatePiePosition({
                                            pie: pie,
                                            position: p,
                                            weight,
                                            quantity
                                          })
                                        } else {
                                          console.debug('No change')
                                        }
                                      }}
                                    >
                                      ✔️
                                    </a>
                                    <a
                                      onClick={() => {
                                        const x = confirm('Are you sure')
                                        if (x) {
                                          deletePiePosition(stockObj.ticker)
                                        }
                                      }}
                                    >
                                      🗑️
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
                </div>
                <div>
                  Add Stock
                  <input type='text' className='input' onKeyUp={({ target }) => {searchStocks({target})}} />
                  <SearchResults searchFilteredStocks={searchFilteredStocks} addStock={addPieStock} />
                </div>
              </div>
            </>
          )
        }
      </Card>
    )
  }

  return (
    <div className="w-full flex flex-row justify-between">
      {pie.name} <button className="px-2" onClick={() => { setExpanded(true) }}>+</button>
    </div>
  )
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
  return (
    <div className="grid grid-cols-[1fr_30%] gap-2">
      <div className='is-two-thirds'>
        {/* AccountId: {account.id} - Pies: {renderBooleanAsEmoji(account.piesEnabled)} - Nested Pies: {renderBooleanAsEmoji(account.nestedPiesEnabled)} */}
        {
          account.piesEnabled && account.pies && account.pies.length > 0 && (
            <Card title='Pies'>
              {
                account.pies.map(pie => {
                  return <PieWidget
                    account={account}
                    stocks={stocks}
                    pie={pie}
                    dispatch={dispatch}
                    key={pie}
                  />
                })
              }
            </Card>
          )
        }
        {
          !account.piesEnabled && (
            <p>TODO</p>
          )
        }
      </div>
      <div>
        {
          account.piesEnabled && (
            <AccountPieCreate
              stocks={stocks}
              account={account}
              dispatch={dispatch}
            />
          )
        }
        {
          !account.piesEnabled && (
            <p>TODO</p>
          )
        }
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  stocks: state.stocks.data,
  accounts: state.accounts.data
})

export default connect(mapStateToProps)(AccountTabContent)
