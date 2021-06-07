import GetSectorColour from '../../Functions/GetSectorColour'
import GetStock from '../../Functions/GetStock'
import GetPositionValue from '../../Functions/GetPositionValue'
import Percentage from '../../Functions/Percentage'
import NextHighchart from '../NextHighchart'

export function AsTable ({ positionsHeld, stocks }) {
  if (!positionsHeld || positionsHeld.length === 0) {
    return ''
  }
  const sectors = StocksBySector({ positionsHeld, stocks })

  const sectorStocksTotal = Object.keys(sectors).map(key => {
    return sectors[key]
  }).reduce((prev, curr) => prev + curr)

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
          Object.keys(sectors).map(key => {
            return (
              <tr key={key}>
                <td>{key}</td>
                <td>{sectors[key]}</td>
                <td>{Percentage((sectors[key] / sectorStocksTotal) * 100)}</td>
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
    Object.keys(sectors).forEach(key => {
      const colour = GetSectorColour(key)

      series[0].data.push({
        name: key,
        y: sectors[key],
        color: colour
      })
    })

    // Final chart data
    return {
      chart: {
        styledMode: false,
        type: 'pie'
      },
      title: {
        text: 'Stock Value by Sector'
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

function StocksBySector ({ positionsHeld, stocks }) {
  if (!positionsHeld || positionsHeld.length === 0) {
    return null
  }

  const sectors = {}

  positionsHeld.forEach(pos => {
    const stock = GetStock(pos.stock.ticker, stocks)
    if (!pos.stock) { return null }
    if (!stock) { return null }
    if (!stock.gics_sector) {
      return null
    }
    if (!Object.prototype.hasOwnProperty.call(sectors, stock.gics_sector)) {
      const sector = stock.gics_sector
      sectors[sector] = 0
    }

    const sector = stock.gics_sector
    sectors[sector] = sectors[sector] + GetPositionValue(pos, stock)
  })

  return sectors
}

export default AsPie
