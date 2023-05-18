import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Text from './Text';
import {getPercentValue} from '../helpers/app.helpers';
import theme from '../theme';

export default function CalculatorPriceInput({
  size = 240,
  padding = 1,
  itemMargin = 1,
  onChange
}) {
  const [value, setValue] = useState('');
  const [decimalPlace, setDecimalPlace] = useState(1);

useEffect(()=>{
  onChange && onChange(getPrice(),value)
},[value])

  const onNumberPress = data => {
    let _val = `${value}${data}`;
    setValue(_val);
  };
  const onDecimalPress = data => {
    setDecimalPlace(data);
  };
  const resetPress = () => {
    setValue('');
  };
  const getPrice = () => {
    let _val = parseFloat(value || 0) / 100;
    return _val;

    // let _val = parseFloat(value);
    // let l = _val.toString().length - decimalPlace;
    // let d = Math.pow(10, l);
    // return _val / d;
  };
  let itemSize = (size - padding * 2) / 4;
  itemSize = itemSize - itemMargin * 2;

  // console.log(value, getPrice());
  return (
    <View
      style={{
        width: size,
        padding: padding,
        // height: size,
        // backgroundColor: 'red',
      }}>
      <View
        style={{
          //   height: itemSize,

          flexDirection: 'row',
          margin: itemMargin,
        }}>
        <View
          style={{
            flex: 1,
            borderColor: '#aaa',
            borderWidth: 1,
            borderRadius: 5,
            paddingVertical: getPercentValue(itemSize, 8),
            paddingHorizontal: getPercentValue(itemSize, 15),
            // backgroundColor: 'red',
          }}>
          <Text
            color="#888"
            semibold
            mb={getPercentValue(itemSize, 3)}
            size={getPercentValue(itemSize, 25)}>
            Received amount ($)
          </Text>
          <Text bold align="right" size={getPercentValue(itemSize, 30)}>
            ${getPrice()}
          </Text>
        </View>
        <Btn
          text="C"
          size={itemSize}
          backgroundColor={theme.colors.secondaryColor}
          color={'#fff'}
          itemMargin={itemMargin}
          onPress={resetPress}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        <Btn
          text="1"
          size={itemSize}
          itemMargin={itemMargin}
          data={1}
          onPress={onNumberPress}
        />
        <Btn
          text="2"
          size={itemSize}
          itemMargin={itemMargin}
          data={2}
          onPress={onNumberPress}
        />
        <Btn
          text="3"
          size={itemSize}
          itemMargin={itemMargin}
          data={3}
          onPress={onNumberPress}
        />
        <Btn
          text="$100"
          size={itemSize}
          backgroundColor={theme.colors.primaryColor}
          itemMargin={itemMargin}
          data={'10000'}
          onPress={setValue}
        />
        <Btn
          text="4"
          size={itemSize}
          itemMargin={itemMargin}
          data={4}
          onPress={onNumberPress}
        />
        <Btn
          text="5"
          size={itemSize}
          itemMargin={itemMargin}
          data={5}
          onPress={onNumberPress}
        />
        <Btn
          text="6"
          size={itemSize}
          itemMargin={itemMargin}
          data={6}
          onPress={onNumberPress}
        />
        <Btn
          text="$50"
          size={itemSize}
          backgroundColor={theme.colors.primaryColor}
          itemMargin={itemMargin}
          data={'5000'}
          onPress={setValue}
        />
        <Btn
          text="7"
          size={itemSize}
          itemMargin={itemMargin}
          data={7}
          onPress={onNumberPress}
        />
        <Btn
          text="8"
          size={itemSize}
          itemMargin={itemMargin}
          data={8}
          onPress={onNumberPress}
        />
        <Btn
          text="9"
          size={itemSize}
          itemMargin={itemMargin}
          data={9}
          onPress={onNumberPress}
        />
        <Btn
          text="$20"
          size={itemSize}
          backgroundColor={theme.colors.primaryColor}
          itemMargin={itemMargin}
          data={'2000'}
          onPress={setValue}
        />
        <Btn
          text="0"
          size={itemSize}
          itemMargin={itemMargin}
          data={0}
          onPress={onNumberPress}
          // data={1}
          // onPress={onDecimalPress}
        />
        <Btn
          text="00"
          size={itemSize}
          itemMargin={itemMargin}
          data={'00'}
          onPress={onNumberPress}
          // data={2}
          // onPress={onDecimalPress}
        />
        <Btn
          text="$5"
          size={itemSize}
          backgroundColor={theme.colors.primaryColor}
          itemMargin={itemMargin}
          data={'500'}
          onPress={setValue}
        />
        <Btn
          text="$10"
          size={itemSize}
          backgroundColor={theme.colors.primaryColor}
          itemMargin={itemMargin}
          data={'1000'}
          onPress={setValue}
        />
      </View>
    </View>
  );
}
function Btn({
  text = '',
  size = 80,
  backgroundColor = '#fff',
  color = '#212121',
  itemMargin,
  onPress,
  data,
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress(data);
      }}
      style={{
        backgroundColor: backgroundColor,
        width: size,
        height: size,
        margin: itemMargin,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#aaa',
        borderWidth: 1,
        borderRadius: 5,
        // flex: 1,
      }}>
      <Text bold color={color} size={getPercentValue(size, 28)}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
