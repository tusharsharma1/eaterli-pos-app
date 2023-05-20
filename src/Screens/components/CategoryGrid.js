import _ from 'lodash';
import React, {memo, useEffect, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Text from '../../components/Text';
import {getPercentValue} from '../../helpers/app.helpers';
import useProducts from '../../hooks/useProducts';
import {resetReduxState} from '../../redux/reducers';
import theme from '../../theme';
import userAction from '../../redux/actions/user.action';
let col = 4;
let chunk = 2;
let hPadding = 2;
export default function CategoryGrid(props) {
  const dispatch=useDispatch();
  const [leftContainerWidth, setLeftContainerWidth] = useState(theme.wp(70));

  let {categoriesSortable} = useProducts();
  useEffect(()=>{
    dispatch(userAction.set({selectedCategory:categoriesSortable.length
      ? categoriesSortable[0]
      : '',}))
  },[])

  const ListEmptyComponent = () => {
    // if (!loaded) {
    //   return null;
    // }
    return (
      <View
        style={{
          // backgroundColor: 'red',
          width: leftContainerWidth - hPadding * 2,
          alignItems: 'center',
          justifyContent: 'center',
          height: 100,
        }}>
        <Text size={20} align="center" color={'#000'} medium>
          No records
        </Text>
      </View>
    );
  };
  const keyExtractor = (item, index) => {
    return index; //item.id;
  };

  // let arr = Array.from(Array(100)).map((e, i) => i);
  let arr = categoriesSortable;
  let data = _.chunk(arr, chunk);

  const renderItem = ({item, index}) => {
    return <Item data={item} containerWidth={leftContainerWidth} />;
  };
  return (
    <View
      onLayout={e => {
        setLeftContainerWidth(e.nativeEvent.layout.width);
      }}>
      <FlatList
        horizontal
        //  numColumns={4}
        contentContainerStyle={{
          paddingVertical: 2,
          paddingHorizontal: hPadding,
        }}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        // refreshing={!loaded}
        // onRefresh={loadData}
        progressViewOffset={0}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
}
function _Item({data, onPress, containerWidth}) {
  const dispatch = useDispatch();
  let {categories, selectedCategory} = useProducts();

  if (!data) {
    return null;
  }
  let marginOffset = 2;

  let itemSize = (containerWidth - hPadding) / col - marginOffset * 2;
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        // width: containerWidth,
        width: itemSize + marginOffset * 2,
        // backgroundColor: '#000',
        // marginRight:1
      }}>
      {data.map((d, i) => {
        let c = categories[d];
        let selected = selectedCategory == d;

        return (
          <TouchableOpacity
            key={i}
            onPress={() => {
              // onPress && onPress(d);
              dispatch(userAction.set({selectedCategory: d}));
            }}
            activeOpacity={0.7}
            style={{
              // flexDirection: 'row',
              // marginHorizontal: 15,
              // marginVertical: 5,
              backgroundColor: selected
                ? theme.colors.secondaryColor
                : theme.colors.primaryColor,
              width: itemSize,
              // height: 40,
              margin: marginOffset,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 10,
              height: getPercentValue(itemSize, 45),
              paddingHorizontal: 10,
              borderRadius: 5,
            }}>
            <Text
              numberOfLines={3}
              medium
              color="#fff"
              size={getPercentValue(itemSize, 9)}
              align="center"
              line>
              {c?.category_name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const Item = memo(_Item);
