import baseSlice from '../util';
import initialState from '../util/initialState';

const slice = baseSlice({
  name: 'user',
  initialState: initialState.user,
  reducers: {},
});

export const userReducer = slice.reducer;
export const actions = slice.actions;
