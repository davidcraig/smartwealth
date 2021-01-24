import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Navbar from '../Components/Navbar'
import slug from '../Functions/slug'
import StockTable from '../Components/StockTable'
import StockCardGrid from '../Components/StockCardGrid'

export default function SmartWealth({ ...props }) {
  const [filteredStocks, setFilteredStocks] = useState(props.stocks)
  const [dividendStatusFilter, setDividendStatusFilter] = useState('any')
  const [dividendFrequencyFilter, setDividendFrequencyFilter] = useState('any')

  useEffect(
    () => { setFilteredStocks(props.stocks) },
    []
  )

  useEffect(
    () => { filterStocks() },
    [props.stocks, dividendStatusFilter, dividendFrequencyFilter]
  )

  const filterStocks = () => {
    const statusFilter = dividendStatusFilter
    const freqFilter = dividendFrequencyFilter
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
    }
    
    switch(dividendFrequencyFilter) {
      case 'all': break
      case 'monthly':
        filtered = filtered.filter(s => {
          return s.dividend_frequency === "Monthly"
        })
        break
      case 'quarterly':
        filtered = filtered.filter(s => {
          return s.dividend_frequency === "Quarterly"
        })
        break
      case 'other':
        filtered = filtered.filter(s => {
          return s.dividend_frequency === "Annual + Interim" ||
            s.dividend_frequency === "Bi-Annually"
        })
        break
      case 'annual':
        filtered = filtered.filter(s => {
          return s.dividend_frequency === "Annually"
        })
        break
    }

    setFilteredStocks(filtered)
  }

  const changeStatusFilter = (e) => { setDividendStatusFilter(e.target.value) }
  const changeDividendFrequencyFilter = (e) => { setDividendFrequencyFilter(e.target.value) }

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
              <option value='any'>Type: Any</option>
              <option value='aristocrat'>Dividend Aristocrats</option>
              <option value='king'>Dividend Kings</option>
            </select>
          </div>

          <div className="select">
            <select onChange={changeDividendFrequencyFilter}>
              <option value='all'>Dividend Frequency: All</option>
              <option value='monthly'>Monthly</option>
              <option value='quarterly'>Quarterly</option>
              <option value='annual'>Annual</option>
              <option value='other'>Other</option>
            </select>
          </div>

          {StockTable(filteredStocks)}
          {/* {filteredStocks.length >= 20 && StockTable(filteredStocks)}
          {filteredStocks.length < 20 && StockCardGrid(filteredStocks)} */}
        </div>
      </div>
    </div>
  )
}
