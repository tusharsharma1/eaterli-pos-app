import React from 'react';
import OptionButton from '../components/OptionButton';
import POSModule from '../../helpers/pos.helper';

export default function OpenCashDrawerButton({type = '1', title = 'Add Cash'}) {
  return (
    <>
      <OptionButton
        title={'Open Drawer'}
        onPress={() => {
          POSModule.doOpenCashBox();
        }}
      />
    </>
  );
}
