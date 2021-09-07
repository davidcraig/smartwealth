/* global Worker */
import React, { useState, useEffect, Fragment } from 'react'
import Head from 'next/head'
import { connect } from 'react-redux'
import Navbar from '../Components/Navbar'
import GetStock from '../Functions/GetStock'
import GetPositionValue from '../Functions/GetPositionValue'
import { Column, Columns, Card, TabbedContent } from '@davidcraig/react-bulma'
import DividendForecast from '../Components/Charts/dividendForecast'
import SharesForecast from '../Components/Charts/sharesForecast'
import StocksBySector from '../Components/Charts/StocksBySector'
import StockValueBySector from '../Components/Charts/StockValueBySector'
import BaseCurrency from '../Functions/Formatting/BaseCurrency'
import { hasProp } from '../Functions/Helpers'

function ForecastContent (forecast, forecastLog) {
  if (typeof forecast === 'undefined') { return }

  function forTimeframe (time, forecast, filteredLog) {
    const showLog = false

    return (
      <>
        <h4 className='h4'>Dividends Chart</h4>
        {DividendForecast(forecast)}

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
      content: forTimeframe('1 Year', forecast.oneYear, forecastLog.filter(f => f.year === 1))
    },
    {
      title: '5 Years',
      content: forTimeframe('5 Years', forecast.fiveYears, forecastLog.filter(f => f.year < 6))
    },
    {
      title: '10 Years',
      content: forTimeframe('10 Years', forecast.tenYears, forecastLog.filter(f => f.year < 11))
    },
    {
      title: '30 Years',
      content: forTimeframe('30 Years', forecast.thirtyYears, forecastLog.filter(f => f.year < 31))
    },
    {
      title: '40 Years',
      content: forTimeframe('40 Years', forecast.fortyYears, forecastLog)
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
    if (hasProp(pos.stock, 'dividend_yield')) {
      return parseFloat(parsePercent(pos.stock.dividend_yield))
    }

    if (hasProp(pos.stock, 'dividendYield')) {
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
  // return 100

  return BaseCurrency(positionsHeld.reduce((prev, pos) => {
    const stock = GetStock(pos.stock.ticker, stocks)

    if (typeof prev === 'object') {
      return GetPositionValue(pos, stock)
    }

    return prev + GetPositionValue(pos, stock)
  }))
}

function nextTwelveMonthsDividends (forecast) {
  if (!forecast || !hasProp(forecast, 'oneYear')) {
    return 0
  }

  let total = 0
  Object.keys(forecast.oneYear.dividendData).forEach(key => {
    const dividendArr = forecast.oneYear.dividendData[key]
    dividendArr.forEach(dividend => {
      total = total + dividend
    })
  })
  return total
}

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
        positions: positionsHeld,
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
              positions: pie.positions
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

  const forecastOutput = ForecastContent(forecast, forecastLog)

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
      positions: positionsHeld,
      pieContributions: pieContributions
    })
  }

  const hasPositions = positionsHeld && positionsHeld.length > 0

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
                    <p>Dividends forecast over next 12 months: {BaseCurrency(nextTwelveMonthsDividends(forecast))}</p>
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
