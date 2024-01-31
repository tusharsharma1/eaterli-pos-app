import RNDateTimePicker from '@react-native-community/datetimepicker';
import React, {PureComponent, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styles from '../../styles';
import theme from '../../theme';
import Text from '../Text';
// import {Picker} from '@react-native-community/picker';
import ControlContainer from './ControlContainer';
import moment from 'moment';
import useTheme from '../../hooks/useTheme';

export default function DateTimePicker({
  value,
  error,
  rightComponent,
  text,
  containerStyle,
  minimumDate,
  mode,
  placeholder,
  title = '',
  sm = false,
  onChange,
}) {
  const [showPicker, setShowPicker] = useState();
  const themeData = useTheme();
  const toggleDateTime = () => {
    setShowPicker(!showPicker);
  };
  const _onChange = (e, value) => {
    setShowPicker(false);

    onChange && onChange(value);
  };
  return (
    <ControlContainer
      sm={sm}
      title={title}
      error={error}
      containerStyle={containerStyle}>
      <TouchableOpacity
        onPress={toggleDateTime}
        style={{
          // marginBottom: 10,
          // backgroundColor:'green',
          // borderBottomWidth: 1,
          // borderBottomColor: '#b3b3b3',
          flexDirection: 'row',
          // height: 34,
          width: '100%',
          alignItems: 'center',
        }}>
        {value ? (
          <Text
            style={{
              ...styles.inputText,
              color: themeData.textColor,
              flex: 1,
            }}>
            {moment(value).format(mode === 'time' ? 'hh:mm A' : 'MMM DD, YYYY')}
          </Text>
        ) : (
          <></>
        )}

        {!value ? (
          <Text
            style={{
              ...styles.inputText,

              flex: 1,
              color: 'gray',
            }}>
            {placeholder}
          </Text>
        ) : (
          <></>
        )}

        <FontAwesome5
          name={mode == 'date' ? 'calendar-alt' : 'clock'}
          size={24}
          color={'gray'}
          style={{
            paddingRight: 10,
          }}
        />
      </TouchableOpacity>
      {showPicker && (
        <RNDateTimePicker
          testID="dateTimePicker"
          value={value ? value : new Date()}
          minimumDate={minimumDate}
          mode={mode}
          is24Hour={false}
          display="default"
          onChange={_onChange}
          // textColor="red"
          accentColor={theme.colors.secondaryColor}
        />
      )}
    </ControlContainer>
  );
}
