/* global localStorage */
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Navbar from '../Components/Navbar'
import { Columns, Column, Card } from '@davidcraig/react-bulma'
import { getYear, hasProp, getMonthsOptionsArray, getMonthName } from '../Functions/Helpers'

type LogState = {
  type: string,
  month: number,
  year: number,
  amount: number | null
}

type Dividend = {
  month: number,
  year: number,
  amount: number
}

type Contribution = {
  month: number,
  year: number,
  amount: number
}

function Logging ({ dividends, setDividends, contributions, setContributions }) {
  const [logEntries, setLogEntries] = useState({})
  const [logState, setLogState] = useState({
    type: 'dividends',
    month: 0,
    year: getYear(),
    amount: 0
  })

  const resetForm = () => {
    setLogState({
      type: 'dividends',
      month: 0,
      year: getYear(),
      amount: 0
    })
  }

  useEffect(() => {
    const newLogEntries = {}
    if (dividends && dividends.length > 0) {
      dividends.forEach((d: Dividend) => {
        if (!hasProp(newLogEntries, d.year.toString())) {
          newLogEntries[d.year] = {}
        }
        if (!hasProp(newLogEntries[d.year], d.month.toString())) {
          newLogEntries[d.year][d.month] = {}
        }
        newLogEntries[d.year][d.month].dividends = d.amount
      })
    }
    if (contributions && contributions.length > 0) {
      contributions.forEach((c: Contribution) => {
        if (!hasProp(newLogEntries, c.year.toString())) {
          newLogEntries[c.year] = {}
        }
        if (!hasProp(newLogEntries[c.year], c.month.toString())) {
          newLogEntries[c.year][c.month] = {}
        }
        newLogEntries[c.year][c.month].contributions = c.amount
      })
    }
    setLogEntries(newLogEntries)
  }, [dividends, contributions])

  const saveLog = (logState: LogState) => {
    switch (logState.type) {
      case 'dividends':
        localStorage.setItem('dividends', JSON.stringify([...dividends, { month: logState.month, year: logState.year, amount: logState.amount }]))
        setDividends([...dividends, { month: logState.month, year: logState.year, amount: logState.amount }])
        resetForm()
        break
      case 'contributions':
        localStorage.setItem('contributions', JSON.stringify([...contributions, { month: logState.month, year: logState.year, amount: logState.amount }]))
        setContributions([...contributions, { month: logState.month, year: logState.year, amount: logState.amount }])
        resetForm()
        break
      default:
        // do nothing
        break
    }
  }

  const months = getMonthsOptionsArray()
  const years = [2019, 2020, 2021, 2022, 2023]

  return (
    <div>
      <Head>
        <title>SmartWealth - Settings</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />

      <div className='container is-fluid'>
        <div className='content'>
          <Columns>
            <Column class='is-two-thirds'>
              <Card title='Log'>
                <table className='is-narrow'>
                  <thead>
                    <tr>
                      <th>Month / Year</th>
                      <th>Contributions</th>
                      <th>Dividends</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      logEntries && Object.keys(logEntries).length > 0 &&
                        Object.keys(logEntries)
                          .map(year => {
                            return Object.keys(logEntries[year])
                              .map(month => {
                                const data = logEntries[year][month]
                                return (
                                  <tr key={`${year}-${month}`}>
                                    <td>{getMonthName(parseInt(month))} {year}</td>
                                    <td>{data.contributions}</td>
                                    <td>{data.dividends}</td>
                                    <td>
                                      <button
                                        data-month={month}
                                        data-year={year}
                                        onClick={(e: any) => {
                                          const month = parseInt(e.target.dataset.month)
                                          const year = parseInt(e.target.dataset.year)
                                          const newDividends = dividends.filter((item: Dividend | Contribution) => {
                                            return !((item.month === month) && (item.year === year))
                                          })
                                          const newContributions = contributions.filter((item) => {
                                            return !((item.month === month) && (item.year === year))
                                          })

                                          localStorage.setItem('dividends', JSON.stringify(newDividends))
                                          localStorage.setItem('contributions', JSON.stringify(newContributions))
                                          setDividends(newDividends)
                                          setContributions(newContributions)
                                        }}
                                      >
                                        X
                                      </button>
                                    </td>
                                  </tr>
                                )
                              })
                          })
                    }
                  </tbody>
                </table>
              </Card>
            </Column>
            <Column class='is-one-third'>
              <Card title='Logging'>
                Log dividends or contribution.

                <table className='table is-narrow'>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className='select'>
                          <select
                            value={logState.month}
                            onChange={({ target }) => {
                              setLogState((state: any) => {
                                return { ...state, month: parseInt(target.value) }
                              })
                            }}
                          >
                            {
                              months.map(m => {
                                return (
                                  <option key={`month-${m}-option`} value={m.val}>
                                    {m.name}
                                  </option>
                                )
                              })
                            }
                          </select>
                        </div>
                      </td>
                      <td>
                        <div className='select'>
                          <select
                            value={logState.year}
                            onChange={({ target }) => {
                              setLogState((state: any) => {
                                return { ...state, year: parseInt(target.value) }
                              })
                            }}
                          >
                            {
                              years.map(y => {
                                return (
                                  <option
                                    key={`year-${y}`}
                                    value={y}
                                  >
                                    {y}
                                  </option>
                                )
                              })
                            }
                          </select>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <label className='label'>Log type</label>
                <div className='select'>
                  <select
                    value={logState.type}
                    onChange={({ target }) => {
                      setLogState((state: any) => {
                        return { ...state, type: target.value }
                      })
                    }}
                  >
                    <option value='dividends'>Total Dividends</option>
                    <option value='contributions'>Contributions</option>
                  </select>
                </div>

                <label className='label'>
                  Amount
                  <input
                    className='input'
                    type='text'
                    pattern='[0-9.]+'
                    value={logState.amount}
                    onChange={({ target }) => {
                      setLogState((state: any) => {
                        return { ...state, amount: target.value }
                      })
                    }}
                  />
                </label>

                <button
                  className='button'
                  onClick={() => {
                    saveLog(logState)
                  }}
                >
                  Save
                </button>
              </Card>
            </Column>
          </Columns>
        </div>
      </div>
    </div>
  )
}

export default Logging
