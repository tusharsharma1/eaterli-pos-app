import {combineReducers} from '@reduxjs/toolkit';
import initialState from '../util/initialState';
import {appReducer as app} from './app.reducer';
import {orderReducer as order} from './order.reducer';
import {userReducer as user} from './user.reducer';
import {alertReducer as alert} from './alert.reducer';
import {settingReducer as settings} from './settings.reducer';

const reducer = combineReducers({
  app,
  alert,
  user,
  order,
  settings
});

let rootReducer = (state, action) => {
  if (action.type == 'reset') {
    state = {
      ...initialState,
      settings:{
        ...initialState.settings,
        ...state.settings
      },
      user: {
        ...initialState.user,
        deviceToken: state.user.deviceToken,
        deviceId:state.user.deviceId,
      },
    };
  }

  return reducer(state, action);
};

export default rootReducer;
export function resetReduxState() {
  return {type: 'reset'};
}
