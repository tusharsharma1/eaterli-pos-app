import {combineReducers} from '@reduxjs/toolkit';
import initialState from '../util/initialState';
import {appReducer as app} from './app.reducer';
import {orderReducer as order} from './order.reducer';
import {userReducer as user} from './user.reducer';
const reducer = combineReducers({
  app,
  user,
  order,
});

let rootReducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return {
        ...initialState,
        // app: {...initialState.app},
      };
  }

  return reducer(state, action);
};

export default rootReducer;
export function resetReduxState() {
  return {type: 'reset'};
}
