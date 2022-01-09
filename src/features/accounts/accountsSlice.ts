import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Account {
  id: string;
  name: string;
  piesEnabled: boolean;
  nestedPiesEnabled: boolean;
  pies?: any[];
  positions?: any[];
}

export interface AccountsState {
  data: Account[]
}

const initialState: AccountsState = {
  data: [],
}

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    addAccount: (state, action: PayloadAction<Account>) => {
      state.data = [...state.data, action.payload]
    },
    updateAccount: (state, action: PayloadAction<Account>) => {
    },
    setAccounts: (state, action: PayloadAction<Array<Account>>) => {
      state.data = action.payload
    },
    addPie: (state, action: PayloadAction<any>) => {
      state.data = state.data.map(account => {
        if (account.id === action.payload.accountId) {
          account.pies = [...(account.pies || []), action.payload.pie]
        }
        return account
      })
    },
    updatePie: (state, action: PayloadAction<any>) => {
      state.data = state.data.map(account => {
        if (account.id === action.payload.accountId) {
          account.pies = account.pies.map(pie => {
            if (pie.id === action.payload.pieId) {
              pie = action.payload.pie
            }
            return pie
          })
        }
        return account
      })
    }, // updatePie
  }, // reducers
}) // createSlice

// Action creators are generated for each case reducer function
export const {
  setAccounts,
  addAccount,
  addPie,
  updateAccount,
  updatePie,
} = accountsSlice.actions

export default accountsSlice.reducer
