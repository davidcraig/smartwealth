/* global localStorage, Worker */
import React, { useEffect, useLayoutEffect } from 'react'
import useStorageState from '../Functions/useStorageState'
import '../styles/app.scss'
import { store } from '../src/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

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
        case 'darkdiamond':
          import('../Themes/darkdiamond').then(theme => {
            loadTheme(theme.default)
          })
          break
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

const persistor = persistStore(store)

function MyApp ({ Component, pageProps, stocks }) {
  const [preferences, setPreferences] = useStorageState([], 'preferences')
  const [positionsHeld, setPositionsHeld] = useStorageState([], 'positions')
  const [contributions, setContributions] = useStorageState([], 'contributions')
  const [dividends, setDividends] = useStorageState([], 'dividends')

  if (typeof window !== 'undefined') {
    useLayoutEffect(() => {
      handlePreferences(preferences)
    }, [preferences])
  }

  // Load Stocks from SmartWealth public spreadsheet
  useEffect(() => {
    const spreadSheetId = '1sSOTCWajfq_t0SEMFhfR0JedhgGXNeIH0ULMA2310c0'
    const spreadSheetTabName = 'Combined' // indexed from 1
    const apiKey = 'AIzaSyBpINZ6BpCyq57X0EUIHBqy8DsisZ59ZUA'
    const spreadsheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}/values/${spreadSheetTabName}?alt=json&key=${apiKey}`
    const SpreadsheetWorker = new Worker('/js/spreadsheet.js')

    const requestStocksUpdate = () => {
      SpreadsheetWorker.postMessage({ type: 'parse', url: spreadsheetUrl, headerRow: 3 })
    }

    const stocksLastUpdated = JSON.parse(localStorage.getItem('stocks-updated'))

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
        if (e.data.data.length > 0) {
          localStorage.setItem('stocks-updated', JSON.stringify(new Date()))
          store.dispatch({ type: 'stocks/setStocks', payload: e.data.data })
        }
      }
    }
  }, [])

  // Load any held positions from localStorage.
  // useEffect(() => {
  //   const positions = localStorage.getItem('positions')

  //   if (positions == null) {
  //     //
  //   } else {
  //     if (stocks.length === 0) {
  //     } else {
  //       let pos = JSON.parse(positions)
  //       if (pos) {
  //         import('../Functions/GetStock').then(f => {
  //           pos = pos.map(p => {
  //             const stock = f.GetStock(p.stock.ticker, stocks)
  //             p.stock = stock
  //             return p
  //           })
  //         })
  //         setPositionsHeld(pos)
  //       }
  //     }
  //   }
  // }, [stocks])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component
          {...pageProps}
          positionsHeld={positionsHeld}
          setPositionsHeld={setPositionsHeld}
          preferences={preferences}
          setPreferences={setPreferences}
          setContributions={setContributions}
          setDividends={setDividends}
          dividends={dividends}
          contributions={contributions}
        />
      </PersistGate>
    </Provider>
  )
}

export default MyApp
