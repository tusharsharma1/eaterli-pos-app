import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Text from './Text';
import {getPercentValue} from '../helpers/app.helpers';
import theme from '../theme';
import useTheme from '../hooks/useTheme';

export default function CalculatorPriceInput({
  size = 350,
  padding = 1,
  itemMargin = 5,
  onChange,
  total = 0,
}) {
  let themeData = useTheme();
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
  function isDecimal(num) {
    return (num ^ 0) !== num;
  }
  const getPrice = () => {
    let _val = parseFloat(value || 0) / 100;
    return _val;

    // let _val = parseFloat(value);
    // let l = _val.toString().length - decimalPlace;
    // let d = Math.pow(10, l);
    // return _val / d;
  };

  const getCompleteNo = (no, m = 5) => {
    let l = no + 10;

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

  const notesCountAmount = (amount, note = 10) => {
    let totalNotes = parseInt(amount / note);
    let r = amount % note;
    if (r > 0) {
      totalNotes = totalNotes + 1;
    }
    // console.log('nnn notesCountAmount',amount, note,totalNotes,totalNotes * note);
    return totalNotes * note;
  };

  let itemSize = (size - padding * 2) / 4;
  itemSize = itemSize - itemMargin * 2;

  let getButtons = amt => {
    // let roundAmt = getCompleteNo(amt);
    // let roundAmt10 = getCompleteNo(amt, 10);

    // let nextNotes = notes.filter(d => d > amt);
    // let b = [amt, roundAmt, roundAmt10, ...nextNotes];
    // if (amt > 100 && amt % 10 != 0) {
    //   b.push(roundAmt + 5);
    // }

    let b = [
      amt,
      notesCountAmount(total, 5),
      notesCountAmount(total, 10),
      notesCountAmount(total, 20),
      notesCountAmount(total, 50),
      notesCountAmount(total, 100),
    ];
    // console.log('nnn buttons', b);
    let btns = Array.from(new Set(b)).sort((a, b) => a - b);
    return btns;
  };

  let btns = getButtons(parseFloat(total));
  let price = getPrice();
  // console.log('nnn buttons final', total, btns);
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
          // margin: itemMargin,
        }}>
        <View
          style={{
            flex: 1,
            borderColor: themeData.inputBorderColor,
            borderWidth: 1,
            borderRadius: 4,
            paddingVertical: getPercentValue(itemSize, 8),
            paddingHorizontal: getPercentValue(itemSize, 15),
            backgroundColor: themeData.inputBg,
            margin: itemMargin,
          }}>
          <Text
            color={themeData.textColor}
            semibold
            mb={getPercentValue(itemSize, 3)}
            size={getPercentValue(itemSize, 25)}>
            Received amount ($)
          </Text>
          <Text
            bold
            align="right"
            color={themeData.textColor}
            size={getPercentValue(itemSize, 30)}>
            ${isDecimal(price) ? price.toFixed(2) : price}
          </Text>
        </View>
        <Btn
          text="C"
          size={itemSize}
          heightPerc={100}
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
          color={'#fff'}
          text={
            btns[0]
              ? `$${isDecimal(btns[0]) ? btns[0].toFixed(2) : btns[0]}`
              : ''
          }
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
          color={'#fff'}
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
          color={'#fff'}
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
          color={'#fff'}
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
          color={'#fff'}
          onPress={onAmountPress}
        />
      </View>
    </View>
  );
}
function Btn({
  text = '',
  size = 80,
  heightPerc = 80,
  backgroundColor,
  color,
  itemMargin,
  onPress,
  data,
}) {
  let themeData = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress(data);
      }}
      style={{
        backgroundColor: backgroundColor ?? themeData.cardBg,
        width: size,
        height: getPercentValue(size, heightPerc),
        margin: itemMargin,
        alignItems: 'center',
        justifyContent: 'center',
        // borderColor: '#aaa',
        // borderWidth: 1,
        borderRadius: 4,
        // flex: 1,
      }}>
      <Text
        bold
        color={color ?? themeData.textColor}
        size={Math.min(16, getPercentValue(size, 25))}
        // size={14}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
