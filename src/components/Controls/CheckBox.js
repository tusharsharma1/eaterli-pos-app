import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import theme from '../../theme';
import Text from '../Text';
function _CheckBox({onChange,checkIconSize=16,iconMR=10,mb=20, borderRadius=8, size = 26, checked = false, title, style = {},titleProps}) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        onChange && onChange(!checked);
      }}
      style={{
        marginBottom: mb,
        flexDirection: 'row',
        alignItems: 'center',
        ...style,
      }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: borderRadius,
          backgroundColor: checked ? theme.colors.primaryColor : null,
          borderColor: theme.colors.primaryColor,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: iconMR,
        }}>
        {checked && (
          <FontAwesome5
            size={checkIconSize}
            color={'#fff'}
            name="check"
          />
        )}
      </View>
      <Text
        bold
        size={18}
        style={{
          flex: 1,
        }}
        {...titleProps}
        >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
const CheckBox = memo(_CheckBox);
export default CheckBox;
