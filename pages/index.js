import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Navbar from '../Components/Navbar'
import GetStock from '../Functions/GetStock'
import GetPositionValue from '../Functions/GetPositionValue'
import { Column, Columns, Card, TabbedContent } from '@davidcraig/react-bulma'
import DividendForecast from '../Components/Charts/dividendForecast'
import SharesForecast from '../Components/Charts/sharesForecast'
import StocksBySector from '../Components/Charts/StocksBySector'
import StockValueBySector from '../Components/Charts/StockValueBySector'
import BaseCurrency from '../Functions/Formatting/BaseCurrency'

function ForecastContent (forecast, forecastLog) {
  if (typeof forecast === 'undefined') {
    return
  }
  function forTimeframe (time, forecast, filteredLog) {
    const showLog = false

    return (
      <>
        <h2 className='h2'>{time}</h2>
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
                      return <tr key={f.id} className={f.level}><td>[{f.month}] {f.message}</td></tr>
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
      content: forTimeframe('1 Year', forecast.oneYear, forecastLog.filter(f => f.year == 1))
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
      content: forTimeframe('30 Years', forecast.thirtyYears, forecastLog)
    }
  ]

  return <TabbedContent content={forecastTabs} />
}

export default function SmartWealth ({ positionsHeld, stocks, ...props }) {
  const [forecast, setForecast] = useState([])
  const [pies, setPies] = useState([])
  const [pieContributions, setPieContributions] = useState([])
  const [forecastLog, setForecastLog] = useState([])

  /* Send the message to perform forecast on position load */
  useEffect(() => {
    let CalculationWorker = new Worker('/js/calculations.js')
    const performForecasting = false

    if (performForecasting) {
      CalculationWorker.postMessage({
        type: 'perform-forecast',
        positions: positionsHeld,
        pieContributions: pieContributions
      })
    }

    CalculationWorker.onmessage = (e => {
      const type = e.data.type
      const data = e.data.data

      switch (type) {
        case 'forecast-log':
          setForecastLog(data)
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
          setForecast(results)
          break
        }
        default:
          break
      }
    })

    window.CalculationWorker = CalculationWorker

    return () => {
      CalculationWorker = null
    }

    /* Trigger the forecast */
  }, [positionsHeld, pieContributions])

  let forecastOutput = ForecastContent(forecast, forecastLog)

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
            <Column>
              <Card title='Forecast'>
                {forecastOutput}
              </Card>
            </Column>
            <Column class='is-one-quarter'>
              <Card title='Forecasting'>
                <table className='table is-compact pie-summary'>
                  <thead>
                    <tr>
                      <th>Pie</th>
                      <th>#</th>
                      <th>%</th>
                      <th>£ / Mo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      pies && pies.length > 0 && pies.map(pie => {
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
                                          }
                                          if (typeof prev === 'number') {
                                            p = prev
                                          }
                                          return parseInt(p) + parseInt(curr.pieWeight)
                                        })
                                      : pie.positions[0].pieWeight
                                  : ''
                              }
                            </td>
                            <td>
                              <input
                                data-pie={pie.name}
                                onChange={e => pie.monthlyContribution = parseFloat(e.target.value)}
                              />
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>

                <button onClick={updatePieMonthlyContributions}>Forecast</button>
              </Card>
              <Card title='Stats'>
                {
                  hasPositions > 0 && (
                    <>
                      <p>You currently own <span className='theme-text-secondary'>{positionsHeld.length || 0}</span> stocks.</p>
                      <p>Portfolio Value: {
                        BaseCurrency(positionsHeld.reduce((prev, pos) => {
                          const stock = GetStock(pos.stock.ticker, stocks)

                          if (typeof prev === 'object') {
                            return GetPositionValue(pos, stock)
                          }

                          return prev + GetPositionValue(pos, stock)
                        }))
                      }
                      </p>
                    </>
                  )
                }
                {!hasPositions && (
                  <p>To add stocks go to the My Holdings tab!</p>
                )}
              </Card>
              <Card title='Diversification'>
                <h4 className='h4'>Stocks by Sector</h4>
                <StocksBySector positionsHeld={positionsHeld} stocks={stocks} />

                <h4 className='h4'>Stock Value by Sector</h4>
                <StockValueBySector positionsHeld={positionsHeld} stocks={stocks} />
              </Card>
            </Column>
          </Columns>
        </div>
      </div>
    </div>
  )
}
