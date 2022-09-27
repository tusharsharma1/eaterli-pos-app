import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  inProgress: false,
  progressMessage: 'Please wait',
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
      state.progressMessage = action.payload || 'Please wait';
    },
    hideProgress: (state, action) => {
      state.inProgress = false;
      state.progressMessage = 'Please wait';
    },
  },
});
export const appReducer = reducer;
export default {
  ...actions,
  
};
