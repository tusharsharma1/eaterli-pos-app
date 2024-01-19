import React, {memo, PureComponent} from 'react';
import {View} from 'react-native';
import theme from '../../theme';
import Text from '../Text';
import useTheme from '../../hooks/useTheme';

const ControlContainer = memo(({containerStyle, round, title, children}) => {
  let themeData = useTheme();
  return (
    <>
      {!!title && (
        <Text color={themeData.textColor} mb={4} bold size={18}>
          {title}
        </Text>
      )}
      <View
        style={[
          {
            marginBottom: 20,
            //  fontFamily: theme.fonts.Regular,
            //  fontSize: 14,
            borderWidth: 1,
            borderColor: themeData.inputBorderColor,
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: themeData.inputBg,
            // textAlign:'center',
            // justifyContent:'center',
            // height:50,
            borderRadius: round ? 80 : 4,
          },
          containerStyle,
        ]}>
        {children}
      </View>
    </>
  );
});
export default ControlContainer;
