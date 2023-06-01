import React, {memo, PureComponent} from 'react';
import {View} from 'react-native';
import theme from '../../theme';
import Text from '../Text';

const ControlContainer = memo(({containerStyle,round, title, children}) => {
  return (
    <>
      {!!title && <Text mb={10} bold size={18}>{title}</Text>}
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
            borderRadius: round?80:5,
          },
          containerStyle,
        ]}>
        {children}
      </View>
    </>
  );
});
export default ControlContainer;
