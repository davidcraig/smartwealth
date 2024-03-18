/* global btoa, atob */
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Navbar from '../Components/Navbar'
import Card from '../Components/Card'
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
  setPreferences(newPrefs)
}

function Settings ({ preferences, setPreferences, dividends, contributions, positionsHeld, setContributions, setDividends, setPositionsHeld }) {
  const [exportData, setExportData] = useState({})
  const [importData, _set] = useState({}) // eslint-disable-line no-unused-vars
  useEffect(() => {
    setExportData(buildExport({ preferences, dividends, contributions, positionsHeld }))
  }, [preferences, dividends, contributions, positionsHeld])

  const themes = [
    { value: 'original', name: 'Original' },
    { value: 'trading212', name: 'Trading 212' },
    { value: 'darkdiamond', name: 'Dark Diamond' },
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

      <div className=''>
        <div className='content'>
          <div className='grid'>
            <div className='is-two-thirds'>
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
                    (e) => { handleImportData(e.target.value, setPreferences, setDividends, setContributions, setPositionsHeld) }
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
            </div>
            <div className='is-one-thirds'>
              <ThemeElementsPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
