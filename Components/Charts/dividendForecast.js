import React from 'react'
import NextHighchart from '../NextHighchart'
import GetStockColour from '../../Functions/GetStockColour'
import GetFrequencyByStockName from '../../Functions/Stock/GetFrequencyByStockName'

const themeColour2 = '#494e5c'

const is30Year = (months) => {
  return months.length === 359 || months.length === 360
}

const is40Year = (months) => {
  return months.length === 479 || months.length === 480
}

/**
 * Builds a chart grouped by company name.
 * @param {*} dividendData Dividend data.
 * @returns Series array.
 */
function buildDataAsCompanyGrouped (dividendData) {
  const series = []
  Object.keys(dividendData).forEach(company => {
    series.push({
      name: company,
      color: GetStockColour(company),
      data: dividendData[company]
    })
  })
  return series
}

/**
 * Builds a chart with a complex array of serie by each payout frequency.
 * @param {*} dividendData Dividend data.
 * @returns Series array.
 */
function buildDataAsFrequencyGrouped (dividendData, months) {
  const buildZeroValArray = (months) => {
    const array = []
    for (let i = 0; i < months.length; i++) {
      array[i] = 0
    }
    return array
  }

  const freqSeries = {
    monthly: buildZeroValArray(months),
    quarterly: buildZeroValArray(months),
    annual: buildZeroValArray(months),
    biannual: buildZeroValArray(months),
    annualinterim: buildZeroValArray(months),
    total: buildZeroValArray(months),
    sixMonthAverage: buildZeroValArray(months)
  }

  const validFrequencies = ['monthly', 'quarterly', 'annual', 'annualinterim']

  Object.keys(dividendData).forEach(company => {
    const freq = GetFrequencyByStockName(company)
    if (validFrequencies.includes(freq)) {
      for (let i = 0; i < months.length; i++) {
        const freqTotal = freqSeries[freq][i]
        const coValue = dividendData[company][i] || 0
        if (coValue > 0) { freqSeries[freq][i] = freqTotal + coValue }
        // Create a total to show full dividend amount
        const total = freqSeries.total[i]
        if (coValue > 0) { freqSeries.total[i] = total + coValue }
        // Create a 6 month average
        if (coValue > 0) {
          // sum the last 6 months values
          let mo6avg = (freqSeries.total[i] || 0) +
            (freqSeries.total[i - 1] || 0) +
            (freqSeries.total[i - 2] || 0) +
            (freqSeries.total[i - 3] || 0) +
            (freqSeries.total[i - 4] || 0) +
            (freqSeries.total[i - 5] || 0)
          // divide by six
          mo6avg = mo6avg / 6
          freqSeries.sixMonthAverage[i] = mo6avg
        }
      }
    }
  })

  const returnData = []

  // Monthly
  if (freqSeries.monthly.some(v => v > 0)) {
    returnData.push({
      name: 'Monthly',
      color: '#127905',
      data: freqSeries.monthly,
      type: 'line'
    })
  }

  // Quarterly
  if (freqSeries.quarterly.some(v => v > 0)) {
    returnData.push({
      name: 'Quarterly',
      color: '#00478a',
      data: freqSeries.quarterly,
      type: 'scatter'
    })
  }

  // Annual
  if (freqSeries.annual.some(v => v > 0)) {
    returnData.push({
      name: 'Annual',
      color: '#8a7100',
      data: freqSeries.annual,
      type: 'spline'
    })
  }

  // Bi-Annual
  if (freqSeries.biannual.some(v => v > 0)) {
    returnData.push({
      name: 'Bi-Annual',
      color: '#00758a',
      data: freqSeries.biannual,
      type: 'line'
    })
  }

  // Annual + Interim
  if (freqSeries.annualinterim.some(v => v > 0)) {
    returnData.push({
      name: 'Annual + Interim',
      color: '#8a7100',
      data: freqSeries.annualinterim,
      type: 'spline'
    })
  }

  if (returnData.length > 1) {
    returnData.push({
      name: 'Total',
      color: '#8a7100',
      data: freqSeries.total,
      type: 'scatter'
    })
    returnData.push({
      name: 'Six Month Average',
      color: '#ee611c',
      data: freqSeries.sixMonthAverage,
      type: 'line'
    })
  }

  return returnData
}

const chartOptions = (dividendData, months) => {
  let series = []
  // We need to create dividendData
  const tickInterval = 100

  if (is30Year(months) || is40Year(months)) {
    // series = buildDataAsSingleSeries(dividendData)
    series = buildDataAsFrequencyGrouped(dividendData, months)
  } else {
    series = buildDataAsCompanyGrouped(dividendData)
  }

  const chartOpts = {
    chart: {
      type: 'column',
      height: ((window.innerHeight / 100) * 60)
    },
    title: {
      text: 'Dividends Forecast',
      style: {
        display: 'none'
      }
    },
    xAxis: {
      categories: months
    },
    tooltip: {
      backgroundColor: '#111111',
      pointFormat: "{series.name}<br/>£{point.y:.2f}" // eslint-disable-line
    },
    yAxis: {
      stackLabels: {
        enabled: false
      },
      gridLineColor: themeColour2,
      minorGridLineColor: '#2a2d35',
      tickInterval: tickInterval,
      minorTicks: true,
      title: {
        text: 'Dividends'
      },
      plotLines: [
        {
          color: '#308030', // Color value
          dashStyle: 'longdashdot',
          value: 2000, // Value of where the line will appear
          width: 2 // Width of the line
        },
        {
          color: '#308030', // Color value
          dashStyle: 'longdashdot',
          value: 1500, // Value of where the line will appear
          width: 1 // Width of the line
        },
        {
          color: '#308030', // Color value
          dashStyle: 'longdashdot',
          value: 1000, // Value of where the line will appear
          width: 1 // Width of the line
        },
        {
          color: '#308030', // Color value
          dashStyle: 'longdashdot',
          value: 500, // Value of where the line will appear
          width: 1 // Width of the line
        }
      ]
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        stacking: 'normal',
        dataLabels: {
          enabled: false
        }
      },
      colors: undefined,
      showInLegend: false
    },
    series
  }

  if (is30Year(months) || is40Year(months)) {
    chartOpts.yAxis.tickInterval = 500
    chartOpts.chart.type = 'spline'
    chartOpts.legend.enabled = true
    chartOpts.legend.itemStyle = {
      color: '#717171'
    }
  }

  // Final chart data
  return chartOpts
}

const dividendForecast = (forecast) => {
  if (forecast) {
    const options = chartOptions(forecast.dividendData, forecast.months)

    return (
      <NextHighchart
        options={options}
      />
    )
  }

  return ''
}

export default dividendForecast
