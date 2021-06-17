/* global localStorage */
import React from 'react'
import Head from 'next/head'
import Navbar from '../Components/Navbar'
import { Columns, Column, Card } from '@davidcraig/react-bulma'

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
    { value: 'light', name: 'Light' }
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
            <Column>
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
          </Columns>
        </div>
      </div>
    </div>
  )
}

export default Settings
