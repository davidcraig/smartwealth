/* global localStorage */
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Navbar from '../Components/Navbar'
import StockInterface from '../types/Stock'
import FormattedDecimal from '../Functions/Formatting/FormattedDecimal'
import PositionHeldInterface from '../types/PositionHeld'
import { Column, Columns, Card } from '@davidcraig/react-bulma'
import useStorageState from '../Functions/useStorageState'
import uuid from '../Functions/uuid'
import { connect } from 'react-redux'

interface IGoal {
  text: string;
  value: number;
  id: string;
  complete: boolean;
}

interface ICustomGoal {
  id: string;
  name: string;
  type: 'custom' | 'stock_amount';
  target: number;
  ticker?: string;
  complete: boolean;
}

const completedGoalStyle = {
  color: '#18b518',
  fontStyle: 'italic',
  padding: '0 0.75em'
}

const defaultGoals = {
  invested: [
    { text: '£100 Invested', value: 100, id: 'inv100', complete: false },
    { text: '£250 Invested', value: 250, id: 'inv250', complete: false },
    { text: '£500 Invested', value: 500, id: 'inv500', complete: false },
    { text: '£1,000 Invested', value: 1000, id: 'inv1000', complete: false },

    { text: '£2,500 Invested', value: 2500, id: 'inv2500', complete: false },
    { text: '£5,000 Invested', value: 5000, id: 'inv5000', complete: false },
    { text: '£10,000 Invested', value: 10000, id: 'inv10000', complete: false },
    { text: '£25,000 Invested', value: 25000, id: 'inv25000', complete: false },
    { text: '£50,000 Invested', value: 50000, id: 'inv50000', complete: false },
    { text: '£100,000 Invested', value: 100000, id: 'inv100000', complete: false },
    { text: '£250,000 Invested', value: 250000, id: 'inv250000', complete: false },
    { text: '£500,000 Invested', value: 500000, id: 'inv500000', complete: false },
    { text: '£1,000,000 Invested', value: 1000000, id: 'inv1000000', complete: false }
  ],
  monthlyDividends: [
    { text: '£5 / Month', value: 5, id: 'mdiv5', complete: false },
    { text: '£10 / Month', value: 10, id: 'mdiv10', complete: false },
    { text: '£25 / Month', value: 25, id: 'mdiv25', complete: false },
    { text: '£50 / Month', value: 50, id: 'mdiv50', complete: false },
    { text: '£100 / Month', value: 100, id: 'mdiv100', complete: false },
    { text: '£150 / Month', value: 150, id: 'mdiv150', complete: false },
    { text: '£250 / Month', value: 250, id: 'mdiv250', complete: false },
    { text: '£375 / Month', value: 375, id: 'mdiv375', complete: false },
    { text: '£500 / Month', value: 500, id: 'mdiv500', complete: false },
    { text: '£750 / Month', value: 750, id: 'mdiv750', complete: false },
    { text: '£1000 / Month', value: 1000, id: 'mdiv1000', complete: false },
    { text: '£1500 / Month', value: 1500, id: 'mdiv1500', complete: false },
    { text: '£2500 / Month', value: 2500, id: 'mdiv2500', complete: false },
    { text: '£5000 / Month', value: 5000, id: 'mdiv5000', complete: false },
    { text: '£7500 / Month', value: 7500, id: 'mdiv7500', complete: false },
    { text: '£10000 / Month', value: 10000, id: 'mdiv10000', complete: false }
  ],
  emergencyFund: [
    { text: '£250 / Emergency Fund', value: 250, id: 'emfund250', complete: false },
    { text: '£500 / Emergency Fund', value: 500, id: 'emfund500', complete: false },
    { text: '£1000 / Emergency Fund', value: 1000, id: 'emfund1000', complete: false },
    { text: '£2000 / Emergency Fund', value: 2000, id: 'emfund2000', complete: false },
    { text: '£3000 / Emergency Fund', value: 3000, id: 'emfund3000', complete: false },
    { text: '£4000 / Emergency Fund', value: 4000, id: 'emfund4000', complete: false },
    { text: '£5000 / Emergency Fund', value: 5000, id: 'emfund5000', complete: false },
    { text: '£6000 / Emergency Fund', value: 6000, id: 'emfund6000', complete: false }
  ]
}

