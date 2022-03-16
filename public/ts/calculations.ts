/* global self */
// ts-ignore

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

function uuidv4 (): string {
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

function getStockByTicker (ticker, stocks): Stock | null {
  if (typeof stocks === 'undefined') { return null }
  return stocks.filter((s) => {
    return s.ticker === ticker
  })[0]
}

function getLastDividend (position, stocks): number {
  const stock = getStockByTicker(position.ticker, stocks)
  if (stock === null) {
    console.error('stock is null', position, stocks)
    return 0
  }
  console.log(stock)
  if ('last_dividend amount' in stock) {
    return stock['last_dividend amount']
  }
  if ('last_dividend_amount' in stock) {
    if (typeof stock.last_dividend_amount === 'string') {
      return parseCurrency(stock.last_dividend_amount)
    }
    return stock.last_dividend_amount
  }

  return 0
}

function getLastInterimDividend (position: AccountPiePosition, stocks): number {
  const stock = getStockByTicker(position.ticker, stocks)
  if ('latest_interim amount' in stock) {
    return stock['latest_interim amount']
  }
  if ('latest_interim_amount' in stock) {
    if (typeof stock.latest_interim_amount === 'string') {
      return parseCurrency(stock.latest_interim_amount)
    }
    return stock.latest_interim_amount
  }

  return 0
}

function getPositionQuantity (position: AccountPiePosition): number {
  switch (typeof position.quantity) {
    case 'number':
      return position.quantity
    case undefined:
      return 0
    default:
      console.warn('uncaught typeof', typeof position.quantity)
      return 0
  }
}

function parseCurrency (value: any): number {
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

function calculateRealDividend (stock: Stock, dividendAmount, quantity): number {
  if (quantity === 0 || dividendAmount === 0) {
    return 0
  }
  const currency: string = stock.currency ?? 'usd' // fallback to usd
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

function getDividendMonths (stock: Stock): number[] {
  function cacheResult (stock, result): any {
    cache.dividendMonths[stock.name] = result
    return result
  }
  if (stock.name in cache.dividendMonths) {
    return cache.dividendMonths[stock.name]
  }
  if (stock.dividend_frequency === 'Monthly') {
    return cacheResult(stock, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  }
  if (!('dividend_months' in stock)) {
    return cacheResult(stock, [])
  }
  const monthRegex = /(\[.+\])/
  try {
    const months = stock.dividend_months
      .match(monthRegex)[0]
      .replace('[', '')
      .replace(']', '')
      .split(',')
      .map(n => parseInt(n))
    return cacheResult(stock, months)
  } catch (err) {
    console.debug('Error in getDividendMonths', err)
    return []
  }
}

function getDividendInterimMonths (stock): number[] {
  function cacheResult (stock, result): any {
    cache.dividendInterimMonths[stock.name] = result
    return result
  }
  if (stock.name in cache.dividendInterimMonths) {
    return cache.dividendInterimMonths[stock.name]
  }
  if (
    stock.dividend_frequency === 'Monthly' ||
    stock.dividend_frequency === 'Quarterly'
  ) {
    return cacheResult(stock, [])
  }
  if (!('interim_months' in stock)) {
    return cacheResult(stock, [])
  }
  const monthRegex = /(\[.+\])/
  try {
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

function recordDividend (amount: number, stock, currentPeriod, year, forecastChartData): object {
  if (amount < 0) { console.error('amount is negative') }

  forecastChartData.fortyYears.dividendData[stock.name][currentPeriod] = amount
  if (year < 31) { forecastChartData.thirtyYears.dividendData[stock.name][currentPeriod] = amount }
  if (year < 11) { forecastChartData.tenYears.dividendData[stock.name][currentPeriod] = amount }
  if (year < 6) { forecastChartData.fiveYears.dividendData[stock.name][currentPeriod] = amount }
  if (year < 2) { forecastChartData.oneYear.dividendData[stock.name][currentPeriod] = amount }

  return forecastChartData
}

function recordShareBuy (amount: number, position, currentPeriod, year, forecastChartData, stocks): object {
  if (amount < 0) { console.error('amount is negative') }
  const stock = getStockByTicker(position.ticker, stocks)
  if (stock === null) {
    console.error('stock is null', position.ticker)
    return forecastChartData
  }

  if (
    (currentPeriod in forecastChartData.fortyYears.shareData[stock.name]) &&
    forecastChartData.fortyYears.shareData[stock.name][currentPeriod] > 0
  ) {
    return forecastChartData
  }

  const newQuantity = parseFloat((getPositionQuantity(position) + amount).toFixed(6))

  forecastChartData.fortyYears.shareData[stock.name][currentPeriod] = newQuantity
  if (year < 31) { forecastChartData.thirtyYears.shareData[stock.name][currentPeriod] = newQuantity }
  if (year < 11) { forecastChartData.tenYears.shareData[stock.name][currentPeriod] = newQuantity }
  if (year < 6) { forecastChartData.fiveYears.shareData[stock.name][currentPeriod] = newQuantity }
  if (year < 2) { forecastChartData.oneYear.shareData[stock.name][currentPeriod] = newQuantity }

  return forecastChartData
}

function calculateNewShares (dividendAmount: number, sharePrice: number): number {
  return parseFloat((dividendAmount / parseCurrency(sharePrice)).toFixed(6))
}

interface Stock {
  name: string
  currency: string
  dividend_frequency?: string
  dividend_months?: string
  last_dividend_amount?: number | string
  latest_interim_amount?: number | string
  ticker: string
  share_price?: number | string
}

interface AccountPiePosition {
  ticker: string
  weight: number
  quantity: number
}

interface AccountPie {
  dripValue: number
  id: string
  monthlyContribution: number
  name: string
  positions?: AccountPiePosition[]
}

interface Account {
  id: string
  name: string
  nestedPiesEnabled: boolean
  pies?: AccountPie[]
  piesEnabled: boolean
}

interface IPerformMonthForecastParams {
  thisMonth: number
  currPeriod: number
  year: number
  accounts: Account[]
  forecastChartData: any
  logEntries: any[]
  stocks: any
}

function performMonthForecast ({
  thisMonth,
  currPeriod,
  year,
  accounts = [],
  forecastChartData,
  logEntries = [],
  stocks
}: IPerformMonthForecastParams): any[] {
  const jsMonth = thisMonth
  const currentPeriod = currPeriod
  if (accounts.length === 0) {
    return [
      accounts,
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

  /* TODO : For each accounts pies */
  accounts.forEach(account => {
    const accountPies = account.pies
    // Calculate pie dividends + contribution amount
    Object.keys(accountPies).forEach(key => {
      const pie = accountPies[key] as AccountPie

      if (isNaN(pie.dripValue)) {
        pie.dripValue = 0
      }

      pie.dripValue = (pie.dripValue ?? 0) + (pie.monthlyContribution ?? 0)

      pie.positions = pie.positions.map((piePosition) => {
        const stock: Stock = getStockByTicker(piePosition.ticker, stocks)

        const dividendMonths = getDividendMonths(stock)
        const interimMonths = getDividendInterimMonths(stock)
        const isDividendMonth: boolean = dividendMonths.includes(calendarMonth)
        const isInterimMonth: boolean = interimMonths.includes(calendarMonth)

        console.log('isDivMonth', isDividendMonth)
        console.log('isInterMonth', isInterimMonth)
        if (!isDividendMonth && !isInterimMonth) {
          // Is not a dividend month
          return piePosition
        }

        const qty = getPositionQuantity(piePosition)
        const lastDividend = parseCurrency(getLastDividend(piePosition, stocks))
        const thisDividend = calculateRealDividend(stock, lastDividend, qty)
        const interimDividend = parseCurrency(getLastInterimDividend(piePosition, stocks))
        const thisInterimDividend = calculateRealDividend(stock, interimDividend, qty)
        let dividendAmount = 0

        console.log(lastDividend, 'lastDividend')
        console.log(thisDividend, 'thisDividend')
        console.log(interimDividend, 'interimDividend')

        if (isDividendMonth) { dividendAmount = thisDividend }
        if (isInterimMonth) { dividendAmount = thisInterimDividend }

        forecastChartData = recordDividend(dividendAmount, stock, currentPeriod, year, forecastChartData)

        pie.dripValue = pie.dripValue + dividendAmount
        return piePosition
      })
      accountPies[key] = pie
    })

    // Calculate the pie share buys
    Object.keys(accountPies).forEach(key => {
      const pie = accountPies[key]
      const pieWeights = pie.positions.map((p) => parseFloat(p.weight))
      const minOrderValue = 1.00 / (Math.min(...pieWeights) / 100)

      if (pie.dripValue > minOrderValue) {
        pie.positions = pie.positions.map((piePosition) => {
          const stock = getStockByTicker(piePosition.ticker, stocks)
          if (stock === null) { return piePosition }
          // This value is in base currency (gbp)
          let positionWeightedDrip = (pie.dripValue / 100) * parseFloat(piePosition.weight)
          switch (stock.currency) {
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
              console.warn(`currency not handled for ${stock.currency}`)
              break
          }
          const newshares = positionWeightedDrip / parseCurrency(stock.share_price)
          if (newshares < 0) {
            console.error('newshares is negative')
            return piePosition
          }

          const logEntry = {
            year: year,
            id: uuidv4(),
            month: calendarMonth,
            level: 'success',
            message: `Pie [${key}] BUY [${newshares.toFixed(6)}] shares of [${stock.ticker}] for [${positionWeightedDrip.toFixed(2)}]`
          }
          logEntries.push(logEntry)
          forecastChartData = recordShareBuy(newshares, piePosition, currentPeriod, year, forecastChartData, stocks)
          piePosition.quantity = parseFloat((getPositionQuantity(piePosition) + newshares).toFixed(6))

          return piePosition
        })

        pie.dripValue = 0
      } else {
        const dripValueString: string = pie.dripValue.toString()
        const logEntry = {
          year: year,
          id: uuidv4(),
          month: calendarMonth,
          level: 'warning',
          message: `
            Pie: ${key} not enough dripValue to buy shares,
            dripValue: ${dripValueString},
            minOrderValue: ${minOrderValue.toFixed(2)}
          `
        }
        logEntries.push(logEntry)
        pie.positions.map(piePosition => {
          forecastChartData = recordShareBuy(0, piePosition, currentPeriod, year, forecastChartData, stocks)
          return piePosition
        })
      }

      accountPies[key] = pie
    })

    account.pies = accountPies
  })
  /* END TODO */

  // return the updated positions for the next forecast
  return [
    accounts,
    forecastChartData,
    logEntries
  ]
}

function handlePerformForecast (event): void {
  if (isForecasting) { return }
  console.log('event', event)
  const stocks = event.stocks
  let accounts = event.accounts
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
  if (accounts.length === 0) {
    self.postMessage({
      type: 'forecast-results',
      data: JSON.stringify(forecastChartData)
    })
    return
  }

  isForecasting = true

  // Same as above but for accounts pie positions
  accounts.forEach(account => {
    if (account.pies.length > 0) {
      account.pies.forEach((pie: AccountPie) => {
        pie.dripValue = 0
        if (pie.positions.length > 0) {
          pie.positions.forEach((position) => {
            const stock = getStockByTicker(position.ticker, stocks)
            if (stock === null) { return }
            Object.keys(forecastChartData).forEach(key => {
              const time = forecastChartData[key]
              time.dividendData[stock.name] = []
              time.shareData[stock.name] = []
            })
          })
        }
      })
    }
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
    [accounts, forecastChartData, logEntries] = performMonthForecast({
      thisMonth,
      currPeriod,
      year,
      accounts,
      forecastChartData,
      logEntries,
      stocks
    })
    switch (currPeriod) {
      // case 11: // 1 Year
      // case 59: // 5 Years
      // case 119: // 10 Years
      // case 359: // 30 Years
      case 479: // 40 Years
        console.debug('sending data for period', currPeriod)
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
