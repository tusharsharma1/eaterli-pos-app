import React, {memo, PureComponent} from 'react';
import {View} from 'react-native';
import theme from '../../theme';

const ControlContainer = memo(({containerStyle, children}) => {
  return (
    <View
      style={[
        {
          marginBottom: 20,
          //  fontFamily: theme.fonts.Regular,
          //  fontSize: 14,
          borderBottomWidth: 1,
          borderColor: theme.colors.borderColor,
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: 'white',
          // textAlign:'center',
          // justifyContent:'center',
          // height:50,
          borderRadius: 80,
        },
        containerStyle,
      ]}>
      {children}
    </View>
  );
});
export default ControlContainer;
