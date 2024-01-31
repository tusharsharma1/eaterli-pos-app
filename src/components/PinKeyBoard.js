import React, {memo, useEffect, useState} from 'react';
import {Text as TextReact, TouchableOpacity, View} from 'react-native';
import theme, {getFont} from '../theme';
import Text from './Text';

import BSIcon from '../assets/BSIcon';
import CloseIcon from '../assets/CloseIcon';

function _PinKeyBoard({length = 4, scale = 1,style={}, onCompleted, getRef}) {
  const [pin, setPin] = useState([]);
  useEffect(() => {
    getRef && getRef({setPin});
  }, []);
  useEffect(() => {
    if (pin.length >= length) {
      console.log(pin);
      onCompleted && onCompleted(pin.join(''));
    }
  }, [pin]);

  const onPress = text => {
    let newPin = [...pin, text];
    if (newPin.length <= length) setPin(newPin);
  };

  const resetPress = () => {
    if (pin.length <= 0) {
      return;
    }
    setPin([]);
  };
  const removePress = () => {
    if (pin.length <= 0) {
      return;
    }
    let newPin = [...pin];
    newPin.pop();
    setPin(newPin);
  };
  // console.log(pin);
  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: 'red',
        // paddingTop:40
        justifyContent: 'center',
        transform: [
          {scale: scale},
          // {translateY: (bH - contentH) / 2},
        ],
        ...style,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 15,
        }}>
        {Array.from(Array(length), (r, i) => {
          return <Dot key={i} selected={pin.length >= i + 1}></Dot>;
        })}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 15,
        }}>
        <NumButton text="1" onPress={onPress} />
        <NumButton text="2" onPress={onPress} />
        <NumButton text="3" onPress={onPress} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 15,
        }}>
        <NumButton text="4" onPress={onPress} />
        <NumButton text="5" onPress={onPress} />
        <NumButton text="6" onPress={onPress} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 15,
        }}>
        <NumButton text="7" onPress={onPress} />
        <NumButton text="8" onPress={onPress} />
        <NumButton text="9" onPress={onPress} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 15,
        }}>
        <NumButton
          onPress={resetPress}
          // renderComp={<CloseIcon width={33} height={33} />}
          // backgroundColor="#ffff0000"
          text='Clear'
          fontSize={16}
        />
        <NumButton text="0" onPress={onPress} />
        <NumButton
          onPress={removePress}
          // renderComp={<BSIcon width={33} height={33} />}
          // backgroundColor="#ffff0000"
          text='Back'
          fontSize={16}
        />
      </View>
    </View>
  );
}

const PinKeyBoard = memo(_PinKeyBoard);
export default PinKeyBoard;
function Dot({selected = false}) {
  return (
    <View
      style={{
        backgroundColor: selected ? theme.colors.secondaryColor : '#ffffff77',
        width: 10,
        height: 10,
        borderRadius: 20,
        marginHorizontal: 10,
      }}></View>
  );
}

function NumButton({text = '',fontSize=22, renderComp, backgroundColor = '#fff', onPress}) {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress(text);
      }}
      style={{
        backgroundColor: backgroundColor,
        width: 70,
        height: 60,
        borderRadius: 4,
        marginHorizontal: 7.5,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {!renderComp ? (
        <Text  size={fontSize} color={'#18171D'}>
          {text}
        </Text>
      ) : (
        renderComp
      )}
    </TouchableOpacity>
  );
}
