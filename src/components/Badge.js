import React from 'react';
import {View} from 'react-native';
import Button from './Button';
import Text from './Text';

export default function Badge({
  backgroundColor = '#212121',
  borderRadius = 20,
  color = '#ffffff',
  ml=0,
  mr=0,
  textProps = {},
  style = {},
  children,
}) {
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        borderRadius: borderRadius,
        paddingHorizontal: 10,
        paddingVertical: 2,
        marginLeft:ml,
        marginRight:mr,
        ...style,
      }}>
      <Text color={color} semibold size={12} {...textProps}>
        {children}
      </Text>
    </View>
  );
}
