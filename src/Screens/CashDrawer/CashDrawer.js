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
import OptionButton from '../components/OptionButton';
import AddCashDrawerButton from './AddCashDrawerButton';
import OpenCashDrawerButton from './OpenCashDrawerButton';
import theme from '../../theme';
import useTheme from '../../hooks/useTheme';
let col = 3;
let hPadding = 2;

export default function CashDrawer({navigation, route}) {
  const dispatch = useDispatch();
  const [balance, setBalance] = useState(0);
  const themeData = useTheme();
  const userData = useSelector(s => s.user.userData);
  const deviceId = useSelector(s => s.user.deviceId);
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    let r = await dispatch(
      userAction.getCashDrawerBalance(
        {
          location_id: selectedLocation,
          device_id: deviceId,
        },
        userData.restaurant.id,
      ),
    );
    if (r && r.status) {
      let data = r.data?.[0];
      setBalance(parseFloat(data?.totalAmount ?? 0));
    }
  };
  //  console.log(route.params)

  return (
    <>
      <Header title={'Cash Drawer'} back />
      <View
        style={{
          paddingHorizontal: 2,
          paddingVertical: 4,
          backgroundColor: themeData.bodyBg,
        }}>
        <Text color={themeData.textColor} size={18} semibold>
          Available Total Amount:{'  '}
          <Text color={theme.colors.secondaryColor} size={18} semibold>
            ${balance.toFixed(2)}
          </Text>
        </Text>
      </View>
      <Container
        style={{
          backgroundColor: themeData.bodyBg,
          flex: 1,
          paddingHorizontal: 2,
          paddingVertical: 4,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <AddCashDrawerButton type="1" title="Add Cash" onSuccess={loadData} />
          <AddCashDrawerButton
            type="2"
            title="Remove Cash"
            onSuccess={loadData}
          />
          <OpenCashDrawerButton />
        </View>
        {/* <Text ml={4} size={18} semibold>
          End of day actions
        </Text> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Item data={{title: 'Close Drawer'}} />
          <Item
            data={{title: 'View Transactions'}}
            onPress={() => {
              navigation.navigate('CashDrawerTransactions');
            }}
          />
          <Item data={{empty: true}} />
        </View>
      </Container>
    </>
  );
}

function _Item({data, onPress}) {
  const dispatch = useDispatch();
  const {categories} = useProducts();
  const {width} = useWindowDimensions();
  const themeData = useTheme();
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
    backgroundColor: empty ? 'transparent' : themeData.cardBg,
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
        color={themeData.textColor}
        medium
        size={getPercentValue(itemSize, 7.6)}
        align="center">
        {data.title}
      </Text>
    </TouchableOpacity>
  );
}
const Item = memo(_Item);
