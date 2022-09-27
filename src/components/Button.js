import React, {memo} from 'react';
import {Text as TextReact, TouchableOpacity} from 'react-native';
import theme, {getFont} from '../theme';
import Text from './Text';
const Button = memo(
  ({
    regular,
    medium,
    bold,
    semibold,
    light,
    color = 'white',
    size = 16,
    align = 'left',

    lineHeight = null,
    backgroundColor = theme.colors.secondaryColor,
    noShadow = false,
    style = {},
    children,
    pv = 12,
    ph = 15,
    mt = 0,
    mb = 0,
    width = null,
    borderRadius = 25,
    ...props
  }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        // onPress={item.onPress}
        style={{
          backgroundColor: backgroundColor,
          paddingVertical: pv,
          paddingHorizontal: ph,
          borderRadius: borderRadius,
          marginTop: mt,
          marginBottom: mb,
          width: width,
          justifyContent: 'center',
          alignItems:'center',
          ...(!noShadow
            ? {
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 1,
                shadowRadius: 6,

                elevation: 5,
              }
            : {}),

          ...style,
        }}
        {...props}>
        <Text
          regular={regular}
          medium={medium}
          bold={bold}
          semibold={semibold}
          light={light}
          size={size}
          color={color}
          lineHeight={lineHeight}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  },
);

export default Button;
