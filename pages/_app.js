/* global localStorage, Worker */
import React, { useState, useEffect, useLayoutEffect } from 'react'
import useStorageState from '../Functions/useStorageState'
import '../styles/app.scss'

function loadTheme (styles) {
  const root = document.querySelector(':root')
  styles.forEach(s => {
    root.style.setProperty(s.var, s.val)
  })
}

function handlePreferences (preferences) {
  if (Object.keys(preferences).length > 0) {
    if (preferences.theme) {
      switch (preferences.theme) {
        case 'trading212':
          import('../Themes/trading212').then(theme => {
            loadTheme(theme.default)
          })
          break
        case 'light':
          import('../Themes/light').then(theme => {
            loadTheme(theme.default)
          })
          break
        case 'darkmode':
          import('../Themes/darkmode').then(theme => {
            loadTheme(theme.default)
          })
          break
        case 'maroon':
          import('../Themes/maroon').then(theme => {
            loadTheme(theme.default)
          })
          break
        case 'original':
        default:
          import('../Themes/original').then(theme => {
            loadTheme(theme.default)
          })
          break
      }
    }
  } else {
    // themeTrading212()
  }
}

function MyApp ({ Component, pageProps }) {
  const [stocks, setStocks] = useStorageState([], 'stocks')
  const [preferences, setPreferences] = useStorageState([], 'preferences')
  const [positionsHeld, setPositionsHeld] = useStorageState([], 'positions')
  const [contributions, setContributions] = useStorageState([], 'contributions')
  const [dividends, setDividends] = useStorageState([], 'dividends')

  useLayoutEffect(() => {
    handlePreferences(preferences)
  }, [preferences])

  // Load user preferences if there are any.
  // useEffect(() => {
  //   handlePreferences(preferences)
  // }, [preferences])

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

    // Register the spreadsheet worker messages
    SpreadsheetWorker.onmessage = e => {
      if (e.data.type === 'parse-result') {
        store.setItem('stocks-updated', JSON.stringify(new Date()))
        store.setItem('stocks', JSON.stringify(e.data.data))
        setStocks(e.data.data)
      }
    }
  }, [])

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
        import('../Functions/GetStock').then(f => {
          pos = pos.map(p => {
            const stock = f.GetStock(p.stock.ticker, stocks)
            p.stock = stock
            return p
          })
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
      setContributions={setContributions}
      setDividends={setDividends}
      dividends={dividends}
      contributions={contributions}
    />
  )
}

export default MyApp
