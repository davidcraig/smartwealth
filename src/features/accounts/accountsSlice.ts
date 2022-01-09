import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Account {
  id: string;
  name: string;
  piesEnabled: boolean;
  nestedPiesEnabled: boolean;
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
    setAccounts: (state, action: PayloadAction<Array<Account>>) => {
      state.data = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAccounts, addAccount } = accountsSlice.actions

export default accountsSlice.reducer
