import React from 'react'
import Card from '../Card'
import StockInterface from '../../types/Stock'
import GetSharePrice, { GetSharePriceAsGBP } from '../../Functions/Stock/GetSharePrice'
import GetAnnualDividendAsGBP from '../../Functions/Stock/GetAnnualDividendAsGBP'
import BaseCurrency from '../../Functions/Formatting/BaseCurrency'

interface DividendCardProps {
  stock: StockInterface
}

function DividendCard ({ stock }: DividendCardProps) {
  const sharesFor10PerMonth = 120 / GetAnnualDividendAsGBP(stock)
  const sharesFor100PerMonth = 1200 / GetAnnualDividendAsGBP(stock)
  const amountFor10PerMonth = sharesFor10PerMonth * GetSharePriceAsGBP(stock)
  const amountFor100PerMonth = sharesFor100PerMonth * GetSharePriceAsGBP(stock)

  return (
    <Card title='Dividend Information'>
      <div className='grid'>
        <div>
          Stocks for £10/mo: {(sharesFor10PerMonth).toFixed(4)}
        </div>
        <div>
          Amount Invested for £10/mo: {BaseCurrency(amountFor10PerMonth)}
        </div>
        <div>
          Stocks for £100/mo: {(sharesFor100PerMonth).toFixed(4)}
        </div>
        <div>
          Amount Invested for £100/mo: {BaseCurrency(amountFor100PerMonth)}
        </div>
      </div>
    </Card>
  )
}

export default DividendCard
