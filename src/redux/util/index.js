import {createSlice} from '@reduxjs/toolkit';

const baseSlice = options => {
  return createSlice({
    ...options,
    reducers: {
      set: (state, action) => {
        let {_prop, _subprop, values} = action.payload;
        if (_prop) {
          if (_subprop) {
            state[_prop][_subprop] = {...state[_prop][_subprop], ...values};
          } else {
            state[_prop] = {...state[_prop], ...values};
          }
        } else {
          return {...state, ...action.payload};
        }
      },

      ...options.reducers,
    },
  });
};

export default baseSlice;
