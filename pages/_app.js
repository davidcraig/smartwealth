import React, { useState, useEffect } from 'react';
import '../styles/app.scss'


function MyApp({ Component, pageProps }) {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const spreadsheetUrl = 'https://spreadsheets.google.com/feeds/cells/1sSOTCWajfq_t0SEMFhfR0JedhgGXNeIH0ULMA2310c0/1/public/values?alt=json'
    const SpreadsheetWorker = new Worker('/js/spreadsheet.js')
    let store = localStorage

    let stocks = JSON.parse(store.getItem('stocks'))

    if (stocks == null) {
      console.log('sending worker parse request')
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
  }, []);

  return <Component {...pageProps} stocks={stocks} />
}

export default MyApp
