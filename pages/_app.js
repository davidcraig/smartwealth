import React, { useState, useEffect } from 'react'
import '../styles/app.scss'

function MyApp({ Component, pageProps }) {
  const [stocks, setStocks] = useState([])
  const [positionsHeld, setPositionsHeld] = useState([])
  const [currentValue, setCurrentValue] = useState([])

  // Load Stocks from SmartWealth public spreadsheet
  useEffect(() => {
    const spreadsheetUrl = 'https://spreadsheets.google.com/feeds/cells/1sSOTCWajfq_t0SEMFhfR0JedhgGXNeIH0ULMA2310c0/1/public/values?alt=json'
    const SpreadsheetWorker = new Worker('/js/spreadsheet.js')
    let store = localStorage

    const stocks = JSON.parse(store.getItem('stocks'))

    if (stocks == null) {
      SpreadsheetWorker.postMessage({ type: 'parse', url: spreadsheetUrl, headerRow: 3 })
    } else {
      setStocks(stocks)
    }

    SpreadsheetWorker.onmessage = (e => {
      if (e.data.type === 'parse-result') {
        store.setItem('stocks', JSON.stringify(e.data.data))
        setStocks(e.data.data)
      }
    })
  }, [])

  // Load any held positions from localStorage.
  useEffect(() => {
    let store = localStorage

    let positions = store.getItem('positions')

    if (positions == null) {
      //
    } else {
      setPositionsHeld(JSON.parse(positions))
    }
  }, [])

  return (
    <Component
      {...pageProps}
      stocks={stocks}
      positionsHeld={positionsHeld}
      setPositionsHeld={setPositionsHeld}
    />
  )
}

export default MyApp
