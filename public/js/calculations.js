'use strict'
// Handles: { type: 'perform-forecast', positions }
// Messages out: forecast-log-entry, forecast-results
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const cache = {
  dividendMonths: {},
  dividendInterimMonths: {}
}

function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

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

function parseCurrency (value) {
  if (!value) {
    return 0
  }
  switch (typeof value) {
    case 'number':
      return value
      break
    case 'string':
      return parseFloat(value.replace('$', ''))
  }
}

function calculateRealDividend(stock, dividendAmount) {
  const currency = stock.currency
  if (isNaN(dividendAmount)) {
    console.log(`warning: stock ${stock} dividendAmount: ${dividendAmount}`);
  }
  switch (currency) {
    case 'USD':
      // Dividend amount * 0.85 (15% witholding)
      dividendAmount = dividendAmount * rates.usWithholding;
      dividendAmount = dividendAmount * rates.usd.gbp;
      break
    case 'GBX p':
      dividendAmount = dividendAmount * rates.gbx.gbp;
      break
    case 'GBP':
      break
    default:
      console.log(`unhandled case for currency: ${currency}`);
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
  }
  catch (err) {
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
function recordDividend(amount, stock, currentPeriod, year, forecastChartData) {
  let dividendData
  if (year < 2) {
    dividendData = forecastChartData.oneYear.dividendData[stock.name]
    dividendData[currentPeriod] = amount
  }
  if (year < 6) {
    dividendData = forecastChartData.fiveYears.dividendData[stock.name]
    dividendData[currentPeriod] = amount
  }
  if (year < 11) {
    dividendData = forecastChartData.tenYears.dividendData[stock.name]
    dividendData[currentPeriod] = amount
  }
  dividendData = forecastChartData.thirtyYears.dividendData[stock.name]
  dividendData[currentPeriod] = amount
  return forecastChartData
}
function recordShareBuy (amount, position, currentPeriod, year, forecastChartData) {
    let stockData
    if (year < 2) {
        stockData = forecastChartData.oneYear.shareData[position.stock.name]
        stockData[currentPeriod] = position.quantity + amount
    }
    if (year < 6) {
        stockData = forecastChartData.fiveYears.shareData[position.stock.name]
        stockData[currentPeriod] = position.quantity + amount
    }
    if (year < 11) {
        stockData = forecastChartData.tenYears.shareData[position.stock.name]
        stockData[currentPeriod] = position.quantity + amount
    }
    stockData = forecastChartData.thirtyYears.shareData[position.stock.name]
    stockData[currentPeriod] = position.quantity + amount
    return forecastChartData
}

function performMonthForecast (jsMonth, currentPeriod, year, positions, forecastChartData, logEntries = [], pies = {}, pieContributions = []) {
  const calendarMonth = jsMonth + 1
  if (!positions || positions.length === 0) {
      return
  }
  const categoryName = `(${year}) ${MONTHS[jsMonth]}`;
  // Create all the months
  if (year < 2) {
      forecastChartData.oneYear.months.push(categoryName);
  }
  if (year < 6) {
      forecastChartData.fiveYears.months.push(categoryName);
  }
  if (year < 11) {
      forecastChartData.tenYears.months.push(categoryName);
  }
  forecastChartData.thirtyYears.months.push(categoryName);
  // Perform the forecasting
  positions.forEach(p => {
      // Post a message to say which stock we are forecasting
      const lastDividend = parseCurrency(p.stock["last_dividend amount"]) || 0;
      const thisDividend = calculateRealDividend(p.stock, lastDividend * p.quantity) || 0;
      const interimDividend = parseCurrency(p.stock["latest_interim amount"]) || 0;
      const thisInterimDividend = calculateRealDividend(p.stock, interimDividend * p.quantity) || 0;
      const currency = p.stock.currency;
      let dividendMonths = getDividendMonths(p.stock);
      let interimMonths = getDividendInterimMonths(p.stock);
      if (interimMonths.includes(calendarMonth)) {
          // Log out all the items in the state of the position
          const logEntry = {
              year: year,
              id: uuidv4(),
              level: 'success',
              month: calendarMonth,
              message: `
      Stock: ${p.stock.name}
      Current Shares: ${p.quantity}
      Last Dividend: ${lastDividend}
      This Dividend: ${thisInterimDividend}
      Pie?: ${p.pie || 'individual'}
      `
          };
          logEntries.push(logEntry);
          if (p.pie === '') {
              // If is individual stock then lets calculate new position after drip
              // TODO: We need a way of recording the shares minOrderQuantity for individual stocks.
              //       Example: AllianceBernstein
              // @ts-ignore
              let newshares = thisInterimDividend / parseCurrency(p.stock.share_price);
              // @ts-ignore
              p.quantity = parseFloat(p.quantity) + newshares;
              const logEntry = {
                  year: year,
                  id: uuidv4(),
                  month: calendarMonth,
                  level: 'success',
                  message: `
        BUY [${newshares.toFixed(6)}] shares of [${p.stock.ticker}] for [${thisInterimDividend.toFixed(2)}]
        `
              };
              logEntries.push(logEntry);
              forecastChartData = recordShareBuy(newshares, p, currentPeriod, year, forecastChartData);
              forecastChartData = recordDividend(thisInterimDividend, p.stock, currentPeriod, year, forecastChartData);
          }
          else {
              const pieName = p.pie;
              // @ts-ignore
              pies[pieName].dripValue = pies[pieName].dripValue + thisDividend;
              forecastChartData = recordDividend(thisInterimDividend, p.stock, currentPeriod, year, forecastChartData);
          }
      }
      else if (dividendMonths.includes(calendarMonth)) {
          // Log out all the items in the state of the position
          const logEntry = {
              year: year,
              id: uuidv4(),
              level: 'success',
              month: calendarMonth,
              message: `
      Stock: ${p.stock.name}
      Current Shares: ${p.quantity}
      Last Dividend: ${lastDividend}
      This Dividend: ${thisDividend}
      Pie?: ${p.pie || 'individual'}
      `
          };
          logEntries.push(logEntry);
          if (p.pie === '') {
              // If is individual stock then lets calculate new position after drip
              // TODO: We need a way of recording the shares minOrderQuantity for individual stocks.
              //       Example: AllianceBernstein
              // @ts-ignore
              let newshares = thisDividend / parseCurrency(p.stock.share_price);
              p.quantity = parseFloat(p.quantity.toString()) + newshares;
              const logEntry = {
                  year: year,
                  id: uuidv4(),
                  month: calendarMonth,
                  level: 'success',
                  message: `
        BUY [${newshares.toFixed(6)}] shares of [${p.stock.ticker}] for [${thisDividend.toFixed(2)}]
        `
              };
              logEntries.push(logEntry);
              forecastChartData = recordShareBuy(newshares, p, currentPeriod, year, forecastChartData);
              forecastChartData = recordDividend(thisDividend, p.stock, currentPeriod, year, forecastChartData);
          }
          else {
              const pieName = p.pie;
              // @ts-ignore
              pies[pieName].dripValue = pies[pieName].dripValue + thisDividend;
              forecastChartData = recordDividend(thisDividend, p.stock, currentPeriod, year, forecastChartData);
          }
      }
      else {
          // Is not a dividend month
          forecastChartData = recordDividend(0, p.stock, currentPeriod, year, forecastChartData);
          forecastChartData = recordShareBuy(0, p, currentPeriod, year, forecastChartData);
      }
  });
  // Calculate the pie drip
  Object.keys(pies).forEach(key => {
      // @ts-ignore
      const pie = pies[key];
      // @ts-ignore
      const pieWeights = pie.positions.map(p => parseFloat(p.pieWeight));
      let minOrderValue = 1.00 / (Math.min(...pieWeights) / 100);
      if (key == 'High Yield 8') {
          console.log('currentPeriod', currentPeriod);
          console.log('dripValue', pie.dripValue);
      }
      pieContributions.forEach(cont => {
          // @ts-ignore
          if (cont.name === pie.name) {
              // @ts-ignore
              pie.dripValue = pie.dripValue + cont.monthlyContribution;
          }
      });
      if (pie.dripValue > minOrderValue) {
          pie.positions.map((piePosition) => {
              // This value is in base currency (gbp)
              // @ts-ignore
              let positionWeightedDrip = (pie.dripValue / 100) * parseFloat(piePosition.pieWeight);
              switch (piePosition.stock.currency) {
                  case 'USD':
                  case 'usd':
                      positionWeightedDrip = positionWeightedDrip * rates.gbp.usd;
                      break;
                  case 'GBX p':
                      positionWeightedDrip = positionWeightedDrip * rates.gbx.gbp;
                  default:
                      break;
              }
              positions.forEach(position => {
                  // @ts-ignore
                  let newshares = positionWeightedDrip / parseCurrency(position.stock.share_price);
                  if (position.stock.ticker === piePosition.stock.ticker) {
                      position.quantity = parseFloat(position.quantity.toString()) + newshares;
                      piePosition.quantity = position.quantity;
                      const logEntry = {
                          year: year,
                          id: uuidv4(),
                          month: calendarMonth,
                          level: 'success',
                          message: `
            Pie [${key}] BUY [${newshares.toFixed(6)}] shares of [${position.stock.ticker}] for [${positionWeightedDrip.toFixed(2)}]
            `
                      };
                      logEntries.push(logEntry);
                      forecastChartData = recordShareBuy(newshares, position, currentPeriod, year, forecastChartData);
                  }
              });
          });
          // Remove drip values
          pie.dripValue = 0;
      }
      else {
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
          };
          logEntries.push(logEntry);
      }
  })
  // return the updated positions for the next forecast
  return [
      positions,
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
        // @ts-ignore
        pies[pieName] = {
          name: pieName,
          holdings: 0,
          dripValue: 0,
          positions: []
        }
      }
      // @ts-ignore
      pies[pieName].holdings = pies[pieName].holdings + 1
      // @ts-ignore
      pies[pieName].positions.push(p)
    }
  })
  // @ts-ignore
  self.postMessage({
    type: 'pie-data',
    data: pies
  })
  return pies
}

