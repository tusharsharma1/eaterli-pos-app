import _ from 'lodash';
import React, {memo, useEffect, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Text from '../../components/Text';
import {formatGridData, getPercentValue} from '../../helpers/app.helpers';
import useProducts from '../../hooks/useProducts';
import {resetReduxState} from '../../redux/reducers';
import theme from '../../theme';
import userAction from '../../redux/actions/user.action';
import GridView from '../../components/GridView';
import ProgressImage from '../../components/react-native-image-progress';
import {dummyImage} from '../../assets';
import Color from 'color';
import useTheme from '../../hooks/useTheme';
let chunk = 2;

export default function CategoryGrid(props) {
  const dispatch = useDispatch();
  const [leftContainerWidth, setLeftContainerWidth] = useState(theme.wp(70));
  const [scrollIndex, setScrollIndex] = useState(0);
  const themeData = useTheme();
  let {categoriesSortable} = useProducts();
  useEffect(() => {
    dispatch(
      userAction.set({
        selectedCategory: categoriesSortable.length
          ? categoriesSortable[0]
          : '',
      }),
    );
  }, []);

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
        <Text size={20} align="center" color={themeData.textColor} medium>
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
  // arr = [...arr, ...arr];
  // let data = _.chunk(arr, chunk);
  let chunks = _.chunk(arr, 6);
  console.log('hommmm', categoriesSortable, chunks);
  const renderItem = ({item, index}) => {
    return <Item data={item} containerWidth={leftContainerWidth} />;
  };
  return (
    <View
      onLayout={e => {
        setLeftContainerWidth(e.nativeEvent.layout.width);
      }}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        //  numColumns={4}
        contentContainerStyle={
          {
            // paddingVertical: 2,
            // paddingHorizontal: hPadding,
          }
        }
        data={chunks}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        // refreshing={!loaded}
        // onRefresh={loadData}
        progressViewOffset={0}
        ListEmptyComponent={ListEmptyComponent}
        onScroll={e => {
          let lWidth = e.nativeEvent.layoutMeasurement.width;
          let totalWidth = e.nativeEvent.contentSize.width;
          let offsetWidth = e.nativeEvent.contentOffset.x + lWidth;
          let index = chunks.length / (totalWidth / offsetWidth);
          index = parseInt(index - 1);
          setScrollIndex(index);
        }}
      />
      {chunks.length > 1 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 10,
            marginTop: 5,
          }}>
          {Array.from(Array(chunks.length)).map((r, i) => {
            let active = scrollIndex == i;
            let width = leftContainerWidth / chunks.length;
            return (
              <View
                key={i}
                style={{
                  width: getPercentValue(width, 65),
                  height: 6,
                  borderRadius: 10,
                  marginHorizontal: getPercentValue(width, 4),
                  backgroundColor: active
                    ? '#71717B'
                    : themeData.darkMode
                    ? '#27262B'
                    : '#E4E3E8',
                }}></View>
            );
          })}
        </View>
      )}
    </View>
  );
}
let hPadding = 0;
let col = 3;
function _Item({data, onPress, containerWidth}) {
  const dispatch = useDispatch();
  let {categories, selectedCategory} = useProducts();

  let imageSettings = useSelector(s => s.settings.imageSettings);

  if (!data) {
    return null;
  }
  let marginOffset = 5;

  let itemSize = (containerWidth - hPadding) / col - marginOffset;
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: containerWidth,
        // width: itemSize + marginOffset * 2,
        // backgroundColor: '#00f',
        // height: 300,
        // marginRight:1
        // alignItems:'center'
        // alignContent: 'space-between',
        justifyContent: 'space-between',
      }}>
      {formatGridData(data, 3).map((d, i) => {
        let c = categories[d];
        let selected = selectedCategory == d;
        let style = {
          // flexDirection: 'row',
          // marginHorizontal: 15,
          // marginVertical: 5,
          backgroundColor: selected
            ? theme.colors.secondaryColor
            : theme.colors.primaryColor,
          width: itemSize,
          // height: 40,
          // margin: marginOffset,

          paddingVertical: 10,
          height: getPercentValue(itemSize, 45),
          paddingHorizontal: 10,
          borderRadius: 5,
          marginBottom: 8,
        };
        if (d.empty) {
          return (
            <View
              style={[
                style,
                {
                  backgroundColor: '#00000000',
                },
              ]}
            />
          );
        }
        let bgcolor = c.category_color || '#933249';
        let textcolor = '#F4F4F6';

        if (Color(bgcolor).isLight()) {
          textcolor = '#18171D';
        }
        return (
          <TouchableOpacity
            key={i}
            onPress={() => {
              // onPress && onPress(d);
              dispatch(userAction.set({selectedCategory: d}));
            }}
            activeOpacity={0.7}
            style={[
              style,
              {
                backgroundColor: bgcolor,
                alignItems: 'center',
                // justifyContent: 'center',
                flexDirection: 'row',
              },
            ]}>
            {imageSettings.showCatImage && !!c.category_image && (
              <ProgressImage
                color={textcolor}
                source={
                  c.category_image
                    ? {
                        uri: c.category_image,
                        //+ '?t=' + new Date().getTime()
                      }
                    : dummyImage
                }
                style={{
                  width: getPercentValue(itemSize, 18),
                  height: getPercentValue(itemSize, 18),
                  marginRight: 6,
                  // backgroundColor: Color(product_bg).darken(0.2).toString(),
                  // borderRadius: theme.wp(26) / 2,
                  // borderWidth: 1,
                  //borderColor: theme.colors.borderColor,
                  // data.item_image
                  //  backgroundColor:'red'
                }}
                imageStyle={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                }}
              />
            )}
            <View
              style={{
                flex: 1,
              }}>
              <Text
                numberOfLines={1}
                medium
                color={textcolor}
                size={getPercentValue(itemSize, 9)}
                // align="center"
              >
                {c?.category_name}
              </Text>
              <Text
                numberOfLines={2}
                medium
                color={textcolor}
                size={getPercentValue(itemSize, 7.2)}
                // align="center"
              >
                {c?.menu_items?.length || 0} menu in stock
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const Item = memo(_Item);
