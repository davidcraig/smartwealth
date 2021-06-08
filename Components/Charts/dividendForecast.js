import React from 'react'
import NextHighchart from '../NextHighchart'

const themeColour2 = '#494e5c'

const chartOptions = (dividendData, months) => {
  // We need to create dividendData
  const series = []
  Object.keys(dividendData).forEach(company => {
    series.push({
      name: company,
      data: dividendData[company],
      borderWidth: 0
    })
  })

  // Final chart data
  return {
    chart: {
      type: 'column'
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
      tickInterval: 100,
      minorTicks: true,
      title: {
        text: 'Dividend'
      }
    },
    plotLines: [{
      color: 'green', // Color value
      dashStyle: 'longdashdot', // Style of the plot line. Default to solid
      value: 2000, // Value of where the line will appear
      width: 1 // Width of the line
    }],
    legend: {
      enabled: false
    },
    plotOptions: {
      column: {
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
