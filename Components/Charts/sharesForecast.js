import React from 'react'
import NextHighchart from '../NextHighchart'
import GetStockColour from '../../Functions/GetStockColour'

// const themeColour1 = '#2e313b'
const themeColour2 = '#494e5c'
// const wowOkColour = '#3292f1'
// const wowEpicColour = '#c56fff'

const chartOptions = (shareData, months) => {
  // We need to create dividendData
  const series = []

  if (months.length === 360) {
    const totalData = {
      name: 'Total Shares',
      data: []
    }

    Object.keys(shareData).forEach(company => {
      for (let i = 0; i < 360; i++) {
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
  return {
    chart: {
      styledMode: false,
      type: 'column'
    },
    title: {
      text: 'Share Quantity Forecast',
      style: {
        display: 'none'
      }
    },
    tooltip: {
      backgroundColor: '#111111',
      pointFormat: "{series.name}<br/>{point.y:.6f}"
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
      tickInterval: 50,
      minorTicks: true
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
