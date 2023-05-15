import {combineReducers} from '@reduxjs/toolkit';
import initialState from '../util/initialState';
import {appReducer as app} from './app.reducer';
import {orderReducer as order} from './order.reducer';
import {userReducer as user} from './user.reducer';
import {alertReducer as alert} from './alert.reducer';

const reducer = combineReducers({
  app,
  alert,
  user,
  order,
});

let rootReducer = (state, action) => {
  if (action.type == 'reset') {
    state = {
      ...initialState,
      user: {
        ...initialState.user,
        deviceToken: state.user.deviceToken,
      },
    };
  }

  return reducer(state, action);
};

export default rootReducer;
export function resetReduxState() {
  return {type: 'reset'};
}
