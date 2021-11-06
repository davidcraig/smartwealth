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
  const sharesFor1000PerMonth = sharesFor100PerMonth * 10
  const amountFor10PerMonth = sharesFor10PerMonth * GetSharePrice(stock)
  const amountFor100PerMonth = sharesFor100PerMonth * GetSharePrice(stock)
  const amountFor1000PerMonth = amountFor100PerMonth * 10

  return (
    <Card className='is-compact' title='Dividend Information'>
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
