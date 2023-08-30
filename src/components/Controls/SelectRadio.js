import React, {PureComponent} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../../styles';
import ControlContainer from './ControlContainer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import theme from '../../theme';
class SelectRadio extends PureComponent {
  render() {
    let {
      error,

      containerStyle,
      title = '',
      data,

      value,
      onValueChange,
      disabled,
    } = this.props;
    data = data ? data : [];
    let t = data.length;
    let Root = disabled ? View : TouchableOpacity;
    return (
      <ControlContainer
        title={title}
        containerStyle={[
          containerStyle,
          {
            borderBottomWidth: 0,
          },
        ]}>
        <View style={{}}>
          {data.map((v, i) => {
            let checked = value == v.value;
            return (
              <Root
                onPress={() => {
                  onValueChange && onValueChange(v.value);
                }}
                key={v.value}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: t == i + 1 ? 0 : theme.hp(1),
                }}>
                <MaterialIcons
                  color={
                    disabled
                      ? 'gray'
                      : checked
                      ? theme.colors.secondaryColor
                      : 'gray'
                  }
                  size={theme.hp(2.8)}
                  name={checked ? 'radio-button-on' : 'radio-button-off'}
                />

                <Text
                  style={{
                    flex: 1,
                    fontSize: theme.hp(2.3),
                    fontFamily: theme.fonts.Regular,
                    marginLeft: theme.wp(2),
                  }}>
                  {v.label}
                </Text>
              </Root>
            );
          })}
        </View>

        {error && error != '' ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <></>
        )}
      </ControlContainer>
    );
  }
}

export default SelectRadio;
