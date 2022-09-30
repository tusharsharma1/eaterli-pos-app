import React, {memo, useEffect, useState} from 'react';
import {Text as TextReact, TouchableOpacity, View} from 'react-native';
import theme, {getFont} from '../theme';
import Text from './Text';
import CloseIcon from '../assets/close-icon.svg';
import BSIcon from '../assets/backspace.svg';
function _PinKeyBoard({length = 4,onCompleted}) {
  const [pin, setPin] = useState([]);

  useEffect(() => {
    if (pin.length >= length) {
      console.log(pin);
      onCompleted && onCompleted(pin.join(''))
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
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 20,
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
          renderComp={<CloseIcon width={33} height={33} />}
          backgroundColor="#ffff0000"
        />
        <NumButton text="0" onPress={onPress} />
        <NumButton
          onPress={removePress}
          renderComp={<BSIcon width={33} height={33} />}
          backgroundColor="#ffff0000"
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
        width: 15,
        height: 15,
        borderRadius: 20,
        marginHorizontal: 10,
      }}></View>
  );
}

function NumButton({text = '', renderComp, backgroundColor = '#fff', onPress}) {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress(text);
      }}
      style={{
        backgroundColor: backgroundColor,
        width: 55,
        height: 55,
        borderRadius: 70,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {!renderComp ? (
        <Text bold size={22} color={theme.colors.primaryColor}>
          {text}
        </Text>
      ) : (
        renderComp
      )}
    </TouchableOpacity>
  );
}
