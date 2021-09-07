import React from 'react'
import NextHighchart from '../NextHighchart'
import GetStockColour from '../../Functions/GetStockColour'

// const themeColour1 = '#2e313b'
const themeColour2 = '#494e5c'
// const wowOkColour = '#3292f1'
// const wowEpicColour = '#c56fff'

const is30Year = (months) => {
  console.log(months.length)
  return months.length === 359 || months.length === 360
}

const is40Year = (months) => {
  return months.length === 479 || months.length === 480
}

const isLongChart = (months) => { return is30Year(months) || is40Year(months) }

const chartOptions = (shareData, months) => {
  // We need to create dividendData
  const series = []
  let tickInterval = 100
  if (isLongChart(months)) { tickInterval = 500 }

  if (isLongChart(months)) {
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
      type: 'column',
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
      gridLineColor: themeColour2,
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

  if (isLongChart(months)) {
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
