import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  inProgress: false,
  progressMessage: 'Loading',
};

const {actions, reducer} = createSlice({
  name: 'app',
  initialState,
  reducers: {
    set: (state, action) => {
      return {...state, ...action.payload};
    },
    showProgress: (state, action) => {
      state.inProgress = true;
      state.progressMessage = action.payload || 'Loading';
    },
    hideProgress: (state, action) => {
      state.inProgress = false;
      state.progressMessage = 'Loading';
    },
  },
});
export const appReducer = reducer;
export default {
  ...actions,
  // setAsync(payload) {
  //   return dispatch => {
  //     return sleep(1000).then(data => {
  //       dispatch(actions.set(payload));
  //       return data;
  //     });
  //   };
  // },
};
