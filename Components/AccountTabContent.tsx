import { connect } from "react-redux"
import { useState } from "react"
import { Column, Card } from '@davidcraig/react-bulma'
import { addPie } from "../src/features/accounts/accountsSlice"
import uuid from "../Functions/uuid"

const renderBooleanAsEmoji = (bool) => {
  const emojiTick = '✔️'
  const emojiCross = '❌'
  return bool ? emojiTick : emojiCross
}

const AccountPieCreate = ({ account, dispatch }) => {
  const [name, setName] = useState(null)
  const numPies = account.pies?.length ?? 0
  return (
    <Card title='Create Pie'>
      <div className="flex">
        <label>
          Name: 
          <input type='text' onChange={({ target }) => {
            setName(target.value)
          }} />
        </label>
        <button onClick={() => {
          dispatch(addPie({
            accountId: account.id,
            pie: {
              id: uuid(),
              name,
            }
          }))
        }}>Create Pie</button>
      </div>
      {
        /* If account can have nested pies and we have at least one pie,
           show option to set a pie parent. */
        (numPies > 0) && (account.nestedPiesEnabled) && (
          <p>Parent?</p>
        )
      }
    </Card>
  )
}

const AccountTabContent = ({ account, dispatch }) => {
  const emojiTick = '✔️'
  const emojiCross = '❌'

  return (
    <div className="columns">
      <Column class='is-two-thirds'>
        AccountId: {account.id} - Pies: {renderBooleanAsEmoji(account.piesEnabled)} - Nested Pies: {renderBooleanAsEmoji(account.nestedPiesEnabled)}
        {
          account.piesEnabled && account.pies && account.pies.length > 0 && (
            <div>
              <h3>Pies</h3>
              {
                account.pies.map(pie => {
                  return (
                    <div key={pie.id}>
                      <p>{pie.name}</p>
                    </div>
                  )
                })
              }
            </div>
          )
        }
      </Column>
      <Column>
        {
          account.piesEnabled && (
            <AccountPieCreate
              account={account}
              dispatch={dispatch}
            />
          )
        }
      </Column>
    </div>
  )
}

export default connect()(AccountTabContent)
