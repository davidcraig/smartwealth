/* global localStorage */
import React from 'react'
import Head from 'next/head'
import Navbar from '../Components/Navbar'
import { Columns, Column, Card, TabbedContent } from '@davidcraig/react-bulma'

function setThemePreference (theme, preferences, setPreferences) {
  const newPrefs = { ...preferences }
  newPrefs.theme = theme

  localStorage.setItem('preferences', JSON.stringify(newPrefs))
  setPreferences(newPrefs)
}

function Settings ({ preferences, setPreferences }) {
  const themes = [
    { value: 'original', name: 'Original' },
    { value: 'trading212', name: 'Trading 212' },
    { value: 'light', name: 'Light' },
    { value: 'darkmode', name: 'Dark Mode' },
    { value: 'maroon', name: 'Maroon' }
  ]

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
              <Card title='User Preferences'>
                <label className='label'>
                  Theme
                </label>
                <div className='select'>
                  <select
                    value={preferences.theme ?? 'original'}
                    onChange={(e) => {
                      setThemePreference(e.target.value, preferences, setPreferences)
                    }}
                  >
                    {themes.map(t => {
                      return (
                        <option
                          key={t.name}
                          value={t.value}
                        >
                          {t.name}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </Card>
            </Column>
            <Column class='is-one-thirds'>
              <Card title='Theme Elements Preview'>
                <p>Text</p>
                <a>Link</a>
                <label className='label'>
                  Generic Input
                </label>
                <input type='textbox' />
                <TabbedContent
                  content={
                    [
                      { title: 'Test Tab 1', content: <p>Test content 1</p> },
                      { title: 'Test Tab 2', content: <p>Test content 2</p> }
                    ]
                  }
                />

                <p>Table</p>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>Test</th>
                      <th>Test</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Test</td>
                      <td>Test</td>
                    </tr>
                    <tr className='monthly'>
                      <td>Test</td>
                      <td>Test</td>
                    </tr>
                    <tr className='quarterly'>
                      <td>Test</td>
                      <td>Test</td>
                    </tr>
                    <tr className='annualinterim'>
                      <td>Test</td>
                      <td>Test</td>
                    </tr>
                    <tr className='annual__interim'>
                      <td>Test</td>
                      <td>Test</td>
                    </tr>
                    <tr className='irregular'>
                      <td>Test</td>
                      <td>Test</td>
                    </tr>
                    <tr className='suspended'>
                      <td>Test</td>
                      <td>Test</td>
                    </tr>
                    <tr className='bi-annually'>
                      <td>Test</td>
                      <td>Test</td>
                    </tr>
                    <tr className='temporarily_suspended'>
                      <td>Test</td>
                      <td>Test</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </Column>
          </Columns>
        </div>
      </div>
    </div>
  )
}

export default Settings
