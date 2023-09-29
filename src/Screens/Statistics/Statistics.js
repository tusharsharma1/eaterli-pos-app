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
let col = 4;
let hPadding = 2;

export default function Statistics({navigation, route}) {
  const dispatch = useDispatch();

  let [widgets, setWidgets] = useState([
    {
      title: 'Total Orders',
      value: 0,
    },
    {
      title: 'New Orders',
      value: 0,
    },
    {
      title: 'Confirmed Orders',
      value: 0,
    },
    {
      title: 'Delivered Orders',
      value: 0,
    },
    {
      title: 'Returned Orders',
      value: 0,
    },
    {
      title: 'Ready to Pickup Orders',
      value: 0,
    },
    {
      title: 'Total Customers',
      value: 0,
    },
  ]);
  const userData = useSelector(s => s.user.userData);
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    let r = await dispatch(
      userAction.getOrderStatistics(userData.restaurant.id, selectedLocation),
    );
    if (r && r.status) {
      let data = r.data;
      let _widgets = [];
      _widgets.push({
        title: 'Total Orders',
        value: data.total_order,
      });
      _widgets.push({
        title: 'New Orders',
        value: data.order_created,
      });
      _widgets.push({
        title: 'Confirmed Orders',
        value: data.order_confirmed,
      });
      _widgets.push({
        title: 'Delivered Orders',
        value: data.order_delivered,
      });
      _widgets.push({
        title: 'Returned Orders',
        value: data.order_returned,
      });
      _widgets.push({
        title: 'Ready to Pickup Orders',
        value: data.order_confirmed_to_pickup,
      });
      _widgets.push({
        title: 'Total Customers',
        value: data.total_customer,
      });
      setWidgets(_widgets);
    }
  };
  //  console.log(route.params)
  const ListEmptyComponent = () => {
    // if (!loaded) {
    //   return null;
    // }
    return (
      <View
        style={{
          // backgroundColor: 'red',
          alignItems: 'center',
          justifyContent: 'center',
          height: 100,
        }}>
        <Text size={20} color={'#000'} medium>
          No records
        </Text>
      </View>
    );
  };
  const keyExtractor = (item, index) => {
    return index; //item.id;
  };

  const renderItem = ({item, index}) => {
    return (
      <Item
        data={item}
        // onPress={onItemPress}
        //containerWidth={leftContainerWidth}
      />
    );
  };
  return (
    <>
      <Header title={'Statistics'} back />

      <Container style={{flex: 1}}>
        <FlatList
          // horizontal
          numColumns={col}
          contentContainerStyle={{
            paddingVertical: 2,
            paddingHorizontal: hPadding,
          }}
          data={formatGridData(widgets, col)}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          // refreshing={!loaded}
          // onRefresh={loadData}
          progressViewOffset={0}
          // ListEmptyComponent={ListEmptyComponent}
        />
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

  let marginOffset = 2;

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
    height: getPercentValue(itemSize, 45),
    borderRadius: 5,
  };
  if (empty) {
    return <View style={_itemStyle} />;
  }
  return (
    <View
      onPress={() => {
        onPress && onPress(_data);
      }}
      activeOpacity={0.7}
      style={{
        ..._itemStyle,
      }}>
      <Text
        numberOfLines={2}
        color="#111"
        semibold
        size={getPercentValue(itemSize, 12)}
        // align="center"
      >
        {data.value}
      </Text>
      <Text
        numberOfLines={2}
        color="#444"
        medium
        size={getPercentValue(itemSize, 7.6)}
        // align="center"
      >
        {data.title}
      </Text>
    </View>
  );
}
const Item = memo(_Item);
