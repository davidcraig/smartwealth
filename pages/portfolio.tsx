/* global localStorage, confirm */
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import PositionHeldInterface from '../types/PositionHeld'
import FormattedDecimal from '../Functions/Formatting/FormattedDecimal'
import GetStock from '../Functions/GetStock'
import Card from '../Components/Card'
import TabbedContent from '../Components/TabbedContent'
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

      <main className='p-2'>
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

function LegacyHoldings({ stocks, positionsHeld }) {
  return (
    <>
      <h1 className='h1'>Legacy Positions</h1>
      <p className='note red'>Note: These stocks will no longer be counted in the forecasting on the dashboard, so you should use them as a reference to move your stocks to the new format (accounts). We will add ability to delete this tab later.</p>
      <div className='grid grid-cols-2 is-desktop'>
        <div className='is-three-quarters-widescreen'>
          <Card title='Positions'>
            <table className='table is-hidden-mobile is-striped is-narrow holdings-table'>
              <thead>
                <tr>
                  <th className='header-ticker'>Ticker</th>
                  <th>Stock</th>
                  <th>Quantity</th>
                  <th>Pie</th>
                  <th>Pie Weight</th>
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
                        {p.pie}
                      </td>
                      <td>
                        {p.pieWeight}
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
                            data-ticker={p.stock.ticker}
                          />
                          <input
                            type='text'
                            placeholder='Pie Weight (%)'
                            value={p.pieWeight}
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
        </div>
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
    newContent.push({
      title: 'Add Account',
      content: (
        <AccountCreationWidget />
      )
    })

    if (positionsHeld.length > 0) {
      newContent.push({
        title: 'Legacy',
        content: (
          <LegacyHoldings
            stocks={stocks}
            positionsHeld={positionsHeld}
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
      <div className='grid grid-cols-2'>
        <div className='is-three-quarters-widescreen'>
          <Card title='Upgrade'>
            <p>We have updated the old positions page to be an entire portfolio, because of this you need to tell us how to map your old data</p>
            <p>First of all, create one or more accounts -&gt;</p>
            <p>Then you will be able to move your old positions into the account(s)</p>
          </Card>
        </div>
        <div>
          <AccountCreationWidget />
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  stocks: state.stocks.data,
  accounts: state.accounts.data
})

export default connect(mapStateToProps)(Holdings)
