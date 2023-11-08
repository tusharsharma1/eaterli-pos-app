import React, {PureComponent} from 'react';
import {ScrollView, Text, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styles from '../../styles';
import theme from '../../theme';

import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import ControlContainer from './ControlContainer';

class Select extends PureComponent {
  render() {
    let {
      title,
      data = [],
      value = '',
      containerStyle,
      placeholder = {value: '', label: ''},
      error,
      onValueChange,
      renderOption,
    } = this.props;

    let _value = (data || []).find(d => d.value == value);
    return (
      <>
        <ControlContainer title={title} containerStyle={[containerStyle, {}]}>
          <Menu onSelect={onValueChange}>
            <MenuTrigger>
              <View
                onPress={this.showMenu}
                style={{
                  zIndex: 2,
                  // backgroundColor: '#FFFFFF',
                  flexDirection: 'row',
                  alignItems: 'center',
                  // borderRadius: 30,
                  // paddingHorizontal: 20,
                  // paddingVertical: 12,
                  // marginHorizontal: theme.paddingHorizontal,
                  // marginBottom: mb,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.8,
                  shadowRadius: 6,

                  elevation: 7,
                }}>
                <Text
                  style={[
                    styles.inputText,
                    {
                      textAlignVertical: 'center',
                      flex: 1,
                      color: _value && _value.label ? '#000' : 'gray',
                      // backgroundColor:'yellow'
                    },
                  ]}>
                  {_value && _value.label ? _value.label : placeholder.label}
                </Text>
                <FontAwesome5 name="caret-down" size={theme.hp(2.2)} />
              </View>
            </MenuTrigger>
            <MenuOptions>
              <ScrollView style={{maxHeight: 200}}>
                {data.map(m => {
                  return (
                    <MenuOption key={m.value} value={m.value}>
                      {renderOption ? (
                        renderOption(m)
                      ) : (
                        <Text style={{color: '#000', fontSize: 20}}>
                          {m.label}
                        </Text>
                      )}
                    </MenuOption>
                  );
                })}
              </ScrollView>
            </MenuOptions>
          </Menu>

          {error && error != '' ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <></>
          )}
        </ControlContainer>
      </>
    );
  }
}

export default Select;
