/* global self */
'use strict'
// Handles: { type: 'perform-forecast', positions }
// Messages out: forecast-log-entry, forecast-results
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const cache = {
  dividendMonths: {},
  dividendInterimMonths: {}
}

const config = {
  years: 40
}

function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    /* eslint-disable */
    const r = Math.random() * 16 | 0, v = c === 'x'
      ? r
      : (r & 0x3 | 0x8)
    return v.toString(16)
    /* eslint-enable */
  })
}

let isForecasting = false

const rates = {
  usWithholding: 0.85,
  usd: {
    gbp: 0.723047
  },
  gbx: {
    gbp: 0.01
  },
  gbp: {
    usd: 1.3830366,
    gbx: 100
  }
}

function getLastDividend (position) {
  const stock = position.stock
  if (typeof stock['last_dividend amount'] !== 'undefined') {
    return stock['last_dividend amount']
  }
  if (typeof stock.last_dividend_amount !== 'undefined') {
    return stock.last_dividend_amount
  }
  return 0
}

function getLastInterimDividend (position) {
  const stock = position.stock
  if (typeof stock['latest_interim amount'] !== 'undefined') {
    return stock['latest_interim amount']
  }
  if (typeof stock.latest_interim_amount !== 'undefined') {
    return stock.latest_interim_amount
  }
  return 0
}

function getPositionQuantity (position) {
  switch (typeof position.quantity) {
    case 'number':
      return parseFloat(position.quantity)
    case 'string':
      return parseFloat(position.quantity)
    case undefined:
      return parseFloat(0)
    default:
      console.warn('uncaught typeof', typeof value)
  }

  return position.quantity
}

function parseCurrency (value) {
  if (!value) {
    return 0
  }
  switch (typeof value) {
    case 'number':
      return value
    case 'string':
      return parseFloat(value
        .replace('$', '')
        .replace('p', '')
        .replace('£', '')
      )
    case undefined:
      return 0
    default:
      console.warn('uncaught typeof', typeof value)
  }
}

function calculateRealDividend (stock, dividendAmount, quantity) {
  if (quantity === 0 || dividendAmount === 0) {
    return 0
  }
  const currency = stock.currency
  if (isNaN(dividendAmount)) {
    console.warn('dividendAmount is NaN', stock)
    return 0
  }

  const dividend = dividendAmount * quantity

  switch (currency) {
    case 'USD':
      // Dividend amount * 0.85 (15% witholding)
      dividendAmount = (dividend * rates.usWithholding) * rates.usd.gbp
      break
    case 'GBX p':
      dividendAmount = dividend * rates.gbx.gbp
      break
    case 'GBP':
      dividendAmount = dividend
      break
    default:
      console.warn(`unhandled case for currency: ${currency}`)
      break
  }
  return parseFloat(dividendAmount.toFixed(2))
}

