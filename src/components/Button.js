import React, {memo} from 'react';
import {Text as TextReact, TouchableOpacity} from 'react-native';
import theme, {getFont} from '../theme';
import Text from './Text';
function ButtonUI({
  regular,
  medium,
  bold,
  semibold,
  light,
  color = 'white',
  size = 16,
  align = 'left',

  lineHeight = undefined,
  backgroundColor = theme.colors.secondaryColor,
  noShadow = false,
  style = {},
  content,
  children,
  pv = 12,
  ph = 15,
  mt = 0,
  mb = 0,
  ml = 0,
  mr = 0,
  width = null,
  height,
  borderRadius = 4,
  ...props
}) {
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
        marginLeft: ml,
        marginRight: mr,
        width: width,
        height:height,
        justifyContent: 'center',
        alignItems: 'center',
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
     {content ?content: <Text
      // backgroundColor={'red'}
        regular={regular}
        medium={medium}
        bold={bold}
        semibold={semibold}
        light={light}
        size={size}
        color={color}
        lineHeight={lineHeight}>
        {children}
      </Text>}
    </TouchableOpacity>
  );
}

const Button = memo(ButtonUI);
export default Button;
