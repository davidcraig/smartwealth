import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface StocksState {
  stocks: object[] | []
}

const initialState: StocksState = {
  stocks: [],
}

export const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setStocks: (state, action: PayloadAction<Array<object>>) => {
      state.stocks = action.payload
    }
    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1
    // },
    // decrement: (state) => {
    //   state.value -= 1
    // },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // },
  },
})

// Action creators are generated for each case reducer function
export const { setStocks } = stocksSlice.actions

export default stocksSlice.reducer
