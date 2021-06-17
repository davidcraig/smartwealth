import React from 'react'
import NextHighchart from '../NextHighchart'
import GetStockColour from '../../Functions/GetStockColour'

const themeColour2 = '#494e5c'

const chartOptions = (dividendData, months) => {
  const series = []
  // We need to create dividendData
  if (months.length === 360) {
    const totalData = {
      name: 'Dividends',
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
  } else {
    Object.keys(dividendData).forEach(company => {
      series.push({
        name: company,
        color: GetStockColour(company),
        data: dividendData[company]
      })
    })
  }

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
