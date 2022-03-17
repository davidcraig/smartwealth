/* global localStorage, confirm */
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import PositionHeldInterface from '../types/PositionHeld'
import FormattedDecimal from '../Functions/Formatting/FormattedDecimal'
import GetFiveYearAverageReturn from '../Functions/Stock/GetFiveYearAverageReturn'
import GetFiveYearTotalReturn from '../Functions/Stock/GetFiveYearTotalReturn'
import GetStock from '../Functions/GetStock'
import { Columns, Column, Card, TabbedContent } from '@davidcraig/react-bulma'
import { connect } from 'react-redux'
import AccountCreationWidget from '../Components/AccountCreationWidget'
import AccountTabContent from '../Components/AccountTabContent'

export function Holdings({ accounts, stocks, positionsHeld, setPositionsHeld }) {
  return (
    <>
      <Head>
        <title>Smart Wealth</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />

      <main className='container is-fluid'>
        <div className='content'>
          {
            accounts.length === 0 && positionsHeld.length > 0 && (
              <PortfolioUpgrade
                accounts={accounts}
                stocks={stocks}
                positionsHeld={positionsHeld}
                setPositionsHeld={setPositionsHeld}
              />
            )
          }
          {accounts.length === 0 && positionsHeld.length === 0 && (
            <AccountCreationWidget />
          )}
          {accounts.length > 0 && (
            <>
              <Accounts
                stocks={stocks}
                accounts={accounts}
                positionsHeld={positionsHeld}
                setPositionsHeld={setPositionsHeld}
              />
            </>
          )}
        </div>
      </main>
    </>
  )
}

