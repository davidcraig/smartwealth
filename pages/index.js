import Head from 'next/head'
// import {  } from '@davidcraig/react'
import Navbar from '../Components/Navbar'

export default function Home() {
  return (
    <div>
      <Head>
        <title>SmartWealth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
    </div>
  )
}