function getDividendMonths (stock) {
  function cacheResult (stock, result) {
    // @ts-ignore
    cache.dividendMonths[stock.name] = result
    return result
  }
  // @ts-ignore
  if (cache.dividendMonths[stock.name]) {
    // @ts-ignore
    return cache.dividendMonths[stock.name]
  }
  if (stock.dividend_frequency === 'Monthly') {
    return cacheResult(stock, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  }
  if (!stock.dividend_months) {
    return cacheResult(stock, [])
  }
  const monthRegex = /(\[.+\])/
  try {
    // @ts-ignore
    const months = stock.dividend_months
      .match(monthRegex)[0]
      .replace('[', '')
      .replace(']', '')
      .split(',')
      .map(n => parseInt(n))
    return cacheResult(stock, months)
  } catch (err) {
    console.error('Error in getDividendMonths', err)
    return []
  }
}

function getDividendInterimMonths (stock) {
  function cacheResult (stock, result) {
    // @ts-ignore
    cache.dividendInterimMonths[stock.name] = result
    return result
  }
  // @ts-ignore
  if (cache.dividendInterimMonths[stock.name]) {
    // @ts-ignore
    return cache.dividendInterimMonths[stock.name]
  }
  if (stock.dividend_frequency === 'Monthly' ||
    stock.dividend_frequency === 'Quarterly') {
    return cacheResult(stock, [])
  }
  if (!stock.interim_months) {
    return cacheResult(stock, [])
  }
  const monthRegex = /(\[.+\])/
  try {
    // @ts-ignore
    const months = stock.interim_months
      .match(monthRegex)[0]
      .replace('[', '')
      .replace(']', '')
      .split(',')
      .map(n => parseInt(n))
    return cacheResult(stock, months)
  } catch (err) {
    console.error('Error in getDividendInterimMonths', err)
    return []
  }
}

function recordDividend (amount, stock, currentPeriod, year, forecastChartData) {
  if (amount < 0) { console.error('amount is negative') }

  forecastChartData.fortyYears.dividendData[stock.name][currentPeriod] = amount
  if (year < 31) { forecastChartData.thirtyYears.dividendData[stock.name][currentPeriod] = amount }
  if (year < 11) { forecastChartData.tenYears.dividendData[stock.name][currentPeriod] = amount }
  if (year < 6) { forecastChartData.fiveYears.dividendData[stock.name][currentPeriod] = amount }
  if (year < 2) { forecastChartData.oneYear.dividendData[stock.name][currentPeriod] = amount }

  return forecastChartData
}

function recordShareBuy (amount, position, currentPeriod, year, forecastChartData) {
  if (amount < 0) { console.error('amount is negative') }

  if (
    (currentPeriod in forecastChartData.fortyYears.shareData[position.stock.name]) &&
    forecastChartData.fortyYears.shareData[position.stock.name][currentPeriod] > 0
  ) {
    return forecastChartData
  }

  const newQuantity = parseFloat((getPositionQuantity(position) + amount).toFixed(6))

  forecastChartData.fortyYears.shareData[position.stock.name][currentPeriod] = newQuantity
  if (year < 31) { forecastChartData.thirtyYears.shareData[position.stock.name][currentPeriod] = newQuantity }
  if (year < 11) { forecastChartData.tenYears.shareData[position.stock.name][currentPeriod] = newQuantity }
  if (year < 6) { forecastChartData.fiveYears.shareData[position.stock.name][currentPeriod] = newQuantity }
  if (year < 2) { forecastChartData.oneYear.shareData[position.stock.name][currentPeriod] = newQuantity }

  return forecastChartData
}

function calculateNewShares (dividendAmount, sharePrice) {
  return parseFloat(dividendAmount / parseCurrency(sharePrice))
}

function performMonthForecast (jsMonth, currentPeriod, year, positions, forecastChartData, logEntries = [], pies, pieContributions = []) {
  if (!positions || positions.length === 0) {
    return [
      positions,
      pies,
      forecastChartData,
      logEntries
    ]
  }
  const calendarMonth = jsMonth + 1
  const categoryName = `(${year}) ${MONTHS[jsMonth]}`

  // Create all the months
  forecastChartData.fortyYears.months.push(categoryName)
  if (year < 31) { forecastChartData.thirtyYears.months.push(categoryName) }
  if (year < 11) { forecastChartData.tenYears.months.push(categoryName) }
  if (year < 6) { forecastChartData.fiveYears.months.push(categoryName) }
  if (year < 2) { forecastChartData.oneYear.months.push(categoryName) }

  // Perform the forecasting
  positions = positions.map(p => {
    // Post a message to say which stock we are forecasting
    const qty = getPositionQuantity(p)
    const stock = p.stock
    const lastDividend = parseCurrency(getLastDividend(p))
    const thisDividend = calculateRealDividend(stock, lastDividend, qty)
    const interimDividend = parseCurrency(getLastInterimDividend(p))
    const thisInterimDividend = calculateRealDividend(stock, interimDividend, qty)
    const dividendMonths = getDividendMonths(stock)
    const interimMonths = getDividendInterimMonths(stock)

    const isDividendMonth = dividendMonths.includes(calendarMonth)
    const isInterimMonth = interimMonths.includes(calendarMonth)

    const sendDividendPayoutLogEntry = (p, year, month, amount) => {
      const logEntry = {
        year: year,
        id: uuidv4(),
        level: 'success',
        month: month,
        message: `
          Stock: ${p.stock.name}
          Current Shares: ${p.quantity}
          This Dividend: ${amount}
          Pie?: ${p.pie || 'individual'}
        `
      }
      logEntries.push(logEntry)
    }

    // Only perform this logic for non-pie positions
    if (p.pie === '') {
      // Is not a pie
      let newShares = 0
      let dividendAmount = 0
      if (!isDividendMonth && !isInterimMonth) {
        // Is not a dividend month
        forecastChartData = recordDividend(0, p.stock, currentPeriod, year, forecastChartData)
        forecastChartData = recordShareBuy(0, p, currentPeriod, year, forecastChartData)
        return p
      }

      if (isDividendMonth) {
        newShares = calculateNewShares(thisInterimDividend, p.stock.share_price)
        dividendAmount = thisInterimDividend
        sendDividendPayoutLogEntry(p, year, calendarMonth, thisDividend)
      }
      if (isInterimMonth) {
        newShares = calculateNewShares(thisDividend, p.stock.share_price)
        dividendAmount = thisDividend
        sendDividendPayoutLogEntry(p, year, calendarMonth, thisInterimDividend)
      }

      if (newShares < 0) {
        console.error('newshares is negative')
        return p
      }

      // do something with the new shares
      // TODO: We need a way of recording the shares minOrderQuantity for individual stocks.
      //       Example: AllianceBernstein
      p.quantity = qty + newShares
      const logEntry = {
        year: year,
        id: uuidv4(),
        month: calendarMonth,
        level: 'success',
        message: `BUY [${newShares.toFixed(6)}] shares of [${p.stock.ticker}] for [${dividendAmount.toFixed(2)}]`
      }
      logEntries.push(logEntry)
      forecastChartData = recordShareBuy(newShares, p, currentPeriod, year, forecastChartData)
      forecastChartData = recordDividend(dividendAmount, p.stock, currentPeriod, year, forecastChartData)

      return p
    } else {
      return p
    }
  })

  // Calculate pie dividends + contribution amount
  Object.keys(pies).forEach(key => {
    const pie = pies[key]
    const pieName = pie.name

    pieContributions.forEach(cont => {
      if (cont.name === pieName) {
        pie.dripValue = pie.dripValue + cont.monthlyContribution
      }
    })

    pie.positions = pie.positions.map((piePosition) => {
      const stock = piePosition.stock

      const dividendMonths = getDividendMonths(stock)
      const interimMonths = getDividendInterimMonths(stock)
      const isDividendMonth = dividendMonths.includes(calendarMonth)
      const isInterimMonth = interimMonths.includes(calendarMonth)

      if (!isDividendMonth && !isInterimMonth) {
        // Is not a dividend month
        return piePosition
      }

      const qty = getPositionQuantity(piePosition)
      const lastDividend = parseCurrency(getLastDividend(piePosition))
      const thisDividend = calculateRealDividend(stock, lastDividend, qty)
      const interimDividend = parseCurrency(getLastInterimDividend(piePosition))
      const thisInterimDividend = calculateRealDividend(stock, interimDividend, qty)
      let dividendAmount = 0

      if (isDividendMonth) { dividendAmount = thisDividend }
      if (isInterimMonth) { dividendAmount = thisInterimDividend }

      forecastChartData = recordDividend(dividendAmount, stock, currentPeriod, year, forecastChartData)

      pie.dripValue = pie.dripValue + dividendAmount
      return piePosition
    })
    pies[key] = pie
  })

  // Calculate the pie share buys
  Object.keys(pies).forEach(key => {
    const pie = pies[key]
    const pieWeights = pie.positions.map((p) => parseFloat(p.pieWeight))
    const minOrderValue = 1.00 / (Math.min(...pieWeights) / 100)

    if (pie.dripValue > minOrderValue) {
      pie.positions = pie.positions.map((piePosition) => {
        // This value is in base currency (gbp)
        let positionWeightedDrip = (pie.dripValue / 100) * parseFloat(piePosition.pieWeight)
        switch (piePosition.stock.currency) {
          case 'USD':
          case 'usd':
            positionWeightedDrip = positionWeightedDrip * rates.gbp.usd
            break
          case 'GBX p':
            positionWeightedDrip = positionWeightedDrip * rates.gbx.gbp
            break
          case 'GBP':
            // No action required
            break
          default:
            console.warn(`currency not handled for ${piePosition.stock.currency}`)
            break
        }
        const newshares = positionWeightedDrip / parseCurrency(piePosition.stock.share_price)
        if (newshares < 0) {
          console.error('newshares is negative')
          return piePosition
        }

        const logEntry = {
          year: year,
          id: uuidv4(),
          month: calendarMonth,
          level: 'success',
          message: `Pie [${key}] BUY [${newshares.toFixed(6)}] shares of [${piePosition.stock.ticker}] for [${positionWeightedDrip.toFixed(2)}]`
        }
        logEntries.push(logEntry)
        forecastChartData = recordShareBuy(newshares, piePosition, currentPeriod, year, forecastChartData)
        piePosition.quantity = parseFloat((getPositionQuantity(piePosition) + newshares).toFixed(6))

        return piePosition
      })

      pie.dripValue = 0
    } else {
      const logEntry = {
        year: year,
        id: uuidv4(),
        month: calendarMonth,
        level: 'warning',
        message: `
          Pie: ${key} not enough dripValue to buy shares,
          dripValue: ${pie.dripValue},
          minOrderValue: ${minOrderValue.toFixed(2)}
        `
      }
      logEntries.push(logEntry)
      pie.positions.map(piePosition => {
        forecastChartData = recordShareBuy(0, piePosition, currentPeriod, year, forecastChartData)
        return piePosition
      })
    }

    pies[key] = pie
  })

  // return the updated positions for the next forecast
  return [
    positions,
    pies,
    forecastChartData,
    logEntries
  ]
}

function generatePieData (positions) {
  const pies = {}
  positions.forEach(p => {
    const pieName = p.pie
    if (pieName !== '') {
      if (!Object.prototype.hasOwnProperty.call(pies, pieName)) {
        pies[pieName] = {
          name: pieName,
          holdings: 0,
          dripValue: 0,
          positions: []
        }
      }
      pies[pieName].holdings = pies[pieName].holdings + 1
      pies[pieName].positions.push(p)
    }
  })

  self.postMessage({
    type: 'pie-data',
    data: pies
  })
  return pies
}

function handlePerformForecast (event) {
  if (isForecasting) { return }
  let positions = event.positions
  const pieContributions = event.pieContributions
  let pies = generatePieData(positions)
  let forecastChartData = {
    oneYear: {
      months: [],
      dividendData: {},
      shareData: {}
    },
    fiveYears: {
      months: [],
      dividendData: {},
      shareData: {}
    },
    tenYears: {
      months: [],
      dividendData: {},
      shareData: {}
    },
    thirtyYears: {
      months: [],
      dividendData: {},
      shareData: {}
    },
    fortyYears: {
      months: [],
      dividendData: {},
      shareData: {}
    }
  }
  if (positions.length === 0) {
    self.postMessage({
      type: 'forecast-results',
      data: JSON.stringify(forecastChartData)
    })
    return
  }

  isForecasting = true

  // Create the empty arrays for share and dividend charts
  positions.forEach((position) => {
    const stock = position.stock
    Object.keys(forecastChartData).forEach(key => {
      const time = forecastChartData[key]
      time.dividendData[stock.name] = []
      time.shareData[stock.name] = []
    })
  })

  let logEntries = []
  const date = new Date()
  let thisMonth = date.getMonth() // april = 3
  const years = config.years
  const timeToForecast = years * 12 // (30 years * 12 months)
  let year = 0
  // Perform the forecasting
  for (let currPeriod = 0; currPeriod < timeToForecast; currPeriod++) {
    if (currPeriod % 12 === 0) {
      year = year + 1
    }
    // calc the month of the period
    thisMonth = thisMonth + 1
    if (thisMonth > 11) {
      thisMonth = 0
    }
    // Perform the forecast
    [positions, pies, forecastChartData, logEntries] = performMonthForecast(thisMonth, currPeriod, year, positions, forecastChartData, logEntries, pies, pieContributions)
    switch (currPeriod) {
      // case 11: // 1 Year
      // case 59: // 5 Years
      // case 119: // 10 Years
      // case 359: // 30 Years
      case 479: // 40 Years
        console.log('sending data for period', currPeriod)
        self.postMessage({
          type: 'forecast-log',
          data: logEntries
        })
        self.postMessage({
          type: 'forecast-results',
          data: JSON.stringify(forecastChartData)
        })
        break
      default:
        break
    }
  }

  isForecasting = false
}
// Add the event listener
self.addEventListener('message', function (e) {
  const event = e.data
  if (event.type === 'perform-forecast') {
    handlePerformForecast(event)
  }
}, false)
