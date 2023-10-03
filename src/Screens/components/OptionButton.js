import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Text from '../../components/Text';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import {getPercentValue} from '../../helpers/app.helpers';

function _Item({title = '',data={}, onPress, col = 3, hPadding = 2}) {
  const {width} = useWindowDimensions();
  let containerWidth = width;

  // let d = menuItems[data];
  // let {price, cutPrice} = getPrice(data, '', false);
  // if (!d) {
  //   return null;
  // }

  let empty = data.empty === true;

  let marginOffset = 5;

  let itemSize = (containerWidth - hPadding * 2) / col - marginOffset * 2;
  let _itemStyle = {
    // flexDirection: 'row',
    // marginHorizontal: 15,
    // marginVertical: 5,
    backgroundColor: empty ? 'transparent' : '#bbb',
    width: itemSize,
    // flex: 1,
    // height: 40,
    margin: marginOffset,
    // alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10, //theme.hp(5),
    paddingHorizontal: 10,
    height: getPercentValue(itemSize, 30),
    borderRadius: 5,
  };
  if (empty) {
    return <View style={_itemStyle} />;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress();
      }}
      activeOpacity={0.7}
      style={{
        ..._itemStyle,
      }}>
      <Text
        numberOfLines={2}
        color="#444"
        medium
        size={getPercentValue(itemSize, 7.6)}
        align="center">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
const OptionButton = memo(_Item);
export default OptionButton;
