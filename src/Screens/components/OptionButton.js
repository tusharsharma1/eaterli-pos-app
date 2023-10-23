import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Text from '../../components/Text';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import {getPercentValue} from '../../helpers/app.helpers';

function _Item({
  badge,
  title = '',
  color = '#444',
  backgroundColor = '#bbb',
  data = {},
  onPress,
  col = 3,
  hPadding = 2,
}) {
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
    backgroundColor: empty ? 'transparent' : backgroundColor,
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
  // badge = 997;
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
        color={color}
        medium
        size={getPercentValue(itemSize, 7.6)}
        align="center">
        {title}
      </Text>

      {!!badge && (
        <View
          style={{
            position: 'absolute',
            top: 5,
            right: 5,
            width: getPercentValue(itemSize, 12),
            height: getPercentValue(itemSize, 12),
            borderRadius: getPercentValue(itemSize, 12),
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text size={getPercentValue(itemSize, 5)} color="#fff">
            {badge > 99 ? '99+' : badge.toString().padStart(2, 0)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
const OptionButton = memo(_Item);
export default OptionButton;
