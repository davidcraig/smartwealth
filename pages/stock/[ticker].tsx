import Head from 'next/head'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import Navbar from '../../Components/Navbar'
import Card from '../../Components/Card'
import StockInterface from '../../types/Stock'
import { GetSharePriceAsGBP, GetSharePriceFormatted } from '../../Functions/Stock/GetSharePrice'
import GetAnnualDividendAsGBP from '../../Functions/Stock/GetAnnualDividendAsGBP'
import DividendCard from '../../Components/Stock/DividendCard'

function displayTimeToReachGoal (months) {
  if (months > 12) {
    return `${Math.floor(months / 12)} years`
  }
  return `${months.toFixed(1)} m`
}

function StockView ({ stocks }) {
  const router = useRouter()
  let { ticker } = router.query
  let tickerSymbol = Array.isArray(ticker) ? ticker[0] : ticker

  let stock: (StockInterface | null) = null
  if (typeof tickerSymbol === 'string' && Array.isArray(stocks)) {
    const matched = stocks.filter((s: StockInterface) => s.ticker.toLowerCase() === tickerSymbol.toLowerCase())
    if (matched.length === 1) {
      stock = matched[0]
    }
  }

  if (!stock) {
    return (
      <>
        <Head>
          <title>Smart Wealth</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <Navbar />

        <main className='p-2'>
          <div className='content'>
            <h1>Stock not found</h1>
          </div>
        </main>
      </>
    )
  }

  const sharePrice = GetSharePriceAsGBP(stock)
  const sharesFor10PerMonth = 120 / GetAnnualDividendAsGBP(stock)
  const sharesFor100PerMonth = 1200 / GetAnnualDividendAsGBP(stock)
  const amountFor100PerMonth = sharesFor100PerMonth * sharePrice
  const amountFor1000PerMonth = amountFor100PerMonth * 10

  return (
    <>
      <Head>
        <title>Smart Wealth</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />

      <main className='p-2'>
        <div className='content'>
          <h1 className='h1'>[{stock.ticker}] {stock.name} - {GetSharePriceFormatted(stock)}</h1>
          <div className='grid'>
            <div className='is-two-thirds'>
              <DividendCard stock={stock} />
            </div>
            <div className='is-one-third'>
              <Card title='Dividend Data'>
                <p>Last Dividend: {stock.last_dividend_amount}</p>
                <p>Dividend Yield: {stock.dividend_yield}</p>
              </Card>
            </div>
          </div>
          <Card title='Time to reach income goals'>
            <table className='table'>
              <thead>
                <tr>
                  <th></th>
                  <th>@1000/Mo</th>
                  <th>@1200/Mo</th>
                  <th>@1300/Mo</th>
                  <th>@1500/Mo</th>
                  <th>@2000/Mo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>£100/Mo</td>
                  <td>{displayTimeToReachGoal(amountFor100PerMonth / 1000)}</td>
                  <td>{displayTimeToReachGoal(amountFor100PerMonth / 1200)}</td>
                  <td>{displayTimeToReachGoal(amountFor100PerMonth / 1300)}</td>
                  <td>{displayTimeToReachGoal(amountFor100PerMonth / 1500)}</td>
                  <td>{displayTimeToReachGoal(amountFor100PerMonth / 2000)}</td>
                </tr>
                <tr>
                  <td>£500/Mo</td>
                  <td>{displayTimeToReachGoal((5 * amountFor100PerMonth) / 1000)}</td>
                  <td>{displayTimeToReachGoal((5 * amountFor100PerMonth) / 1200)}</td>
                  <td>{displayTimeToReachGoal((5 * amountFor100PerMonth) / 1300)}</td>
                  <td>{displayTimeToReachGoal((5 * amountFor100PerMonth) / 1500)}</td>
                  <td>{displayTimeToReachGoal((5 * amountFor100PerMonth) / 2000)}</td>
                </tr>
                <tr>
                  <td>£1000/Mo</td>
                  <td>{displayTimeToReachGoal((10 * amountFor100PerMonth) / 1000)}</td>
                  <td>{displayTimeToReachGoal((10 * amountFor100PerMonth) / 1200)}</td>
                  <td>{displayTimeToReachGoal((10 * amountFor100PerMonth) / 1300)}</td>
                  <td>{displayTimeToReachGoal((10 * amountFor100PerMonth) / 1500)}</td>
                  <td>{displayTimeToReachGoal((10 * amountFor100PerMonth) / 2000)}</td>
                </tr>
                <tr>
                  <td>£1500/Mo</td>
                  <td>{displayTimeToReachGoal((15 * amountFor100PerMonth) / 1000)}</td>
                  <td>{displayTimeToReachGoal((15 * amountFor100PerMonth) / 1200)}</td>
                  <td>{displayTimeToReachGoal((15 * amountFor100PerMonth) / 1300)}</td>
                  <td>{displayTimeToReachGoal((15 * amountFor100PerMonth) / 1500)}</td>
                  <td>{displayTimeToReachGoal((15 * amountFor100PerMonth) / 2000)}</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </main>
    </>
  )
}

const mapStateToProps = state => ({
  stocks: state.stocks.data
})

export default connect(mapStateToProps)(StockView)
