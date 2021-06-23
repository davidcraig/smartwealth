import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState, ReactFragment } from 'react'
import Navbar from '../../../../Components/Navbar'
import { Columns, Column, Card } from '@davidcraig/react-bulma'
import StockInterface from '../../../../types/Stock'
import GetDividendAsGBP from '../../../../Functions/Stock/GetDividendAsGBP'
import GetSharePrice from '../../../../Functions/Stock/GetSharePrice'
import GetAnnualDividendAsGBP from '../../../../Functions/Stock/GetAnnualDividendAsGBP'
import BaseCurrency from '../../../../Functions/Formatting/BaseCurrency'
import DividendCard from '../../../../Components/Stock/DividendCard'

function StockComparison ({ stocks }) {
  const router = useRouter()
  let { ticker, tickerTwo } = router.query
  if (Array.isArray(ticker)) { ticker = ticker[0] }
  if (Array.isArray(tickerTwo)) { tickerTwo = tickerTwo[0] }

  let stock: (StockInterface | null) = null
  if (!!ticker && !!stocks) {
    const matched = stocks.filter((s: StockInterface) => s.ticker.toLowerCase() === ticker.toLowerCase())
    if (matched.length === 1) {
      stock = matched[0]
    }
  }

  let stockTwo: (StockInterface | null) = null
  if (!!ticker && !!stocks) {
    const matched = stocks.filter((s: StockInterface) => s.ticker.toLowerCase() === tickerTwo.toLowerCase())
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
