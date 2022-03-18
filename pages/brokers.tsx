import React from 'react'
import Head from 'next/head'
import Navbar from '../Components/Navbar'

const brokerData = {
  trading212: {
    pros: [
      'Pies',
      'No commision (ISA)',
      'No account fees'
    ],
    cons: [
      'No nested pies',
      'Lack of effective communication to customers.'
    ]
  },
  freetrade: {
    pros: [],
    cons: []
  },
  investengine: {
    pros: [],
    cons: []
  },
  orca: {
    pros: [],
    cons: []
  },
  interactivebrokers: {
    pros: [],
    cons: []
  },
  stake: {
    pros: [],
    cons: []
  }
}

function ExternalLink({ url, text }) {
  return (
    <a href={url} target='_blank' rel='noopener noreferrer'>
      {text}
    </a>
  )
}

export function Brokers (): React.FunctionComponentElement<{}> {
  return (
    <div>
      <Head>
        <title>SmartWealth | Brokers</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar />
      <div className='container is-fluid page-goals'>
        <div className='content'>
          <h1>Brokers</h1>

          <h2>Listing</h2>
          <table>
            <thead>
              <tr>
                <th>Broker</th>
                <th>ISA</th>
                <th>Pies</th>
                <th>Nested Pies</th>
                <th>Web</th>
                <th>Mobile App</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Trading 212</td>
                <td>✔️</td>
                <td>✔️</td>
                <td>❌</td>
                <td>✔️</td>
                <td>✔️</td>
              </tr>
              <tr>
                <td>InvestEngine</td>
                <td>✔️</td>
                <td>✔️</td>
                <td>❌</td>
                <td>✔️</td>
                <td>✔️</td>
              </tr>
              <tr>
                <td>FreeTrade</td>
                <td>✔️*</td>
                <td>❌</td>
                <td>❌</td>
                <td>❌</td>
                <td>✔️</td>
              </tr>
              <tr>
                <td>Vanguard</td>
                <td>✔️*</td>
                <td>❌</td>
                <td>❌</td>
                <td>✔️</td>
                <td>❌</td>
              </tr>
              <tr>
                <td><ExternalLink url='https://orca.app/' text='Orca' /></td>
                <td>✔️</td>
                <td>❌</td>
                <td>❌</td>
                <td>❌</td>
                <td>✔️</td>
              </tr>
              <tr>
                <td>InteractiveBrokers</td>
                <td>✔️</td>
                <td>❌</td>
                <td>❌</td>
                <td>✔️</td>
                <td>✔️</td>
              </tr>
            </tbody>
          </table>

          <h2>Reviews</h2>
          <h3>Trading 212</h3>
          <h3>InvestEngine</h3>
          <ExternalLink url='https://investengine.com/?utm_medium=share&utm_source=growsurf&grsf=wzfinq' text='Referral Link' />
          <h3>FreeTrade</h3>
          <h3>Orca</h3>
          <ExternalLink url='https://orca.app/rBD6SJ' text='Referral Link' />
          <h3>InteractiveBrokers</h3>
        </div>
      </div>
    </div>
  )
}

export default Brokers
