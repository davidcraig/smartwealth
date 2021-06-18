/* global localStorage */
import React from 'react'
import Head from 'next/head'
import Navbar from '../Components/Navbar'
import { Columns, Column, Card } from '@davidcraig/react-bulma'
import { getYear, hasProp, getMonthsOptionsArray, getMonthName } from '../Functions/Helpers'
import { useEffect, useState } from 'react/cjs/react.development'

function LogChart() {

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
      dividends.forEach(d => {
        if (!hasProp(newLogEntries, d.year)) {
          newLogEntries[d.year] = {}
        }
        if (!hasProp(newLogEntries[d.year], d.month)) {
          newLogEntries[d.year][d.month] = {}
        }
        newLogEntries[d.year][d.month].dividends = d.amount
      })
    }
    if (contributions && contributions.length > 0) {
      contributions.forEach(d => {
        if (!hasProp(newLogEntries, d.year)) {
          newLogEntries[d.year] = {}
        }
        if (!hasProp(newLogEntries[d.year], d.month)) {
          newLogEntries[d.year][d.month] = {}
        }
        newLogEntries[d.year][d.month].contributions = d.amount
      })
    }
    setLogEntries(newLogEntries)
  }, [dividends, contributions])

  const saveLog = ({ type, month, year, amount }) => {
    switch (type) {
      case 'dividends':
        localStorage.setItem('dividends', JSON.stringify([...dividends, { month, year, amount }]))
        setDividends([...dividends, { month, year, amount }])
        resetForm()
        break
      case 'contributions':
        localStorage.setItem('contributions', JSON.stringify([...contributions, { month, year, amount }]))
        setContributions([...contributions, { month, year, amount }])
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
                      Object.keys(logEntries).length > 0 &&
                        Object.keys(logEntries)
                          .map(year => {
                            return Object.keys(logEntries[year])
                              .map(month => {
                                const data = logEntries[year][month]
                                return (
                                  <tr key={`${year}-${month}`}>
                                    <td>{getMonthName(month)} {year}</td>
                                    <td>{data.contributions}</td>
                                    <td>{data.dividends}</td>
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
                              setLogState(state => {
                                return { ...state, month: parseInt(target.value) }
                              })
                            }}
                          >
                            {
                              months.map(m => {
                                return (
                                  <option value={m.val}>
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
                              setLogState(state => {
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
                      setLogState(state => {
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
                      setLogState(state => {
                        return { ...state, amount: parseFloat(target.value) }
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
