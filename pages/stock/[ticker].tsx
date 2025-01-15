import Head from 'next/head'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import React, { useState, ReactFragment } from 'react'
import Navbar from '../../Components/Navbar'
import { Columns, Column, Card } from '@davidcraig/react-bulma'
import StockInterface from '../../types/Stock'
import { GetSharePriceAsGBP, GetSharePriceFormatted } from '../../Functions/Stock/GetSharePrice'
import GetAnnualDividendAsGBP from '../../Functions/Stock/GetAnnualDividendAsGBP'
import DividendCard from '../../Components/Stock/DividendCard'

function displayTimeToReachGoal (months) {
  if (months > 12) {
    return `${Math.floor(months / 12)} years`
  }
  return `${months.toFixed(1)} m`
}

function StockView ({ stocks }) {
  const router = useRouter()
  let { ticker } = router.query
  let tickerSymbol = Array.isArray(ticker) ? ticker[0] : ticker
  console.debug('stocks', stocks)
  console.debug('tickerSymbol', tickerSymbol)

  let stock: (StockInterface | null) = null
  if (typeof tickerSymbol === 'string' && Array.isArray(stocks)) {
    const matched = stocks.filter((s: StockInterface) => s.ticker.toLowerCase() === tickerSymbol.toLowerCase())
    console.debug('matched', matched)
    if (matched.length === 1) {
      stock = matched[0]
      console.debug('stock', stock)
    }
  }

  if (!stock) {
    return (
      <React.Fragment>
        <Head>
          <title>Smart Wealth</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <Navbar />

        <main className='container is-fluid'>
          <div className='content'>
            <h1>Stock not found</h1>
          </div>
        </main>
      </React.Fragment>
    )
  }

  const sharePrice = GetSharePriceAsGBP(stock)
  const sharesFor10PerMonth = 120 / GetAnnualDividendAsGBP(stock)
  const sharesFor100PerMonth = 1200 / GetAnnualDividendAsGBP(stock)
  const amountFor100PerMonth = sharesFor100PerMonth * sharePrice
  const amountFor1000PerMonth = amountFor100PerMonth * 10

  return (
    <React.Fragment>
      <Head>
        <title>Smart Wealth</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />

      <main className='container is-fluid'>
        <div className='content'>
          <h1 className='h1'>[{stock.ticker}] {stock.name} - {GetSharePriceFormatted(stock)}</h1>
          <Columns>
            <Column class='is-two-thirds'>
              <DividendCard stock={stock} />
            </Column>
            <Column class='is-one-third'>
              <Card title='Dividend Data'>
                <p>Last Dividend: {stock.last_dividend_amount}</p>
                <p>Dividend Yield: {stock.dividend_yield}</p>
              </Card>
            </Column>
          </Columns>
          <Card title='Time to reach income goals'>
            <table className='table'>
              <thead>
                <tr>
                  <th></th>
                  <th>@1000/Mo</th>
                  <th>@1200/Mo</th>
                  <th>@1300/Mo</th>
                  <th>@1500/Mo</th>
                  <th>@2000/Mo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>£100/Mo</td>
                  <td>{displayTimeToReachGoal(amountFor100PerMonth / 1000)}</td>
                  <td>{displayTimeToReachGoal(amountFor100PerMonth / 1200)}</td>
                  <td>{displayTimeToReachGoal(amountFor100PerMonth / 1300)}</td>
                  <td>{displayTimeToReachGoal(amountFor100PerMonth / 1500)}</td>
                  <td>{displayTimeToReachGoal(amountFor100PerMonth / 2000)}</td>
                </tr>
                <tr>
                  <td>£500/Mo</td>
                  <td>{displayTimeToReachGoal((5 * amountFor100PerMonth) / 1000)}</td>
                  <td>{displayTimeToReachGoal((5 * amountFor100PerMonth) / 1200)}</td>
                  <td>{displayTimeToReachGoal((5 * amountFor100PerMonth) / 1300)}</td>
                  <td>{displayTimeToReachGoal((5 * amountFor100PerMonth) / 1500)}</td>
                  <td>{displayTimeToReachGoal((5 * amountFor100PerMonth) / 2000)}</td>
                </tr>
                <tr>
                  <td>£1000/Mo</td>
                  <td>{displayTimeToReachGoal((10 * amountFor100PerMonth) / 1000)}</td>
                  <td>{displayTimeToReachGoal((10 * amountFor100PerMonth) / 1200)}</td>
                  <td>{displayTimeToReachGoal((10 * amountFor100PerMonth) / 1300)}</td>
                  <td>{displayTimeToReachGoal((10 * amountFor100PerMonth) / 1500)}</td>
                  <td>{displayTimeToReachGoal((10 * amountFor100PerMonth) / 2000)}</td>
                </tr>
                <tr>
                  <td>£1500/Mo</td>
                  <td>{displayTimeToReachGoal((15 * amountFor100PerMonth) / 1000)}</td>
                  <td>{displayTimeToReachGoal((15 * amountFor100PerMonth) / 1200)}</td>
                  <td>{displayTimeToReachGoal((15 * amountFor100PerMonth) / 1300)}</td>
                  <td>{displayTimeToReachGoal((15 * amountFor100PerMonth) / 1500)}</td>
                  <td>{displayTimeToReachGoal((15 * amountFor100PerMonth) / 2000)}</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </main>
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  stocks: state.stocks.data
})

export default connect(mapStateToProps)(StockView)
