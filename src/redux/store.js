import {configureStore} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([__DEV__ && logger].filter(Boolean)),
  //devTools:true
});
export default store;
