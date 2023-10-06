import React from 'react';
import {View} from 'react-native';
import Button from './Button';
import Text from './Text';

const NumberInput = ({value = 0, onChange}) => {
  const onMinusPress = () => {
    onChange && onChange(parseFloat(value) - 1);
  };

  const onAddPress = () => {
    onChange && onChange(parseFloat(value) + 1);
  };
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
        <Button
          onPress={onMinusPress}
          noShadow
          width={35}
          height={35}
          borderRadius={30}
          lineHeight={28}
          size={24}
          bold
          ph={0}
          pv={0}>
          -
        </Button>
        <Text
          ml={5}
          style={{minWidth: 45}}
          backgroundColor={'#eeeeee67'}
          align="center"
          semibold
          size={18}
          mr={5}>
          {value}
        </Text>
        <Button
          onPress={onAddPress}
          noShadow
          width={35}
          height={35}
          borderRadius={30}
          lineHeight={28}
          size={24}
          bold
          ph={0}
          pv={0}>
          +
        </Button>
      </View>
    </>
  );
};

export default NumberInput;
