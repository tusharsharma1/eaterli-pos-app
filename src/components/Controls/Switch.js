import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';

import theme from '../../theme';
function _Switch({
  onChange,
  checkedColor = theme.colors.primaryColor,
  uncheckedColor = '#CCCCCC',
  checked = false,
  style = {},
  width = 36,
  height = 16,
}) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        onChange && onChange(!checked);
      }}
      style={{
        width: width,

        borderRadius: height,
        backgroundColor: checked ? checkedColor : uncheckedColor,
        padding: 2,
        alignItems: checked ? 'flex-end' : 'flex-start',
        ...style,
      }}>
      <View
        style={{
          width: height,
          height: height,
          borderRadius: height,
          backgroundColor: '#fff',
        }}></View>
    </TouchableOpacity>
  );
}
const Switch = memo(_Switch);
export default Switch;
