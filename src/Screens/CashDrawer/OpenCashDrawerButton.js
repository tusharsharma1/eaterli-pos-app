import React from 'react';
import OptionButton from '../components/OptionButton';
import POSModule from '../../helpers/pos.helper';
import useTheme from '../../hooks/useTheme';

export default function OpenCashDrawerButton({type = '1', title = 'Add Cash'}) {
  const themeData=useTheme();
  return (
    <>
      <OptionButton
      color={themeData.textColor}
      backgroundColor={themeData.cardBg}
        title={'Open Drawer'}
        onPress={() => {
          POSModule.doOpenCashBox();
        }}
      />
    </>
  );
}
