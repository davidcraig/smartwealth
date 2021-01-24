import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Navbar from '../Components/Navbar'
import slug from '../Functions/slug'
import stockTable from '../Components/StockTable'

export default function SmartWealth({ ...props }) {
  const [filteredStocks, setFilteredStocks] = useState(props.stocks)
  const [dividendStatusFilter, setDividendStatusFilter] = useState('any')

  useEffect(
    () => { setFilteredStocks(props.stocks) },
    []
  )

  useEffect(
    () => { filterStocks() },
    [props.stocks, dividendStatusFilter]
  )

  const filterStocks = () => {
    const statusFilter = dividendStatusFilter
    let stocks = props.stocks
    let filtered = stocks

    /* filter first by status */
    switch(statusFilter) {
      case 'any': break
      case 'king':
        filtered = stocks.filter(s => {
          return s.dividend_king === "Yes"
        })
        break
      case 'aristocrat':
        filtered = stocks.filter(s => {
          return s.dividend_aristocrat === "Yes"
        })
        break
      case 'aristocrat-king':
        filtered = stocks.filter(s => {
          return s.dividend_aristocrat === "Yes" || s.dividend_king === "Yes"
        })
        break
    }

    setFilteredStocks(filtered)
  }

  const changeStatusFilter = (e) => {
    setDividendStatusFilter(e.target.value)
  }

  return (
    <div>
      <Head>
        <title>SmartWealth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <div className='content'>
        <div className='container is-fluid'>
          <div className="select">
            <select onChange={changeStatusFilter}>
              <option value='any'>Any</option>
              <option value='aristocrat'>Dividend Aristocrats Only</option>
              <option value='aristocrat-king'>Dividend Aristocrats + Kings</option>
              <option value='king'>Dividend Kings</option>
            </select>
          </div>

          {stockTable(filteredStocks)}
        </div>
      </div>
    </div>
  )
}
