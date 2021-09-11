import React from 'react'
import NextHighchart from '../NextHighchart'
import GetStockColour from '../../Functions/GetStockColour'

const config = {
  themeColour2: '#494e5c',
  chart: {
    defaults: {
      type: 'column'
    },
    grouped: {
      year1: false,
      year5: true,
      year10: true,
      year30: true,
      year40: true
    }
  }
}

const is5Year = (months) => months.length === 59 || months.length === 60
const is10Year = (months) => months.length === 119 || months.length === 120
const is30Year = (months) => months.length === 359 || months.length === 360
const is40Year = (months) => months.length === 479 || months.length === 480

const shouldBeGrouped = (months) => {
  if (is5Year(months)) { return config.chart.grouped }
  if (is10Year(months)) { return config.chart.grouped.year10 }
  if (is30Year(months)) { return config.chart.grouped.year30 }
  if (is40Year(months)) { return config.chart.grouped.year40 }
}

const isLongChart = (months) => { return is30Year(months) || is40Year(months) }

const chartOptions = (shareData, months) => {
  // We need to create dividendData
  const series = []
  let tickInterval = 100
  if (shouldBeGrouped(months)) { tickInterval = 500 }

  if (shouldBeGrouped(months)) {
    const totalData = {
      name: 'Total Shares',
      color: '#00758a',
      data: []
    }

    Object.keys(shareData).forEach(company => {
      for (let i = 0; i < months.length; i++) {
        totalData.data[i] = (totalData.data[i] || 0) + shareData[company][i]
      }
    })

    series.push(totalData)
  } else {
    Object.keys(shareData).forEach(company => {
      series.push({
        name: company,
        color: GetStockColour(company),
        data: shareData[company],
        borderWidth: 0
      })
    })
  }

  // Final chart data
  const chartOpts = {
    chart: {
      styledMode: false,
      type: config.chart.defaults.type,
      height: 250
    },
    title: {
      text: 'Share Quantity Forecast',
      style: {
        display: 'none'
      }
    },
    tooltip: {
      backgroundColor: '#111111',
      pointFormat: "{series.name}<br/>{point.y:.6f}" // eslint-disable-line
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    xAxis: {
      categories: months
    },
    legend: {
      enabled: false
    },
    yAxis: {
      stackLabels: {
        enabled: false
      },
      gridLineColor: config.themeColour2,
      minorGridLineColor: '#2a2d35',
      tickInterval: tickInterval,
      minorTicks: false
    },
    plotOptions: {
      column: {
        allowPointSelect: true,
        borderWidth: 0,
        colors: undefined,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true,
        stacking: 'normal'
      }
    },
    series
  }

  if (shouldBeGrouped(months)) {
    chartOpts.chart.type = 'area'
  }

  return chartOpts
}

const sharesForecast = (forecast) => {
  if (forecast) {
    const options = chartOptions(forecast.shareData, forecast.months)

    return (
      <NextHighchart
        options={options}
      />
    )
  }

  return ''
}

export default sharesForecast
