import React, {memo, useEffect, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Text from '../../components/Text';
import {formatGridData, getPercentValue} from '../../helpers/app.helpers';
import useProducts from '../../hooks/useProducts';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import userAction from '../../redux/actions/user.action';
let col = 3;
let hPadding = 2;

export default function CashDrawer({navigation, route}) {
  const dispatch = useDispatch();

  const userData = useSelector(s => s.user.userData);
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {};
  //  console.log(route.params)

  return (
    <>
      <Header title={'Control Center'} back />

      <Container style={{flex: 1, paddingHorizontal: 2, paddingVertical: 4}}>
        <Text ml={4} size={18} semibold>
          Quick actions
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Item data={{title: 'Add Cash'}} />
          <Item data={{title: 'Remove Cash'}} />
          <Item data={{title: 'Open Drawer'}} />
        </View>
        <Text ml={4} size={18} semibold>
          End of day actions
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Item data={{title: 'Close Drawer'}} />
        </View>
      </Container>
    </>
  );
}

function _Item({data, onPress}) {
  const dispatch = useDispatch();
  const {categories} = useProducts();
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
        onPress && onPress(_data);
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
        {data.title}
      </Text>
    </TouchableOpacity>
  );
}
const Item = memo(_Item);
