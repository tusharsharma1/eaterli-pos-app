import baseSlice from '../util';

import initialState from '../util/initialState';

const slice = baseSlice({
  name: 'app',
  initialState: initialState.app,
  reducers: {
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
export const appReducer = slice.reducer;
export const actions = slice.actions;
