import { combineReducers } from '@reduxjs/toolkit'
import {appReducer} from './app.action'
 
 const rootReducer = combineReducers({
    app:appReducer
  })
  
  export default rootReducer