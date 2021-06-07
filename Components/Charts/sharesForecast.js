import React from 'react'
import NextHighchart from '../NextHighchart'

// const themeColour1 = '#2e313b'
const themeColour2 = '#494e5c'
// const wowOkColour = '#3292f1'
// const wowEpicColour = '#c56fff'

const chartOptions = (shareData, months) => {
  // We need to create dividendData
  const series = []
  Object.keys(shareData).forEach(company => {
    series.push({
      name: company,
      data: shareData[company],
      borderWidth: 0
    })
  })

  // Final chart data
  return {
    chart: {
      styledMode: false,
      type: 'column'
    },
    title: {
      text: 'Share Quantity Forecast'
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
        stacking: 'normal',
        allowPointSelect: true,
        colors: undefined,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true
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
