import React, { useState } from 'react';
import Head from 'next/head'
import Navbar from '../Components/Navbar'
import slug from '../Functions/slug'

function stockTable(stocks) {
  return <table className='table is-narrow'>
    <thead>
      <tr>
        <th>Name</th>
        <th>Currency</th>
        <th>Price</th>
        <th>Dividend Frequency</th>
      </tr>
    </thead>
    <tbody>
      {stocks.map(stock => {
        let rowClasses = []
        if (stock.dividend_frequency) { rowClasses.push(slug(stock.dividend_frequency)) }

        return <tr className={rowClasses.join(' ')}>
          <td>{stock.name}</td>
          <td>{stock.currency}</td>
          <td>{stock.share_price}</td>
          <td>{stock.dividend_frequency}</td>
        </tr>
      })}
    </tbody>
  </table>
}

export default function Home({ ...props }) {
  return (
    <div>
      <Head>
        <title>SmartWealth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <div className='content'>
        <div className='container is-fluid'>
          {stockTable(props.stocks)}
        </div>
      </div>

      
    </div>
  )
}
