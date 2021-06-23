import React from 'react'
import { Card } from '@davidcraig/react-bulma'
import StockInterface from '../../types/Stock'
import GetSharePrice from '../../Functions/Stock/GetSharePrice'
import GetAnnualDividendAsGBP from '../../Functions/Stock/GetAnnualDividendAsGBP'
import BaseCurrency from '../../Functions/Formatting/BaseCurrency'

interface DividendCardProps {
  stock: StockInterface
}

function DividendCard ({ stock }: DividendCardProps) {
  const sharesFor10PerMonth = 120 / GetAnnualDividendAsGBP(stock)
  const sharesFor100PerMonth = 1200 / GetAnnualDividendAsGBP(stock)
  const amountFor10PerMonth = sharesFor10PerMonth * GetSharePrice(stock)
  const amountFor100PerMonth = sharesFor100PerMonth * GetSharePrice(stock)

  return (
    <Card className='is-compact' title='Dividend Information'>
      <table className='table is-narrow has-no-borders'>
        <tbody>
          <tr>
            <th>Last Dividend</th>
            <th>Annual Dividend</th>
            <th>Dividend Yield (US)</th>
            <th>Dividend Yield (UK)</th>
          </tr>
          <tr>
            <td>{stock.last_dividend_amount}</td>
            <td>{stock.dividend_return}</td>
            <td>{stock.dividend_yield}</td>
            <td>{stock.currency === 'USD' ? `${(parseFloat(stock.dividend_yield) * 0.85).toFixed(2)}%` : stock.dividend_yield}</td>
          </tr>
          <tr>
            <th>Stocks for £10/mo</th>
            <th>Amount Invested for £10/mo</th>
            <th>Stocks for £100/mo</th>
            <th>Amount Invested for £100/mo</th>
          </tr>
          <tr>
            <td>{(sharesFor10PerMonth).toFixed(4)}</td>
            <td>{BaseCurrency(amountFor10PerMonth)}</td>
            <td>{(sharesFor100PerMonth).toFixed(4)}</td>
            <td>{BaseCurrency(amountFor100PerMonth)}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  )
}

export default DividendCard
