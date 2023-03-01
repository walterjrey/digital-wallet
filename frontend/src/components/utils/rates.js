import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    update: (state) => {
        state.value += 1
    },
  },
})

export const { update } = counterSlice.actions

export default counterSlice.reducer