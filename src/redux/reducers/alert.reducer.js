import baseSlice from '../util';

import initialState from '../util/initialState';

const slice = baseSlice({
  name: 'alert',
  initialState: initialState.alert,
  reducers: {
    hideAlert: (state, action) => {
      return {...initialState.alert};
    },
  },
});
export const alertReducer = slice.reducer;
export const actions = slice.actions;
