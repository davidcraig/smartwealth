import React, { useState } from 'react';
import Head from 'next/head'
import Navbar from '../Components/Navbar'

function stockTable(stocks) {
  return <table className='table is-narrow'>
    <thead>
      <tr>
        <th>Name</th>
        <th>Currency</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      {stocks.map(stock => {
        return <tr>
          <td>{stock.name}</td>
          <td>{stock.currency}</td>
          <td>{stock.share_price}</td>
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
        {stockTable(props.stocks)}
      </div>

      
    </div>
  )
}
