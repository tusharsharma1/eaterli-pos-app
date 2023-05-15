import {configureStore} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        // ignoredActions: ['alert/set'],
        // // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.onPositivePress'],
        // // Ignore these paths in the state
        ignoredPaths: ['alert.onPositivePress'],
      },
    }).concat([__DEV__ && logger].filter(Boolean)),
  //devTools:true
});
export default store;
