import {useState as _useState} from 'react';

const useState = initalValue => {
  const [state, setState] = _useState(initalValue);

  return {
    value: state,
    set: setState,
  };
};

export default useState;
