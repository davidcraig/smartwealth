import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import Navbar from '../../../../Components/Navbar'
import { Columns, Column } from '@davidcraig/react-bulma'
import StockInterface from '../../../../types/Stock'
import DividendCard from '../../../../Components/Stock/DividendCard'

function StockComparison ({ stocks }) {
  const router = useRouter()
  let { ticker, tickerTwo } = router.query
  let tickerSymbol = Array.isArray(ticker) ? ticker[0] : ticker
  let tickerTwoSymbol = Array.isArray(tickerTwo) ? tickerTwo[0] : tickerTwo

  let stock: (StockInterface | null) = null
  if (typeof tickerSymbol === 'string' && Array.isArray(stocks)) {
    const matched = stocks.filter((s: StockInterface) => s.ticker.toLowerCase() === tickerSymbol.toLowerCase())
    if (matched.length === 1) {
      stock = matched[0]
    }
  }

  let stockTwo: (StockInterface | null) = null
  if (typeof tickerTwoSymbol === 'string' && Array.isArray(stocks)) {
    const matched = stocks.filter((s: StockInterface) => s.ticker.toLowerCase() === tickerTwoSymbol.toLowerCase())
    if (matched.length === 1) {
      stockTwo = matched[0]
    }
  }

  /* If either stock is not found return error */
  if (!stock || !stockTwo) {
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

  const stockHeader = (stock: StockInterface) => (
    <h2 className='h2'>[{stock.ticker}] {stock.name} - {stock.currency === 'USD' ? "$" : "£"}{stock.share_price}</h2>
  )

  return (
    <React.Fragment>
      <Head>
        <title>Smart Wealth</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />

      <main className='container is-fluid'>
        <div className='content'>

          {/* Headings */}
          <Columns>
            <Column class='is-one-half'>
              {stockHeader(stock)}
            </Column>
            <Column class='is-one-half'>
              {stockHeader(stockTwo)}
            </Column>
          </Columns>

          {/* Dividend Info */}
          <Columns>
            <Column class='is-one-half'>
              <DividendCard stock={stock} />
            </Column>
            <Column class='is-one-half'>
              <DividendCard stock={stockTwo} />
            </Column>
          </Columns>
          
        </div>
      </main>
    </React.Fragment>
  )
}

export default StockComparison
