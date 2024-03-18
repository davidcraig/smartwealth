import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Navbar from '../Components/Navbar'
import StockTable from '../Components/StockTable'
import { connect } from 'react-redux'

export function Screener ({ ...props }) {
  const [filteredStocks, setFilteredStocks] = useState(props.stocks)
  const [dividendStatusFilter, setDividendStatusFilter] = useState('any')
  const [textFilter, setTextFilter] = useState('')
  const [dividendFrequencyFilter, setDividendFrequencyFilter] = useState('any')
  const [brokerFilter, setBrokerFilter] = useState('any')

  useEffect(
    () => { setFilteredStocks(props.stocks) },
    []
  )

  useEffect(
    () => { filterStocks() },
    [props.stocks, dividendStatusFilter, dividendFrequencyFilter, textFilter, brokerFilter]
  )

  const filterStocks = () => {
    let filtered = props.stocks

    /* filter first by status */
    switch (dividendStatusFilter) {
      case 'king':
        filtered = props.stocks.filter(s => {
          return s.dividend_king === 'Yes'
        })
        break
      case 'aristocrat':
        filtered = props.stocks.filter(s => {
          return s.dividend_aristocrat === 'Yes'
        })
        break
      case 'any':
      default:
        break
    }

    /* filter by dividend frequency */
    switch (dividendFrequencyFilter) {
      case 'all': break
      case 'monthly':
        filtered = filtered.filter(s => {
          return s.dividend_frequency === 'Monthly'
        })
        break
      case 'quarterly':
        filtered = filtered.filter(s => {
          return s.dividend_frequency === 'Quarterly'
        })
        break
      case 'other':
        filtered = filtered.filter(s => {
          return s.dividend_frequency === 'Annual + Interim' ||
            s.dividend_frequency === 'Bi-Annually'
        })
        break
      case 'annual':
        filtered = filtered.filter(s => {
          return s.dividend_frequency === 'Annually'
        })
        break
    }

    /* filter by stock broker */
    switch (brokerFilter) {
      case 'all': break
      case 'trading212':
        filtered = filtered.filter(s => {
          return s.trading_212 !== 'No'
        })
        break
      case 'freetrade':
        filtered = filtered.filter(s => {
          return s.freetrade_free !== 'No'
        })
        break
      case 'etoro':
        filtered = filtered.filter(s => {
          return s.etoro !== 'No'
        })
        break
      default: break
    }

    /* filter by text (name, ticker) */
    if (textFilter !== '') {
      filtered = filtered.filter(s => {
        return s.name.match(textFilter) || s.ticker.match(textFilter)
      })
    }

    setFilteredStocks(filtered)
  }

  const changeBrokerFilter = (e) => { setBrokerFilter(e.target.value) }
  const changeTextFilter = (e) => { setTextFilter(e.target.value) }
  const changeStatusFilter = (e) => { setDividendStatusFilter(e.target.value) }
  const changeDividendFrequencyFilter = (e) => { setDividendFrequencyFilter(e.target.value) }

  return (
    <div>
      <Head>
        <title>SmartWealth</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />

      <div className='content p-4'>
      <div className='grid'>
        <div>
          <div className='control'>
            <input className='input' type='text' placeholder='Search' onChange={changeTextFilter} />
          </div>
          </div>
            <div className='flex flex-row'>
              <div className='select'>
                <select onChange={changeStatusFilter}>
                  <option value='any'>Type: Any</option>
                  <option value='aristocrat'>Dividend Aristocrats</option>
                  <option value='king'>Dividend Kings</option>
                </select>
              </div>

              <div className='select'>
                <select onChange={changeDividendFrequencyFilter}>
                  <option value='all'>Dividend Frequency: All</option>
                  <option value='monthly'>Monthly</option>
                  <option value='quarterly'>Quarterly</option>
                  <option value='annual'>Annual</option>
                  <option value='other'>Other</option>
                </select>
              </div>

              <div className='select'>
                <select onChange={changeBrokerFilter}>
                  <option value='all'>Broker: All</option>
                  <option value='trading212'>Trading 212</option>
                  <option value='freetrade'>Freetrade</option>
                  {/* <option value='freetrade-plus'>Freetrade Plus</option> */}
                  <option value='etoro'>eToro</option>
                  <option value='webull'>WeBull</option>
                  {/* <option value='revolut'>Revolut</option> */}
                  {/* <option value='robinhood'>Robinhood</option> */}
                  {/* <option value='m1'>M1 Finance</option> */}
                  {/* <option value='fidelity'>Fidelity</option> */}
                  {/* <option value='vanguard'>Vanguard</option> */}
                </select>
              </div>
            </div>
          </div>

          <StockTable stocks={filteredStocks} />
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  stocks: state.stocks.data
})

export default connect(mapStateToProps)(Screener)
