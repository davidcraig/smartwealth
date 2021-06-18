import React from 'react'
import NextHighchart from '../NextHighchart'
import GetStockColour from '../../Functions/GetStockColour'
import GetFrequencyByStockName from '../../Functions/Stock/GetFrequencyByStockName'

const themeColour2 = '#494e5c'

const is30Year = (months) => {
  return months.length === 360
}

/**
 * Builds a chart with a single series.
 * @param {*} dividendData Dividend data.
 * @returns Series array.
 */
function buildDataAsSingleSeries (dividendData) {
  const series = []
  const totalData = {
    name: 'Dividends',
    color: '#127905',
    data: []
  }

  Object.keys(dividendData).forEach(company => {
    for (let i = 0; i < 360; i++) {
      const total = totalData.data[i] || 0
      const coValue = dividendData[company][i] || 0
      if (coValue > 0) { totalData.data[i] = total + coValue }
    }
  })

  series.push(totalData)
  return series
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
function buildDataAsFrequencyGrouped (dividendData) {
  const buildZeroValArray = () => {
    const array = []
    for (let i = 0; i < 360; i++) {
      array[i] = 0
    }
    return array
  }

  const freqSeries = {
    monthly: buildZeroValArray(),
    quarterly: buildZeroValArray(),
    annual: buildZeroValArray(),
    biannual: buildZeroValArray(),
    annualinterim: buildZeroValArray(),
    total: buildZeroValArray(),
    sixMonthAverage: buildZeroValArray()
  }

  Object.keys(dividendData).forEach(company => {
    const validFrequencies = [
      'monthly', 'quarterly', 'annual', 'annualinterim'
    ]
    const freq = GetFrequencyByStockName(company)
    if (validFrequencies.includes(freq)) {
      for (let i = 0; i < 360; i++) {
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

  return [
    {
      name: 'Monthly',
      color: '#127905',
      data: freqSeries.monthly,
      type: 'line'
    },
    {
      name: 'Quarterly',
      color: '#00478a',
      data: freqSeries.quarterly,
      type: 'scatter'
    },
    {
      name: 'Annual',
      color: '#8a7100',
      data: freqSeries.annual,
      type: 'spline'
    },
    {
      name: 'Bi-Annual',
      color: '#00758a',
      data: freqSeries.biannual,
      type: 'line'
    },
    {
      name: 'Annual + Interim',
      color: '#8a7100',
      data: freqSeries.annualinterim,
      type: 'spline'
    },
    {
      name: 'Total',
      color: '#8a7100',
      data: freqSeries.total,
      type: 'scatter'
    },
    {
      name: 'Six Month Average',
      color: '#ee611c',
      data: freqSeries.sixMonthAverage,
      type: 'line'
    }
  ]
}

const chartOptions = (dividendData, months) => {
  let series = []
  // We need to create dividendData
  const tickInterval = 100

  if (is30Year(months)) {
    // series = buildDataAsSingleSeries(dividendData)
    series = buildDataAsFrequencyGrouped(dividendData)
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

  if (is30Year(months)) {
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
