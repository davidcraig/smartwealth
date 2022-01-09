import { connect } from "react-redux"
import { Columns, Column, Card, TabbedContent } from '@davidcraig/react-bulma'
import React, { useState } from "react"
import { addAccount } from "../src/features/accounts/accountsSlice"
import uuid from "../Functions/uuid"

const AccountCreationWidget = ({ dispatch }) => {
  const [name, setName] = useState(null)
  const [pies, setPies] = useState(false)
  const [nestedPies, setNestedPies] = useState(false)

  const createAccount = () => {
    // Clear form for new account creation
    setName('')
    setPies(false)
    setNestedPies(false)
    dispatch(addAccount({
      name,
      id: uuid(),
      piesEnabled: pies,
      nestedPiesEnabled: nestedPies
    }))
  }

  return (
    <Card title='Create Account'>
      <section>
        <label>
          Account Name
          <input type='text' placeholder='Account Name' onChange={({target}) => {
            setName(target.value)
          }} />
          
        </label>
      </section>
      <section>
        Features:
        <div className='flex'>
          <label>
            <input
              type='checkbox'
              checked={pies}
              onChange={() => {
                setPies(!pies)
              }}
            />
            Pies
          </label>
          {pies && (
            <label>
              <input
                type='checkbox'
                checked={nestedPies}
                onChange={() => {
                  setNestedPies(!nestedPies)
                }}
              />
              Nested Pies
            </label>
          )}
        </div>
      </section>

      <h2>Debug</h2>
      <div>
        <p>Name: {name}</p>
        <p>{pies ? 'Pies enabled': 'Pies disabled'}</p>
        <p>{nestedPies ? 'Nested pies enabled': 'Nested pies disabled'}</p>
      </div>

      <button onClick={createAccount}>Create Account</button>
    </Card>
  )
}

const mapStateToProps = state => ({
  stocks: state.stocks.data
})

export default connect(mapStateToProps)(AccountCreationWidget)
