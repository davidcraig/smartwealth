import React from 'react'
import NextHighchart from '../../NextHighchart'

const themeColour2 = '#494e5c'

const chartOptions = (dividends) => {
  const months = []
  const series = [
    {
      name: 'Dividends',
      data: []
    }
  ]

  dividends.forEach(dividend => {
    months.push(`${dividend.month} ${dividend.year}`)
    series[0].data.push(parseFloat(dividend.amount))
  })

  // We need to create dividendData
  const tickInterval = 100

  const chartOpts = {
    chart: {
      type: 'line',
      height: 200
    },
    title: {
      text: 'Dividends By Month',
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

  // Final chart data
  return chartOpts
}

const dividendsByMonth = ({ dividends }) => {
  if (dividends) {
    const options = chartOptions(dividends)

    return (
      <NextHighchart
        options={options}
      />
    )
  }

  return null
}

export default dividendsByMonth
