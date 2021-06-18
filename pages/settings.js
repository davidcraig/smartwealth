/* global localStorage, btoa, atob */
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Navbar from '../Components/Navbar'
import { Columns, Column, Card } from '@davidcraig/react-bulma'
import ThemeElementsPreview from '../Components/Settings/ThemeElementsPreview'
import { hasProp } from '../Functions/Helpers'

function buildExport ({ preferences, dividends, contributions, positionsHeld }) {
  const output = {
    preferences,
    dividends,
    contributions,
    positionsHeld
  }

  return btoa(JSON.stringify(output))
}

function handleImportData (str, setPreferences, setDividends, setContributions, setPositionsHeld) {
  const json = atob(str)
  const imported = JSON.parse(json)
  if (
    hasProp(imported, 'dividends') &&
    hasProp(imported, 'preferences') &&
    hasProp(imported, 'contributions') &&
    hasProp(imported, 'positionsHeld')
  ) {
    setPreferences(imported.preferences)
    setContributions(imported.contributions)
    setDividends(imported.dividends)
    setPositionsHeld(imported.positionsHeld)
  }
}

function setThemePreference (theme, preferences, setPreferences) {
  const newPrefs = { ...preferences }
  newPrefs.theme = theme

  localStorage.setItem('preferences', JSON.stringify(newPrefs))
  setPreferences(newPrefs)
}

function Settings ({ preferences, setPreferences, dividends, contributions, positionsHeld }) {
  const [exportData, setExportData] = useState({})
  const [importData, _set] = useState({}) // eslint-disable-line no-unused-vars
  useEffect(() => {
    setExportData(buildExport({ preferences, dividends, contributions, positionsHeld }))
  }, [preferences, dividends, contributions, positionsHeld])

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
              <Card title='Import / Export (Beta)'>
                <h4 className='h4'>Import</h4>
                <textarea
                  className='textarea'
                  onChange={
                    (e) => { handleImportData(e.target.value) }
                  }
                />
                <button
                  className='button'
                  onClick={() => {
                    // TODO: Do something to actually import here.
                  }}
                >
                  Import Data
                </button>

                <h4 className='h4'>Export</h4>
                <p>This may be a large amount of text so make sure you copy it all, i'd recommend testing an import after copying using incognito/private mode.</p>
                <textarea
                  className='textarea'
                  readOnly
                  value={exportData}
                />
              </Card>
            </Column>
            <Column class='is-one-thirds'>
              <ThemeElementsPreview />
            </Column>
          </Columns>
        </div>
      </div>
    </div>
  )
}

export default Settings
