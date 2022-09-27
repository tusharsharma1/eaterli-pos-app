import {combineReducers} from '@reduxjs/toolkit';
import {appReducer as app} from './app.action';
import {userReducer as user} from './user.action';

const rootReducer = combineReducers({
  app,
  user,
});

export default rootReducer;