function toggleGoalComplete (goals, key: string, goal: IGoal, setGoals) {
  const newGoals = goals[key].map((g: IGoal) => {
    if (g.id === goal.id) {
      g.complete = !goal.complete
      return g
    }

    return g
  })

  goals[key] = newGoals
  setGoals({...goals})
}

function toggleCustomGoalComplete (customGoals, goal: ICustomGoal, setCustomGoals) {
  const newCustomGoals = customGoals.map((g: ICustomGoal) => {
    if (g.id === goal.id) {
      g.complete = !goal.complete
      return g
    }

    return g
  })

  setCustomGoals([...newCustomGoals])
}

function RenderGoals ({ goals, keyName, title, setGoals }) {
  if (
    !goals ||
    !goals[keyName] ||
    goals[keyName].length < 1
  ) { return null }

  return (
    <Card title={title}>
      <table className='is-narrow goals'>
        <tbody>
          {goals[keyName].map((goal: IGoal) => {
            const rowStyle = goal.complete ? completedGoalStyle : null

            return (
              <tr key={`goal-${goal.id}`}>
                <td style={rowStyle}>{goal.text}</td>
                <td style={rowStyle}>
                  <input
                    type='checkbox'
                    defaultChecked={goal.complete}
                    onClick={() => {
                      toggleGoalComplete(goals, keyName, goal, setGoals)
                    }}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Card>
  )
}

function renderCustomGoalByType (customGoal, deleteCustomGoal, customGoals, setCustomGoals, positionsHeld) {
  let cellStyle = {}

  switch (customGoal.type) {
    case 'stock_amount':
      let position = null
      let progress = 0
      let qty = 0

      if (positionsHeld.length > 0) {
        const filteredPos = positionsHeld.filter((pos: PositionHeldInterface) => {
          return pos.stock.ticker === customGoal.ticker
        })
        if (filteredPos.length > 0) {
          position = filteredPos[0]
        }
      }

      if (position !== null && typeof position === 'object') {
        qty = parseFloat(position.quantity)
        progress = (qty / customGoal.target) * 100
        if (progress > 100) {
          progress = 100
        }
        cellStyle = qty > customGoal.target ? completedGoalStyle : {}
      }

      return (
        <tr key={customGoal.id}>
          <td style={cellStyle}>{customGoal.name}</td>
          <td style={cellStyle}>{progress === 100 ? customGoal.target : (
            <>
              {FormattedDecimal(qty)} / {FormattedDecimal(customGoal.target)}
            </>
          )}</td>
          <td style={cellStyle}>
            <a onClick={() => {
              const x = confirm('Are you sure')
              if (x) {
                deleteCustomGoal(customGoal.id)
              }
            }}>X</a>
          </td>
        </tr>
      )
    case 'custom':
      if (customGoal.complete) {
        cellStyle = completedGoalStyle
      }
      return (
        <tr>
          <td style={cellStyle}>{customGoal.name}</td>
          <td style={cellStyle}>
            <input
              type='checkbox'
              defaultChecked={customGoal.complete}
              onChange={(e) => {
                toggleCustomGoalComplete(customGoals, customGoal, setCustomGoals)
              }}
            />
          </td>
          <td style={cellStyle}>
            <a onClick={() => {
              const x = confirm('Are you sure')
              if (x) {
                deleteCustomGoal(customGoal.id)
              }
            }}>X</a>
          </td>
        </tr>
      )
  }
}

function renderCustomGoals (
  customGoals,
  setCustomGoals,
  positionsHeld,
  goalType,
  goalName,
  goalTicker,
  goalTarget,
  stocks,
  filteredStocks,
  setGoalType,
  setGoalName,
  setGoalTicker,
  setGoalTarget,
  addCustomGoal,
  deleteCustomGoal,
  setFilteredStocks
) {
  return (
    <Card title='Custom Goals'>
      {
        customGoals.length > 0 && (
          <table className='is-narrow goals'>
            <tbody>
              {customGoals.map((customGoal: ICustomGoal) => {
                return renderCustomGoalByType(customGoal, deleteCustomGoal, customGoals, setCustomGoals, positionsHeld)
              })}
            </tbody>
          </table>
        )
      }

      <p>Add a goal</p>

      <label className='label'>
        Goal Name
        <input
          className='input'
          defaultValue={goalName}
          onChange={(e) => {setGoalName(e.target.value)}}
        />
      </label>

      <label className='label'>
        Goal Type
      </label>
      <div
        className='select'
      >
        <select
          defaultValue={goalType}
          onChange={(e) => { setGoalType(e.target.value) }}
        >
          <option value='custom'>Custom</option>
          <option value='stock_amount'>Number of Stocks</option>
        </select>
      </div>

      {
        goalType === 'stock_amount' && filteredStocks && (
          <>
            <label className='label'>
              Stock?
            </label>
            <div className='select'>
              <select
                onChange={(e) => { setGoalTicker(e.target.value) }}
              >
                <option>N/A</option>
                {filteredStocks.map((stock: StockInterface) => (
                  <option key={stock.ticker} value={stock.ticker}>{stock.name}</option>
                ))}
              </select>
            </div>
            <label className='label'>
              Filter:
              <input className='input' onChange={({target}) => {
                if (target.value.length > 0) {
                  const matcher = target.value.toLowerCase()
                  setFilteredStocks(stocks.filter(s => s.ticker.toLowerCase().match(matcher) || s.name.toLowerCase().match(matcher)))
                } else {
                  setFilteredStocks(stocks)
                }
              }} />
            </label>

            <label className='label'>
              Target
              <input
                className='input'
                defaultValue={goalTarget}
                onChange={(e) => {setGoalTarget(e.target.value)}}
              />
            </label>
            
          </>
        )
      }

      <a className='button is-primary' onClick={() => { addCustomGoal() }}>Add Goal</a>
    </Card>
  )
}

export function Goals ({ stocks, positionsHeld }) {
  const [goals, setGoals] = useStorageState(defaultGoals, 'goals')
  const [customGoals, setCustomGoals] = useStorageState([], 'custom-goals')
  const [goalType, setGoalType] = useState('custom')
  const [goalName, setGoalName] = useState('')
  const [goalTarget, setGoalTarget] = useState(0)
  const [goalTicker, setGoalTicker] = useState('')
  const [filteredStocks, setFilteredStocks] = useState([])
  const addCustomGoal = () => {
    if (goalType === 'stock_amount' && goalTicker === '') {
      console.warn('Cant save a stock amount goal without a ticker symbol')
      return ''
    }

    setCustomGoals([
      ...customGoals,
      {
        id: uuid(),
        name: goalName,
        type: goalType,
        target: goalTarget,
        ticker: goalTicker,
      }
    ])
    setGoalName('')
    setGoalTarget(0)
    setGoalType('custom')
    setGoalTicker('')
  }

  const deleteCustomGoal = (id: string) => {
    const newCustomGoals = customGoals.filter((g: ICustomGoal) => {
      return g.id !== id
    })
    setCustomGoals(newCustomGoals)
  }

  useEffect(() => {
    console.log('stocks', stocks)
    setFilteredStocks(stocks)
  }, [stocks])

  return (
    <div>
      <Head>
        <title>SmartWealth</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar />
      <div className='container is-fluid'>
        <div className='content'>
          <h1>FIRE Goals</h1>
          <Columns>
            <Column class='is-one-quarter'>
              <RenderGoals goals={goals} keyName='invested' title='Amount Invested' setGoals={setGoals} />
            </Column>
            <Column class='is-one-quarter'>
              <RenderGoals goals={goals} keyName='monthlyDividends' title='Monthly Dividends' setGoals={setGoals} />
            </Column>
            <Column class='is-one-quarter'>
              <RenderGoals goals={goals} keyName='emergencyFund' title='Emergency Fund' setGoals={setGoals} />
            </Column>
            <Column class='is-one-quarter'>
              {
                renderCustomGoals(
                  customGoals,
                  setCustomGoals,
                  positionsHeld,
                  goalType,
                  goalName,
                  goalTicker,
                  goalTarget,
                  stocks,
                  filteredStocks,
                  setGoalType,
                  setGoalName,
                  setGoalTicker,
                  setGoalTarget,
                  addCustomGoal,
                  deleteCustomGoal,
                  setFilteredStocks
                )
              }
            </Column>
          </Columns>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  stocks: state.stocks.data
})

export default connect(mapStateToProps)(Goals)
