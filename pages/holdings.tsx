/* global localStorage, confirm */
import Head from 'next/head'
import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import PositionHeldInterface from '../types/PositionHeld'
import FormattedDecimal from '../Functions/Formatting/FormattedDecimal'
import { Columns, Column, Card } from '@davidcraig/react-bulma'

function PieStats ({ positionsHeld }) {
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

export default function Holdings ({ stocks, positionsHeld, setPositionsHeld }) {
  const [searchFilteredStocks, setSearchFilteredStocks] = useState([])

  const hasPositions = positionsHeld && positionsHeld.length > 0

  /**
   * Adds ability to search stocks.
   * @param {*} e Search input event
   * @returns
   */
  function searchStocks (e) {
    const term = e.target.value.toLowerCase()
    if (term === '') {
      return setSearchFilteredStocks([])
    }
    const filteredStocks = stocks.filter(s => {
      return s.name.toLowerCase().match(term) || s.ticker.toLowerCase().match(term)
    })
    setSearchFilteredStocks(filteredStocks)
  }

  function addStock () {
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
    localStorage.setItem('positions', JSON.stringify(positions))
    setPositionsHeld(positions)
  }

  function updatePositionQuantity (e) {
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
    localStorage.setItem('positions', JSON.stringify(positions))
    setPositionsHeld(positions)
  }

  function updatePositionPieName (e) {
    const name = e.target.value
    const positions = positionsHeld.map(p => {
      if (!p) { return null }
      if (p.stock.ticker === e.target.dataset.ticker) {
        p.pie = name
      }
      return p
    }).filter(Boolean)
    localStorage.setItem('positions', JSON.stringify(positions))
    setPositionsHeld(positions)
  }

  function updatePositionPieWeight (e) {
    const weight = e.target.value
    const positions = positionsHeld.map(p => {
      if (!p) { return null }
      if (p.stock.ticker === e.target.dataset.ticker) {
        p.pieWeight = parseFloat(weight)
      }
      return p
    }).filter(Boolean)
    localStorage.setItem('positions', JSON.stringify(positions))
    setPositionsHeld(positions)
  }

  function deletePositionByIndex (idx) {
    const positions = positionsHeld.map((p, index) => {
      if (index === idx) {
        return null
      }
      return p
    }).filter(Boolean)

    localStorage.setItem('positions', JSON.stringify(positions))
    setPositionsHeld(positions)
  }

  function sortByPieName () {
    const positions = positionsHeld.sort((a, b) => {
      return a.pie.localeCompare(b.pie || '')
    }).filter(Boolean)

    localStorage.setItem('positions', JSON.stringify(positions))
    setPositionsHeld(positions)
  }

  function sortByStockName () {
    const positions = positionsHeld.sort((a, b) => {
      return a.stock.name.localeCompare(b.stock.name)
    }).filter(Boolean)

    localStorage.setItem('positions', JSON.stringify(positions))
    setPositionsHeld(positions)
  }

  function resetPies () {
    const positions = positionsHeld.map(p => {
      if (!p) { return null }
      if (p.stock.ticker) {
        p.pie = ''
        p.pieWeight = 0
      }
      return p
    }).filter(Boolean)
    localStorage.setItem('positions', JSON.stringify(positions))
    setPositionsHeld(positions)
  }

  return (
    <>
      <Head>
        <title>Smart Wealth</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />

      <main className='container is-fluid'>
        <div className='content'>
          <h1 className='h1'>My Holdings</h1>
          <Columns>
            <Column class='is-three-quarters'>
              {
                hasPositions && (
                  <Card title='Positions' className='positions-table-card'>
                    <table className='table is-striped is-narrow holdings-table'>
                      <thead>
                        <tr>
                          <th>Ticker</th>
                          <th onClick={sortByStockName}>Stock</th>
                          <th colSpan={2}>Quantity</th>
                          <th onClick={sortByPieName}>Pie</th>
                          <th colSpan={2}>Pie Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {positionsHeld && positionsHeld.length > 0 && positionsHeld.map((p, idx) => {
                          return p && (
                            <tr key={`${p.stock.ticker}${p.stock.name}`}>
                              <td>{p.stock.ticker}</td>
                              <td>{p.stock.name}</td>
                              <td>{FormattedDecimal(p.quantity)}</td>
                              <td>
                                <input
                                  type='text'
                                  placeholder='Quantity owned'
                                  value={p.quantity}
                                  onChange={updatePositionQuantity.bind(p)}
                                  pattern='[0-9.]+'
                                  data-ticker={p.stock.ticker}
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
                          )
                        })}
                      </tbody>
                    </table>
                  </Card>
                )
              }
              {
                !hasPositions && (
                  <Card title='How to add your holdings'>
                    <p>To add your positions use the stock search on the left to search for a stock (not all positions might be available but the most common ones are, if you would like to request a stock you can do so on our discord).</p>
                    <p>You can search by name eg "Coca-Cola" or by ticker symbol eg "KO" you will see the results appear as you type.</p>
                    <p>To add a stock click the plus symbol, after which this part of the screen will change.</p>
                    <p>To add a stock to a pie simply enter a name in the pie text box, then a weighting in the box after.</p>
                    <p>To remove a stock you can click the x button to the right of the stock table for that row.</p>
                  </Card>
                )
              }
            </Column>
            <Column class='is-one-quarter'>
              <Card title='Stock Search'>
                <input type='text' className='input' onChange={searchStocks} />
                <p>Results</p>
                <ul>
                  {searchFilteredStocks.map(stock => {
                    return (
                      <li key={`${stock.ticker}${stock.name}`}>
                        {stock.ticker} {stock.name} <button onClick={addStock.bind(stock)}>+</button>
                      </li>
                    )
                  })}
                </ul>
              </Card>

              {
                hasPositions && (
                  <>
                    <Card title='Actions'>
                      <button className='button is-danger' onClick={resetPies}>Reset Pies</button>
                    </Card>

                    <Card title='Pies'>
                      <PieStats positionsHeld={positionsHeld} />
                    </Card>
                  </>
                )
              }
            </Column>
          </Columns>
        </div>
      </main>
    </>
  )
}
