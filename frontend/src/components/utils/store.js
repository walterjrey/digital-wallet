import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './rates'

export default configureStore({
  reducer: counterSlice,
})