import { Navbar, Brand, End, Item } from '@davidcraig/react-bulma'

function SmartWealthNavbar () {
  return (
    <Navbar>
      <Brand title='SmartWealth' />

      <End>
        <Item href='/' title='Dashboard' />
        <Item href='/screener' title='Screener' />
        <Item href='/holdings' title='My Holdings' />
        <Item href='/logging' title='Log' />
        <Item href='/goals' title='Goals' />
        <Item href='/settings' title='Settings' />
      </End>
    </Navbar>
  )
}

export default SmartWealthNavbar
