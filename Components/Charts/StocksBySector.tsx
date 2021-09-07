import GetSectorColour from '../../Functions/GetSectorColour'
import GetStock from '../../Functions/GetStock'
import AsPercentage from '../../Functions/Formatting/AsPercentage'
import NextHighchart from '../NextHighchart'

export function AsTable ({ positionsHeld, stocks }) {
  if (!positionsHeld || positionsHeld.length === 0) {
    return ''
  }
  const sectors = StocksBySector({ positionsHeld, stocks })

  const sectorStocksTotal = sectors.map(sector => {
    return sector.count
  }).reduce((prev, curr) => (prev || 0) + (curr || 0))

  return (
    <table className='table is-narrow'>
      <thead>
        <tr>
          <th>Sector</th>
          <th># Stocks</th>
          <th>%</th>
        </tr>
      </thead>
      <tbody>
        {
          sectors.map(sector => {
            return (
              <tr key={sector.name}>
                <td>{sector.name}</td>
                <td>{sector.count}</td>
                <td>{AsPercentage((sector.count / sectorStocksTotal) * 100)}</td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}

export function AsPie ({ positionsHeld, stocks }) {
  if (!positionsHeld || positionsHeld.length === 0) {
    return ''
  }
  const sectors = StocksBySector({ positionsHeld, stocks })

  const chartOptions = (sectors) => {
    // We need to create dividendData
    const series = [
      {
        name: 'Stocks by Sector',
        data: [],
        colorByPoint: true
      }
    ]
    sectors.forEach(sector => {
      const colour = GetSectorColour(sector.name)

      series[0].data.push({
        name: sector.name,
        y: sector.count,
        color: colour
      })
    })

    // Final chart data
    return {
      chart: {
        styledMode: false,
        type: 'pie',
        height: '225px'
      },
      title: {
        style: {
          display: 'none'
        }
      },
      tooltip: {
        backgroundColor: '#111111',
        pointFormat: "{series.name}<br/>{point.y}" // eslint-disable-line
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          borderColor: '#383838',
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: false
        }
      },
      series
    }
  }

  const options = chartOptions(sectors)

  return (
    <NextHighchart
      options={options}
    />
  )
}

function StocksBySector ({ positionsHeld, stocks }): object {
  if (!positionsHeld || positionsHeld.length === 0) {
    return null
  }

  const sectors = {}
  const arr = []

  positionsHeld.forEach(pos => {
    const stock = GetStock(pos.stock.ticker, stocks)
    if (!pos.stock) { return null }
    if (!stock) { return null }
    if (!stock.gics_sector) {
      sectors.unknown = sectors.unknown + 1
      return null
    }
    if (!Object.prototype.hasOwnProperty.call(sectors, stock.gics_sector)) {
      const sector = stock.gics_sector
      sectors[sector] = 0
    }

    const sector = stock.gics_sector
    sectors[sector] = sectors[sector] + 1
  })

  Object.keys(sectors).forEach(key => {
    const sector = sectors[key]
    arr.push({ name: key, count: sector })
  })

  return arr.sort((a, b) => {
    return b.count - a.count
  })
}

export default AsPie
