import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface StocksState {
  data: object[] | []
}

const initialState: StocksState = {
  data: [],
}

export const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setStocks: (state, action: PayloadAction<Array<object>>) => {
      state.data = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setStocks } = stocksSlice.actions

export default stocksSlice.reducer
