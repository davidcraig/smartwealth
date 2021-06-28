import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState, ReactFragment } from 'react'
import Navbar from '../../Components/Navbar'
import { Columns, Column, Card } from '@davidcraig/react-bulma'
import StockInterface from '../../types/Stock'
import GetDividendAsGBP from '../../Functions/Stock/GetDividendAsGBP'
import GetSharePrice from '../../Functions/Stock/GetSharePrice'
import GetAnnualDividendAsGBP from '../../Functions/Stock/GetAnnualDividendAsGBP'
import BaseCurrency from '../../Functions/Formatting/BaseCurrency'
import DividendCard from '../../Components/Stock/DividendCard'

function StockView ({ stocks }) {
  const router = useRouter()
  let { ticker } = router.query
  let tickerSymbol = Array.isArray(ticker) ? ticker[0] : ticker

  let stock: (StockInterface | null) = null
  if (typeof tickerSymbol === 'string' && Array.isArray(stocks)) {
    const matched = stocks.filter((s: StockInterface) => s.ticker.toLowerCase() === tickerSymbol.toLowerCase())
    if (matched.length === 1) {
      stock = matched[0]
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

  const sharesFor10PerMonth = 120 / GetAnnualDividendAsGBP(stock)
  const sharesFor100PerMonth = 1200 / GetAnnualDividendAsGBP(stock)
  const amountFor10PerMonth = sharesFor10PerMonth * GetSharePrice(stock)
  const amountFor100PerMonth = sharesFor100PerMonth * GetSharePrice(stock)

  return (
    <React.Fragment>
      <Head>
        <title>Smart Wealth</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />

      <main className='container is-fluid'>
        <div className='content'>
          <h1 className='h1'>[{stock.ticker}] {stock.name} - {stock.currency === 'USD' ? "$" : "£"}{stock.share_price}</h1>
          <Columns>
            <Column class='is-one-half'>
              <DividendCard stock={stock} />
            </Column>
            <Column class='is-one-half'>
              <h1>TODO</h1>
            </Column>
          </Columns>
          
        </div>
      </main>
    </React.Fragment>
  )
}

export default StockView