function handlePerformForecast(event) {
  let positions = event.positions;
  let pieContributions = event.pieContributions;
  const pies = generatePieData(positions);
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
      }
  };
  if (positions.length === 0) {
      // @ts-ignore
      self.postMessage({
          type: 'forecast-results',
          data: JSON.stringify(forecastChartData)
      });
      return;
  }
  // Create the empty arrays for share and dividend charts
  positions.forEach((position) => {
      const stock = position.stock;
      Object.keys(forecastChartData).map(key => {
          // @ts-ignore
          const time = forecastChartData[key]
          time.dividendData[stock.name] = []
          time.shareData[stock.name] = []
      })
  })

  let logEntries = [];
  const date = new Date();
  let thisMonth = date.getMonth() // april = 3
  const years = 30
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
    [positions, forecastChartData, logEntries] = performMonthForecast(thisMonth, currPeriod, year, positions, forecastChartData, logEntries, pies, pieContributions);
    switch (currPeriod) {
      case 12:
      case 60:
      case 120:
      case 359:
        console.log(`posting results for ${currPeriod}`)
        // @ts-ignore
        self.postMessage({
          type: 'forecast-log',
          data: logEntries
        })
        // @ts-ignore
        self.postMessage({
          type: 'forecast-results',
          data: JSON.stringify(forecastChartData)
        })
        break
      default:
        break
    }
  }
}
// Add the event listener
self.addEventListener('message', function (e) {
  const event = e.data
  if (event.type === 'perform-forecast') {
    handlePerformForecast(event)
  }
}, false)
