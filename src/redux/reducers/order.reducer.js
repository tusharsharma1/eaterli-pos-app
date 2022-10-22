import baseSlice from '../util';
import initialState from '../util/initialState';

const slice = baseSlice({
  name: 'order',
  initialState: initialState.order,
  reducers: {},
});
export const orderReducer = slice.reducer;
export const actions = slice.actions;
