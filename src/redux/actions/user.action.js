import {createSlice} from '@reduxjs/toolkit';
import {apiErrorHandler, apiMessageHandler} from '../../helpers/app.helpers';
import userService from '../../services/user.service';
import appAction from './app.action';

const initialState = {
  deviceToken: 'eee',
  userData: null,
};

const {actions, reducer} = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set: (state, action) => {
      return {...state, ...action.payload};
    },
  },
});
export const userReducer = reducer;
export default {
  ...actions,

  login(data, showProgress = true, showAlert = true) {
    return (dispatch, getState) => {
      showProgress && dispatch(appAction.showProgress());
      return userService
        .login({
          ...data,
          device_token: getState().user.deviceToken,
        })
        .then(res => {
          let returnResult = res;
          if (res && !res.status) {
            showAlert && apiMessageHandler(res);
            returnResult = false;
          }
          if (returnResult) {
            let data = res.data;
            dispatch(actions.set({userData: data}));
          }
          showProgress && dispatch(appAction.hideProgress());
          return returnResult;
        })
        .catch(apiErrorHandler);
    };
  },

  // setAsync(payload) {
  //   return dispatch => {
  //     return sleep(1000).then(data => {
  //       dispatch(actions.set(payload));
  //       return data;
  //     });
  //   };
  // },
};
