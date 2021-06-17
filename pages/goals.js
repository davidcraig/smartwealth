/* global localStorage */
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Navbar from '../Components/Navbar'
import { Column, Columns, Card } from '@davidcraig/react-bulma'

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

function saveGoals (goals, setGoals) {
  localStorage.setItem('goals', JSON.stringify(goals))
  setGoals(goals)
}

function toggleGoalComplete (goals, key, goal, setGoals) {
  goals[key].map(g => {
    if (g.id === goal.id) {
      g.complete = !goal.complete
      return g
    }

    return g
  })

  saveGoals(goals, setGoals)
}

const completedGoalStyle = {
  color: 'limegreen',
  fontStyle: 'italic',
  padding: '0.2em 0.75em'
}

function renderGoals (goals, key, title, setGoals) {
  if (!goals || !goals[key] || goals[key].length < 1) {
    return null
  }

  return (
    <>
      <Card title={title}>
        <table className='is-narrow goals'>
          <tbody>
            {goals[key].map(goal => {
              return (
                <tr key={goal.id}>
                  <td
                    style={
                      goal.complete
                        ? completedGoalStyle
                        : {}
                    }
                  >
                    {goal.text}
                  </td>
                  <td
                    style={
                      goal.complete
                        ? completedGoalStyle
                        : {}
                    }
                  >
                    <input
                      type='checkbox'
                      defaultChecked={goal.complete}
                      onChange={(e) => {
                        toggleGoalComplete(goals, key, goal, setGoals)
                      }}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </>
  )
}

function Goals () {
  useEffect(() => {
    const storedGoals = localStorage.getItem('goals')

    // Load goals from localStorage or defaults
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals))
    } else {
      saveGoals(defaultGoals, setGoals)
    }
  }, [])

  const [goals, setGoals] = useState({})

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
            <Column class='is-one-third'>
              {renderGoals(goals, 'invested', 'Amount Invested', setGoals)}
            </Column>
            <Column class='is-one-third'>
              {renderGoals(goals, 'monthlyDividends', 'Monthly Dividends', setGoals)}
            </Column>
            <Column class='is-one-third'>
              {renderGoals(goals, 'emergencyFund', 'Emergency Fund', setGoals)}
            </Column>
          </Columns>
        </div>
      </div>
    </div>
  )
}

export default Goals
