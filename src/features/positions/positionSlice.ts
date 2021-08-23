import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PositionsState {
  data: object[] | []
}

const initialState: PositionsState = {
  data: [],
}

export const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    addPosition: (state, action: PayloadAction<Array<object>>) => {

    },
    setPositions: (state, action: PayloadAction<Array<object>>) => {
      state.data = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { addPosition, setPositions } = positionsSlice.actions

export default positionsSlice.reducer
