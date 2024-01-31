import baseSlice from '../util';
import initialState from '../util/initialState';

const slice = baseSlice({
  name: 'settings',
  initialState: initialState.settings,
  reducers: {},
});

export const settingReducer = slice.reducer;
export const actions = slice.actions;
