import React from 'react';
import {TouchableOpacity} from 'react-native';
import theme from '../../theme';
import Text from '../Text';
import useTheme from '../../hooks/useTheme';
export default function MenuItem({children, onPress, active}) {
  const themeData = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        // borderBottomColor: themeData?.cardBorderColor,
        // borderBottomWidth: 1,
        backgroundColor: active ? theme.colors.primaryColor : undefined,
      }}>
      <Text size={18} semibold color={active ? '#fff' : themeData.textColor}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
