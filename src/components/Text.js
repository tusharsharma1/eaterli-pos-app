import React, {memo} from 'react';
import {Text as TextReact} from 'react-native';
import {getFont} from '../theme';
function TextUI({
  regular,
  medium,
  bold,
  semibold,
  light,
  size = 14,
  align = 'left',
  mb = 0,
  ml = 0,
  mr = 0,
  mt = 0,
  color = '#212121',
  lineHeight = null,
  backgroundColor = null,
  style = {},
  children,
  ...props
}) {
  return (
    <TextReact
   
      style={{
        textAlign: align,
        fontFamily: getFont({regular, medium, bold, semibold, light}),
        color: color,
        fontSize: size,
        lineHeight: lineHeight,
        marginBottom: mb,
        marginTop: mt,
        marginLeft: ml,
        marginRight: mr,
        backgroundColor: backgroundColor,
        ...style,
      }}
      {...props}>
      {children}
    </TextReact>
  );
}
const Text = memo(TextUI);
export default Text;
