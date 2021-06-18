import React from 'react'
import NextHighchart from '../../NextHighchart'

const themeColour2 = '#494e5c'

const chartOptions = (contributions) => {
  const months = []
  const series = [
    {
      name: 'Contributions',
      data: []
    }
  ]

  contributions.forEach(contribution => {
    months.push(`${contribution.month} ${contribution.year}`)
    series[0].data.push(parseFloat(contribution.amount))
  })

  const tickInterval = 100

  const chartOpts = {
    chart: {
      type: 'line',
      height: 200
    },
    title: {
      text: 'Contributions By Month',
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
        text: 'Contributions'
      }
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

const contributionsByMonth = ({ contributions }) => {
  if (contributions) {
    const options = chartOptions(contributions)

    return (
      <NextHighchart
        options={options}
      />
    )
  }

  return null
}

export default contributionsByMonth
