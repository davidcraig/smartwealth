function SmartWealthNavbar () {
  return (
    <div className='flex flex-row justify-between p-2'>
      <a href='/'>SmartWealth</a>
      <div className='flex flex-row gap-2'>
        <a href='/'>Dashboard</a>
        <a href='/screener'>Screener</a>
        <a href='/portfolio'>Portfolio</a>
        <a href='/logging'>Log</a>
        <a href='/goals'>Goals</a>
        <a href='/settings'>Settings</a>
      </div>
    </div>
  )
}

export default SmartWealthNavbar
