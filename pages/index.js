/* global Worker */
import React, { useState, useEffect, Fragment } from 'react'
import Head from 'next/head'
import { connect } from 'react-redux'
import Navbar from '../Components/Navbar'
import GetStock from '../Functions/GetStock'
import GetStockByName from '../Functions/Stock/GetStockByName'
import GetPositionValue from '../Functions/GetPositionValue'
import { Column, Columns, Card, TabbedContent } from '@davidcraig/react-bulma'
import DividendForecast from '../Components/Charts/dividendForecast'
import SharesForecast from '../Components/Charts/sharesForecast'
import StocksBySector from '../Components/Charts/StocksBySector'
import StockValueBySector from '../Components/Charts/StockValueBySector'
import BaseCurrency from '../Functions/Formatting/BaseCurrency'
import { hasProp } from '../Functions/Helpers'

function ForecastContent (forecast, forecastLog, stocks) {
  if (typeof forecast === 'undefined') { return }

  function forTimeframe (time, forecast, filteredLog, stocks) {
    const showLog = false

    return (
      <>
        <h4 className='h4'>Dividends Chart</h4>
        {DividendForecast(stocks, forecast)}

        <h4 className='h4'>Shares Chart</h4>
        {SharesForecast(forecast)}

        {
          showLog && (
            <>
              <h4 className='h4'>Forecast Log</h4>
              <table className='table forecast-log'>
                <tbody>
                  {
                    filteredLog.map(f => {
                      return (
                        <tr key={f.id} className={f.level}>
                          <td>[{f.month}]</td>
                          <td>{f.message}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </>
          )
        }
      </>
    )
  }

  const forecastTabs = [
    {
      title: '1 Year',
      content: forTimeframe('1 Year', forecast.oneYear, forecastLog.filter(f => f.year === 1), stocks)
    },
    {
      title: '5 Years',
      content: forTimeframe('5 Years', forecast.fiveYears, forecastLog.filter(f => f.year < 6), stocks)
    },
    {
      title: '10 Years',
      content: forTimeframe('10 Years', forecast.tenYears, forecastLog.filter(f => f.year < 11), stocks)
    },
    {
      title: '20 Years',
      content: forTimeframe('20 Years', forecast.twentyYears, forecastLog.filter(f => f.year < 21), stocks)
    },
    {
      title: '30 Years',
      content: forTimeframe('30 Years', forecast.thirtyYears, forecastLog.filter(f => f.year < 31), stocks)
    },
    {
      title: '40 Years',
      content: forTimeframe('40 Years', forecast.fortyYears, forecastLog, stocks)
    }
  ]

  return <TabbedContent content={forecastTabs} />
}

const noPositions = (
  <p>To add stocks go to the <a href='/holdings'>My Holdings</a> page!</p>
)

const calculatePieYields = (pie) => {
  const parsePercent = (v) => v.replace('%', '')
  const getPositionDividendYield = (pos) => {
    if ('dividend_yield' in pos.stock) {
      return parseFloat(parsePercent(pos.stock.dividend_yield))
    }

    if ('dividendYield' in pos.stock) {
      return parseFloat(parsePercent(pos.stock.dividendYield))
    }

    return 0
  }

  const sliceCount = pie.holdings
  const avgYield = (
    pie
      .positions
      .map(p => getPositionDividendYield(p))
      .reduce((p, n) => { return (p || 0) + (n || 0) }) / sliceCount
  )
    .toFixed(2)

  const weightedYield = pie
    .positions
    .map(p => { return getPositionDividendYield(p) * (p.pieWeight / 100) })
    .reduce((p, n) => { return (p || 0) + (n || 0) })
    .toFixed(2)

  return [avgYield, weightedYield]
}

function PortfolioValue ({ positionsHeld, stocks }) {
  return BaseCurrency(positionsHeld.reduce((prev, pos) => {
    const stock = GetStock(pos.stock.ticker, stocks)

    if (typeof prev === 'object' && prev.stock) {
      return GetPositionValue(prev, stock) + GetPositionValue(pos, stock)
    }

    return prev + GetPositionValue(pos, stock)
  }))
}

function dividendSumForForecastKey (forecast, forecastKey) {
  if (!forecast || !hasProp(forecast, forecastKey)) {
    return 0
  }

  let total = 0
  Object.keys(forecast[forecastKey].dividendData).forEach(key => {
    const dividendArr = forecast[forecastKey].dividendData[key]
    dividendArr.forEach(dividend => {
      total = total + dividend
    })
  })
  return total
}

function netWorthForForecastKey (forecast, forecastKey, stocks) {
  if (!forecast || !(forecastKey in forecast)) {
    return 0
  }

  let total = 0
  Object.keys(forecast[forecastKey].shareData).forEach(key => {
    const shareArr = forecast[forecastKey].shareData[key]
    const company = key
    const stock = GetStockByName(stocks, company) // Works
    const shares = shareArr[shareArr.length - 1]
    total += (GetPositionValue({ quantity: shares }, stock) || 0)
  })
  return total
}

const nextTwelveMonthsDividends = (forecast) => dividendSumForForecastKey(forecast, 'oneYear')
const nextFiveYearsDividends = (forecast) => dividendSumForForecastKey(forecast, 'fiveYears')
const nextTenYearsDividends = (forecast) => dividendSumForForecastKey(forecast, 'tenYears')
const nextTwentyYearsDividends = (forecast) => dividendSumForForecastKey(forecast, 'twentyYears')
const nextThirtyYearsDividends = (forecast) => dividendSumForForecastKey(forecast, 'thirtyYears')
const nextFortyYearsDividends = (forecast) => dividendSumForForecastKey(forecast, 'fortyYears')

const nextTwelveMonthsNetWorth = (forecast, stocks) => netWorthForForecastKey(forecast, 'oneYear', stocks)
const nextFiveYearsNetWorth = (forecast, stocks) => netWorthForForecastKey(forecast, 'fiveYears', stocks)
const nextTenYearsNetWorth = (forecast, stocks) => netWorthForForecastKey(forecast, 'tenYears', stocks)
const nextTwentyYearsNetWorth = (forecast, stocks) => netWorthForForecastKey(forecast, 'twentyYears', stocks)
const nextThirtyYearsNetWorth = (forecast, stocks) => netWorthForForecastKey(forecast, 'thirtyYears', stocks)
const nextFortyYearsNetWorth = (forecast, stocks) => netWorthForForecastKey(forecast, 'fortyYears', stocks)

export function SmartWealth ({ positionsHeld, stocks, ...props }) {
  const [forecast, setForecast] = useState([])
  const [pies, setPies] = useState([])
  const [pieContributions, setPieContributions] = useState([]) // eslint-disable-line no-unused-vars
  const [forecastLog, setForecastLog] = useState([])
  const [isForecasting, setIsForecasting] = useState(false)

  /* Send the message to perform forecast on position load */
  useEffect(() => {
    let CalculationWorker = new Worker('/js/calculations.js')

    if (
      !isForecasting &&
      positionsHeld &&
      positionsHeld.length > 0
    ) {
      CalculationWorker.postMessage({
        type: 'perform-forecast',
        positions: updatePositions(positionsHeld),
        pieContributions: pieContributions
      })
      setIsForecasting(true)
    }

    CalculationWorker.onmessage = e => {
      const type = e.data.type
      const data = e.data.data

      switch (type) {
        case 'forecast-log':
          setForecastLog(data)
          setIsForecasting(false)
          break
        case 'forecast-log-entry': {
          const entry = data
          const log = [...forecastLog, entry]
          setForecastLog(log)
          break
        }
        case 'pie-data': {
          const pieData = data
          const pies = Object.keys(pieData).map(key => {
            const pie = pieData[key]
            return {
              name: key,
              holdings: pie.holdings,
              positions: updatePositions(pie.positions)
            }
          })
          setPies(pies)
          break
        }
        case 'forecast-results': {
          const results = JSON.parse(data)
          setIsForecasting(false)
          setForecast(results)
          break
        }
        default:
          break
      }
    }

    window.CalculationWorker = CalculationWorker

    return () => {
      CalculationWorker = null
    }

    /* Trigger the forecast */
  }, [positionsHeld, pieContributions])

  const forecastOutput = ForecastContent(forecast, forecastLog, stocks)

  function updatePositions (positions) {
    return positions.map(position => {
      const liveStock = GetStock(position.stock.ticker, stocks)
      if (liveStock) {
        position.stock = liveStock
      }
      return position
    })
  }

  function updatePieMonthlyContributions () {
    const pieContributions = []
    setForecast([])
    pies.forEach(pie => {
      pieContributions.push({
        name: pie.name,
        monthlyContribution: pie.monthlyContribution || 0
      })
    })
    // setPieContributions(pieContributions)

    window.CalculationWorker.postMessage({
      type: 'perform-forecast',
      positions: updatePositions(positionsHeld),
      pieContributions: pieContributions
    })
  }

  const hasPositions = positionsHeld && positionsHeld.length > 0

  pies.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  return (
    <div>
      <Head>
        <title>SmartWealth</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />

      <div className='container is-fluid'>
        <div className='content'>
          <Columns>
            <Column class='is-three-quarters'>
              <Card className={hasPositions ? 'is-semi-compact' : ''} title={hasPositions ? 'Forecast' : 'Welcome'}>
                {
                  hasPositions
                    ? forecastOutput
                    : noPositions
                }
              </Card>
            </Column>
            {
              hasPositions && (
                <Column class='is-one-quarter'>
                  <Card className='is-compact' title='Forecasting'>
                    <table className='table is-compact pie-forecast-controls'>
                      <thead>
                        <tr>
                          <th>Pie</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          pies && pies.length > 0 && pies.map(pie => {
                            const [pieAvg, pieYield] = calculatePieYields(pie)

                            return (
                              <Fragment key={pie.name}>
                                <tr key={pie.name}>
                                  <td>{pie.name} <span style={{ float: 'right' }}>avg.yld: {pieAvg} pie.yld: {pieYield}</span></td>
                                </tr>
                                <tr>
                                  <td>
                                    <input
                                      placeholder='£ / month, blank = 0'
                                      data-pie={pie.name}
                                      onChange={(e) => {
                                        pie.monthlyContribution = parseFloat(e.target.value)
                                      }}
                                    />
                                  </td>
                                </tr>
                              </Fragment>
                            )
                          })
                        }
                      </tbody>
                    </table>

                    <button className='button is-success' onClick={updatePieMonthlyContributions}>Forecast</button>
                  </Card>

                  <Card title='Stats'>
                    <p>You currently own <span className='theme-text-secondary'>{positionsHeld.length || 0}</span> stocks.</p>
                    <p>Portfolio Value: <PortfolioValue positionsHeld={positionsHeld} /></p>
                    <p>Dividends</p>
                    <table className='table is-narrow'>
                      <tbody>
                        <tr><td>12 Months</td><td>{BaseCurrency(nextTwelveMonthsDividends(forecast))}</td></tr>
                        <tr><td>5 Years</td><td>{BaseCurrency(nextFiveYearsDividends(forecast))}</td></tr>
                        <tr><td>10 Years</td><td>{BaseCurrency(nextTenYearsDividends(forecast))}</td></tr>
                        <tr><td>20 Years</td><td>{BaseCurrency(nextTwentyYearsDividends(forecast))}</td></tr>
                        <tr><td>30 Years</td><td>{BaseCurrency(nextThirtyYearsDividends(forecast))}</td></tr>
                        <tr><td>40 Years</td><td>{BaseCurrency(nextFortyYearsDividends(forecast))}</td></tr>
                      </tbody>
                    </table>
                    <p>Net Worth</p>
                    <table className='table is-narrow'>
                      <tbody>
                        <tr><td>12 Months</td><td>{BaseCurrency(nextTwelveMonthsNetWorth(forecast, stocks))}</td></tr>
                        <tr><td>5 Years</td><td>{BaseCurrency(nextFiveYearsNetWorth(forecast, stocks))}</td></tr>
                        <tr><td>10 Years</td><td>{BaseCurrency(nextTenYearsNetWorth(forecast, stocks))}</td></tr>
                        <tr><td>20 Years</td><td>{BaseCurrency(nextTwentyYearsNetWorth(forecast, stocks))}</td></tr>
                        <tr><td>30 Years</td><td>{BaseCurrency(nextThirtyYearsNetWorth(forecast, stocks))}</td></tr>
                        <tr><td>40 Years</td><td>{BaseCurrency(nextFortyYearsNetWorth(forecast, stocks))}</td></tr>
                      </tbody>
                    </table>
                  </Card>
                  <Card title='Diversification'>
                    <h4 className='h4'>Stocks by Sector</h4>
                    <StocksBySector positionsHeld={positionsHeld} stocks={stocks} />

                    <h4 className='h4'>Stock Value by Sector</h4>
                    <StockValueBySector positionsHeld={positionsHeld} stocks={stocks} />
                  </Card>
                </Column>
              )
            }
          </Columns>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  stocks: state.stocks.data
})

export default connect(mapStateToProps)(SmartWealth)
