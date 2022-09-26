import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import rootReducer from './actions'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([__DEV__ && logger].filter(Boolean)),
//devTools:true
})