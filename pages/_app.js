/* global localStorage, Worker */
import React, { useState, useEffect } from 'react'
import GetStock from '../Functions/GetStock'
import '../styles/app.scss'

function loadTheme (styles) {
  const root = document.querySelector(':root')
  styles.forEach(s => {
    root.style.setProperty(s.var, s.val)
  })
}

function themeOriginal () {
  const styles = [
    { var: '--color-bg', val: '#383838' },
    { var: '--color-bg-alt', val: '#292929' },
    { var: '--color-text', val: '#ececec' },
    { var: '--color-border', val: '#000000' },
    { var: '--color-heading', val: '#157ebb' },
    { var: '--color-button', val: '#157ebb' }
  ]
  loadTheme(styles)
}

function themeTrading212 () {
  const styles = [
    { var: '--color-bg', val: '#2e313b' },
    { var: '--color-bg-alt', val: '#363945' },
    { var: '--color-border', val: '#494e5c' },
    { var: '--color-heading', val: '#e0e8ff' },
    { var: '--color-button', val: '#00a7e1' }
  ]
  loadTheme(styles)
}

function handlePreferences (preferences) {
  if (Object.keys(preferences).length > 0) {
    if (preferences.theme) {
      switch (preferences.theme) {
        case 'trading212':
          themeTrading212()
          break
        case 'original':
        default:
          themeOriginal()
          break
      }
    }
  } else {
    // themeTrading212()
  }
}

function MyApp ({ Component, pageProps }) {
  const [stocks, setStocks] = useState([])
  const [preferences, setPreferences] = useState([])
  const [positionsHeld, setPositionsHeld] = useState([])

  // Load user preferences if there are any.
  useEffect(() => {
    const preferences = JSON.parse(localStorage.getItem('preferences'))
    if (preferences) {
      handlePreferences(preferences)
      setPreferences(preferences)
    }
  }, [])

  // Load Stocks from SmartWealth public spreadsheet
  useEffect(() => {
    const spreadsheetUrl = 'https://spreadsheets.google.com/feeds/cells/1sSOTCWajfq_t0SEMFhfR0JedhgGXNeIH0ULMA2310c0/1/public/values?alt=json'
    const SpreadsheetWorker = new Worker('/js/spreadsheet.js')
    const store = localStorage

    const requestStocksUpdate = () => SpreadsheetWorker.postMessage({ type: 'parse', url: spreadsheetUrl, headerRow: 3 })

    const stocks = JSON.parse(store.getItem('stocks'))
    const stocksLastUpdated = JSON.parse(store.getItem('stocks-updated'))

    if (stocks == null) {
      requestStocksUpdate()
    } else {
      setStocks(stocks)
    }

    if (stocksLastUpdated === null) {
      requestStocksUpdate()
    } else {
      const lastUpdated = new Date(stocksLastUpdated)
      const now = new Date()
      const diff = now - lastUpdated
      if (diff > (1000 * 60 * 60 * 24)) {
        requestStocksUpdate()
      }
    }

    SpreadsheetWorker.onmessage = e => {
      if (e.data.type === 'parse-result') {
        store.setItem('stocks-updated', JSON.stringify(new Date()))
        store.setItem('stocks', JSON.stringify(e.data.data))
        setStocks(e.data.data)
      }
    }
  }, [])

  useEffect(() => { handlePreferences(preferences) }, [preferences])

  // Load any held positions from localStorage.
  useEffect(() => {
    const positions = localStorage.getItem('positions')

    if (positions == null) {
      //
    } else {
      if (stocks.length === 0) {
        const pos = JSON.parse(positions)
        setPositionsHeld(pos)
      } else {
        let pos = JSON.parse(positions)
        pos = pos.map(p => {
          const stock = GetStock(p.stock.ticker, stocks)
          p.stock = stock
          return p
        })
        setPositionsHeld(pos)
      }
    }
  }, [stocks])

  return (
    <Component
      {...pageProps}
      stocks={stocks}
      positionsHeld={positionsHeld}
      setPositionsHeld={setPositionsHeld}
      preferences={preferences}
      setPreferences={setPreferences}
    />
  )
}

export default MyApp
