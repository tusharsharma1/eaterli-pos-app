import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Container from '../../components/Container';
import Header from '../../components/Header';
import {PRODUCT_MENU_TYPE} from '../../constants/order.constant';
import userAction from '../../redux/actions/user.action';
import CategoryNav from '../components/CategoryNav';
import MenuItem from '../components/MenuItem';
import useProducts from '../../hooks/useProducts';
import Text from '../../components/Text';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {formatGridData, getPercentValue} from '../../helpers/app.helpers';
import theme from '../../theme';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useTheme from '../../hooks/useTheme';
let col = 4;
let hPadding = 2;

export default function ProductMenu({navigation, route}) {
  const dispatch = useDispatch();
  let {menuTitlesIds} = useProducts();
  const themeData = useTheme();
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {};
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
  const onItemPress = data => {
    dispatch(
      userAction.set({
        selectedMenuTitle: data.id,
      }),
    );
    navigation.navigate('MenuCategories');
  };
  const renderItem = ({item, index}) => {
    return (
      <Item
        data={item}
        onPress={onItemPress}
        //containerWidth={leftContainerWidth}
      />
    );
  };
  return (
    <>
      <Header title={'Select Menu'} back />
      {/* <CategoryNav /> */}
      <Container style={{flex: 1, backgroundColor: themeData.bodyBg}}>
        <FlatList
          // horizontal
          numColumns={col}
          contentContainerStyle={{
            paddingVertical: 2,
            paddingHorizontal: hPadding,
          }}
          data={formatGridData(menuTitlesIds, col)}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          // refreshing={!loaded}
          // onRefresh={loadData}
          progressViewOffset={0}
          ListEmptyComponent={ListEmptyComponent}
        />
      </Container>
    </>
  );
}
function _Item({data, onPress}) {
  const dispatch = useDispatch();
  const themeData = useTheme();
  const {width} = useWindowDimensions();
  let containerWidth = width;
  const _data = useSelector(s => s.user.menuTitles.find(t => t.id == data));

  if (!_data) {
    return null;
  }
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
    backgroundColor: empty ? 'transparent' : themeData.cardBg,
    width: itemSize,
    // flex: 1,
    // height: 40,
    margin: marginOffset,
    alignItems: 'center',
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
        color={themeData.textColor}
        medium
        size={getPercentValue(itemSize, 7.6)}
        align="center">
        {_data.title}
      </Text>
    </TouchableOpacity>
  );
}
const Item = memo(_Item);
