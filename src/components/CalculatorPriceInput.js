import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Text from './Text';
import {getPercentValue} from '../helpers/app.helpers';
import theme from '../theme';

export default function CalculatorPriceInput({
  size = 240,
  padding = 1,
  itemMargin = 1,
  onChange,
  total = 0,
}) {
  const [value, setValue] = useState('');
  const [decimalPlace, setDecimalPlace] = useState(1);

  useEffect(() => {
    onChange && onChange(getPrice(), value);
  }, [value]);

  const onNumberPress = data => {
    let _val = `${value}${data}`;
    setValue(_val);
  };
  const onAmountPress = data => {
    if (data) {
      setValue(data);
    }
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

  const getCompleteNo = no => {
    let l = no + 10;
    let m = 5;
    // console.log('nnn l', l);
    let add = 0;
    for (let i = m; i <= l; i = i + m) {
      // console.log('nnn i', i, i - no);
      add = i - no;
      if (add >= 0) {
        break;
      }
    }
    // console.log('nnn add', add);
    return no + add;
  };
  let notes = [100, 50, 20, 10, 5, 1];
  const countCurrency = amount => {
    let noteCounter = Array(9).fill(0);
    let ob = {};
    // count notes using Greedy approach
    for (let i = 0; i < 9; i++) {
      if (amount >= notes[i]) {
        noteCounter[i] = Math.floor(amount / notes[i]);
        if (noteCounter[i]) {
          ob = {...ob, [notes[i]]: noteCounter[i]};
        }
        amount = amount % notes[i];
      }
    }

    return ob; //noteCounter.map((d, i) => ({[notes[i]]: d})).filter((d, i) => d);
    // Print notes
    //  document.write("Currency Count ->" + "<br/>");
    // for (let i = 0; i < 9; i++) {
    //     if (noteCounter[i] != 0) {
    //         document.write(notes[i] + " : "
    //             + noteCounter[i] + "<br/>");
    //     }
    // }
  };

  let itemSize = (size - padding * 2) / 4;
  itemSize = itemSize - itemMargin * 2;

  let getButtons = amt => {
    let roundAmt = getCompleteNo(amt);

    let nextNotes = notes.filter(d => d > amt);
    let b = [amt, roundAmt, ...nextNotes];
    if (amt > 100 && amt % 10 != 0) {
      b.push(roundAmt + 5);
    }
    let btns = Array.from(new Set(b)).sort((a, b) => a - b);
    return btns;
  };
  let btns = getButtons(parseFloat(total));

  // console.log('nnn buttons', ...btns);
  // let completePrice = getCompleteNo(parseInt(total));
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
          size={itemSize}
          backgroundColor={theme.colors.primaryColor}
          itemMargin={itemMargin}
          // text={`$${completePrice + 20}`}
          // data={(completePrice + 20) * 100}
          text={btns[0] ? `$${btns[0]}` : ''}
          data={(btns[0] ?? 0) * 100}
          onPress={onAmountPress}
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
          size={itemSize}
          backgroundColor={theme.colors.primaryColor}
          itemMargin={itemMargin}
          // text={`$${completePrice + 15}`}
          // data={(completePrice + 15) * 100}
          text={btns[1] ? `$${btns[1]}` : ''}
          data={(btns[1] ?? 0) * 100}
          onPress={onAmountPress}
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
          size={itemSize}
          backgroundColor={theme.colors.primaryColor}
          itemMargin={itemMargin}
          // text={`$${completePrice + 10}`}
          // data={(completePrice + 10) * 100}
          text={btns[2] ? `$${btns[2]}` : ''}
          data={(btns[2] ?? 0) * 100}
          onPress={onAmountPress}
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
          size={itemSize}
          backgroundColor={theme.colors.primaryColor}
          itemMargin={itemMargin}
          // text={`$${completePrice}`}
          // data={completePrice * 100}
          text={btns[4] ? `$${btns[4]}` : ''}
          data={(btns[4] ?? 0) * 100}
          onPress={onAmountPress}
        />
        <Btn
          size={itemSize}
          backgroundColor={theme.colors.primaryColor}
          itemMargin={itemMargin}
          // text={`$${completePrice + 5}`}
          // data={(completePrice + 5) * 100}
          text={btns[3] ? `$${btns[3]}` : ''}
          data={(btns[3] ?? 0) * 100}
          onPress={onAmountPress}
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