function PieStats({ positionsHeld }) {
  const pies = {}
  positionsHeld.forEach((p: PositionHeldInterface) => {
    const pieName = p.pie
    if (pieName !== '') {
      if (!Object.prototype.hasOwnProperty.call(pies, pieName)) {
        // @ts-ignore
        pies[pieName] = {
          name: pieName,
          holdings: 0,
          dripValue: 0,
          positions: []
        }
      }
      // @ts-ignore
      pies[pieName].holdings = pies[pieName].holdings + 1
      // @ts-ignore
      pies[pieName].positions.push(p)
    }
  })

  return (
    <table className='table is-narrow pie-summary'>
      <thead>
        <tr>
          <th>Pie</th>
          <th>#</th>
          <th>%</th>
        </tr>
      </thead>
      <tbody>
        {
          pies && Object.keys(pies).length > 0 && Object.keys(pies).map(k => {
            const pie = pies[k]

            return (
              <tr key={pie.name}>
                <td>{pie.name}</td>
                <td>{pie.holdings}</td>
                <td>
                  {
                    pie.positions.length > 0
                      ? pie.positions.length > 1
                        ? pie.positions.reduce((prev, curr) => {
                          let p = 0
                          if (typeof prev === 'object') {
                            p = prev.pieWeight
                          } else if (typeof prev === 'number') {
                            p = prev
                          } else {
                            console.debug('prev is typeof', typeof prev)
                          }
                          return p + parseInt(curr.pieWeight)
                        })
                        : pie.positions[0].pieWeight
                      : ''
                  }
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}

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

function LegacyHoldings({ stocks, positionsHeld, setPositionsHeld }) {
  const [searchFilteredStocks, setSearchFilteredStocks] = useState([])

  /**
   * Adds ability to search stocks.
   * @param {*} e Search input event
   * @returns
   */
   function searchStocks(e) {
    if (e.target.value.length === 0) {
      return setSearchFilteredStocks([])
    }
    const term = e.target.value.toLowerCase()
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

  function addStock() {
    const stock = this
    if (positionsHeld.find(p => p.name === stock.name)) {
      return
    }
    const positions = [...positionsHeld, {
      stock: stock,
      quantity: 0,
      value: 0,
      pie: '',
      pieWeight: 0
    }]
    setPositionsHeld(positions)
  }

  function updatePositionQuantity(e) {
    if (e.target.validity.patternMismatch) {
      return
    }
    const qty = e.target.value
    const positions = positionsHeld.map(p => {
      if (!p) { return null }
      if (p.stock.ticker === e.target.dataset.ticker) {
        p.quantity = qty
      }
      return p
    }).filter(Boolean)
    setPositionsHeld(positions)
  }

  function updatePositionPieName(e) {
    const name = e.target.value
    const positions = positionsHeld.map(p => {
      if (!p) { return null }
      if (p.stock.ticker === e.target.dataset.ticker) {
        p.pie = name
      }
      return p
    }).filter(Boolean)
    setPositionsHeld(positions)
  }

  function updatePositionPieWeight(e) {
    const weight = e.target.value
    const positions = positionsHeld.map(p => {
      if (!p) { return null }
      if (p.stock.ticker === e.target.dataset.ticker) {
        p.pieWeight = parseFloat(weight)
      }
      return p
    }).filter(Boolean)
    setPositionsHeld(positions)
  }

  function deletePositionByIndex(idx) {
    if (positionsHeld.length === 1 && idx === 0) {
      setPositionsHeld([])
    } else {
      const positions = positionsHeld.map((p, index) => {
        if (index === idx) {
          return null
        }
        return p
      }).filter(Boolean)
      setPositionsHeld(positions)
    }
  }

  function sortByPieName() {
    const positions = positionsHeld.sort((a, b) => {
      return a.pie.localeCompare(b.pie || '')
    }).filter(Boolean)

    setPositionsHeld(positions)
  }

  function sortByStockName() {
    const positions = positionsHeld.sort((a, b) => {
      return a.stock.name.localeCompare(b.stock.name)
    }).filter(Boolean)

    setPositionsHeld(positions)
  }

  function resetPies() {
    const positions = positionsHeld.map(p => {
      if (!p) { return null }
      if (p.stock.ticker) {
        p.pie = ''
        p.pieWeight = 0
      }
      return p
    }).filter(Boolean)
    setPositionsHeld(positions)
  }

  return (
    <>
      <h1 className='h1'>Individual Stocks</h1>
      <p className='note red'>Note: These stocks will no longer be counted in the forecasting on the dashboard, so you should use them as a reference to move your stocks to the new format (accounts)</p>
      <div className='columns is-desktop'>
        <Column class='is-three-quarters-widescreen'>
          <Card title='Positions' className='positions-table-card'>
            <table className='table is-hidden-mobile is-striped is-narrow holdings-table'>
              <thead>
                <tr>
                  <th className='header-ticker'>Ticker</th>
                  <th onClick={sortByStockName}>Stock</th>
                  <th colSpan={2}>Quantity</th>
                  <th onClick={sortByPieName}>Pie</th>
                  <th>Pie Weight</th>
                  <th>Div. Yield</th>
                  <th>5 Yr Avg Return</th>
                  <th colSpan={2}>5 Yr Total Return</th>
                </tr>
              </thead>
              <tbody>
                {positionsHeld && positionsHeld.length > 0 && positionsHeld.map((p, idx) => {
                  const stockObj = GetStock(p.stock.ticker, stocks) ?? p.stock
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
                          onChange={updatePositionQuantity.bind(p)}
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
                          onChange={updatePositionPieName.bind(p)}
                          data-ticker={p.stock.ticker}
                        />
                      </td>
                      <td>
                        <input
                          type='text'
                          placeholder='Pie Weight (%)'
                          value={p.pieWeight}
                          onChange={updatePositionPieWeight.bind(p)}
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
                              deletePositionByIndex(idx)
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
            <table className='table is-hidden-tablet holdings-table'>
              <tbody>
                {positionsHeld && positionsHeld.length > 0 && positionsHeld.map((p, idx) => {
                  return p && (
                    <>
                      <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr key={`${p.stock.ticker}${p.stock.name}`}>
                        <td className='ticker'>{p.stock.ticker}</td>
                        <td>{p.stock.name}</td>
                      </tr>
                      <tr>
                        <td>
                          Quantity {FormattedDecimal(p.quantity)}</td>
                        <td>
                          <input
                            type='text'
                            placeholder='Quantity owned'
                            value={p.quantity}
                            onChange={updatePositionQuantity.bind(p)}
                            pattern='[0-9.]+'
                            data-ticker={p.stock.ticker}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Pie
                        </td>
                        <td>
                          <input
                            type='text'
                            className='pie-name'
                            placeholder='Pie Name? or blank if individual'
                            value={p.pie}
                            onChange={updatePositionPieName.bind(p)}
                            data-ticker={p.stock.ticker}
                          />
                          <input
                            type='text'
                            placeholder='Pie Weight (%)'
                            value={p.pieWeight}
                            onChange={updatePositionPieWeight.bind(p)}
                            pattern='[0-9.]+'
                            data-ticker={p.stock.ticker}
                            style={{ maxWidth: '3em' }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Yield: {p.stock.dividend_yield}</td>
                        <td>
                          <a onClick={() => {
                            const x = confirm('Are you sure')
                            if (x) {
                              deletePositionByIndex(idx)
                            }
                          }}
                          >
                            x
                          </a>
                        </td>
                      </tr>
                    </>
                  )
                })}
              </tbody>
            </table>
          </Card>
        </Column>
        <Column class='is-one-quarter-widescreen'>
          <Card title='Stock Search'>
            <input type='text' className='input' onKeyUp={searchStocks} />
            <SearchResults searchFilteredStocks={searchFilteredStocks} addStock={addStock} />
          </Card>

          <Card title='Actions'>
            <button className='button is-danger' onClick={resetPies}>Reset Pies</button>
          </Card>

          <Card title='Pies'>
            <PieStats positionsHeld={positionsHeld} />
          </Card>
        </Column>
      </div>
    </>
  )
}

function Accounts ({ stocks, accounts, positionsHeld, setPositionsHeld }) {
  const [tabContent, setTabContent] = useState([])

  useEffect(() => {
    const newContent = []
    accounts.forEach(account => {
      newContent.push({
        title: account.name,
        content: (
          <AccountTabContent account={account} />
        )
      })
    })

    if (positionsHeld.length > 0) {
      newContent.push({
        title: 'Legacy',
        content: (
          <LegacyHoldings
            stocks={stocks}
            positionsHeld={positionsHeld}
            setPositionsHeld={setPositionsHeld}
          />
        )
      })
    }

    setTabContent(newContent)
  }, [accounts, positionsHeld])

  console.log(tabContent)

  if (tabContent.length === 0) {
    return <p>No tabs to show</p>
  }

  return (
    <TabbedContent
      content={tabContent}
    />
  )
}

function PortfolioUpgrade({ accounts, stocks, positionsHeld, setPositionsHeld }) {
  return (
    <>
      <div className='columns'>
        <Column class='is-three-quarters-widescreen'>
          <Card title='Upgrade'>
            <p>We have updated the old positions page to be an entire portfolio, because of this you need to tell us how to map your old data</p>
            <p>First of all, create one or more accounts -&gt;</p>
            <p>Then you will be able to move your old positions into the account(s)</p>
          </Card>
        </Column>
        <Column>
          <AccountCreationWidget />
        </Column>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  stocks: state.stocks.data,
  accounts: state.accounts.data
})

export default connect(mapStateToProps)(Holdings)
