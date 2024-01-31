import React, {memo, PureComponent} from 'react';
import {TextInput as _TextInput} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import styles from '../../styles';
import theme from '../../theme';
import Text from '../Text';
import ControlContainer from './ControlContainer';
import useTheme from '../../hooks/useTheme';
function TextInputUI({
  textInputProps = {},

  error,
  rightComponent,
  text,
  containerStyle = {},
  textStyle = {},
  title = '',
  round,
}) {
  let themeData = useTheme();
  return (
    <ControlContainer
      round={round}
      title={title}
      containerStyle={{
        ...containerStyle,

        ...(rightComponent
          ? {
              flexDirection: 'row',
              justifyContent:'center'
            }
          : {}),
      }}>
      {error && error != '' ? (
        <Text size={12} ml={4} align="center" color={theme.colors.errorColor}>
          {error}
        </Text>
      ) : (
        <></>
      )}

      {textInputProps.type ? (
        <TextInputMask
          style={[
            styles.inputText,
            {
              textAlignVertical: 'center',
              textAlign: round ? 'center' : 'left',
              color: themeData.textColor,
              ...textStyle,
              ...(rightComponent
                ? {
                    flex: 1,
                  }
                : {}),
            },
          ]}
          type={'custom'}
          options={{
            mask: '',
          }}
          placeholderTextColor="#BDBDBD"
          {...textInputProps}
        />
      ) : (
        <_TextInput
          style={[
            styles.inputText,
            {
              textAlignVertical: 'center',
              textAlign: round ? 'center' : 'left',
              color: themeData.textColor,
              ...textStyle,
              // backgroundColor:'yellow',
              ...(rightComponent
                ? {
                    flex: 1,
                  }
                : {}),
            },
          ]}
          placeholderTextColor="#BDBDBD"
          {...textInputProps}
        />
      )}
      {rightComponent}
    </ControlContainer>
  );
}
const TextInput = memo(TextInputUI);
export default TextInput;
