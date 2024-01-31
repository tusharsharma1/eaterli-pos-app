import _, {mean} from 'lodash';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Text from '../../components/Text';
import {
  debounce,
  formatGridData,
  getPercentValue,
  showToast,
  simpleToast,
} from '../../helpers/app.helpers';
import useProducts from '../../hooks/useProducts';
import {resetReduxState} from '../../redux/reducers';
import theme from '../../theme';
import userAction from '../../redux/actions/user.action';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  addToCart,
  getAddons,
  getAddonsTotal,
  getCartItemID,
  getPrice,
  getVariants,
} from '../../helpers/order.helper';
import ModalContainer from '../../components/ModalContainer';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Button from '../../components/Button';
import Container from '../../components/Container';
import orderAction from '../../redux/actions/order.action';
import {
  ORDER_ITEM_TYPE,
  PRODUCT_MENU_TYPE,
} from '../../constants/order.constant';
import useTheme from '../../hooks/useTheme';
import ProgressImage from '../../components/react-native-image-progress';
import {dummyImage} from '../../assets';
import appAction from '../../redux/actions/app.action';
import TextInput from '../../components/Controls/TextInput';
let col = 2;

let hPadding = 2;

let modalCol = 3;
export default function MenuItemGrid(props) {
  const [leftContainerWidth, setLeftContainerWidth] = useState(theme.wp(70));
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const themeData = useTheme();
  const [selectedItem, setSelectedItem] = useState(null);
  let {selectedCategory, categories} = useProducts();
  const diningOption = useSelector(s => s.order.diningOption);
  // useEffect(() => {
  // setShowModal(false);
  // }, [selectedCategory]);
  useEffect(() => {
    if (!showModal) {
      setSelectedItem(null);
    }
  }, [showModal]);
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
        <Text size={20} color={themeData.textColor} medium>
          No records
        </Text>
      </View>
    );
  };
  const keyExtractor = (item, index) => {
    return index; //item.id;
  };
  const onItemPress = data => {
    if (!diningOption) {
      dispatch(
        orderAction.set({
          diningOptionModal: {show: true, ref: ''},
        }),
      );
      return;
    }
    let variants = getVariants(data);
    if (variants.length) {
      setSelectedItem(data);
      toggleModal();
    } else {
      let {price, cutPrice} = getPrice(data.id, '', false);

      let id = getCartItemID(
        ORDER_ITEM_TYPE.menu.id,
        data.id,
        {},
        [],
        PRODUCT_MENU_TYPE.restuarant.id,
      ); //idPart.join("-");

      let added = dispatch(
        orderAction.addToCart(id, {price, add_ons: [], special_ins: ''}),
      );

      // let added = addToCart(data.id, {}, price, [], '');
    }
  };
  const renderItem = ({item, index}) => {
    return (
      <Item
        data={item}
        onPress={onItemPress}
        containerWidth={leftContainerWidth}
        index={index}
      />
    );
  };
  let cat = categories[selectedCategory];
  if (!cat) {
    return null;
  }
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  let data = cat.menu_items; //Array.from(Array(100)).map((e, i) => i);
  let bgcolor = cat.category_color || '#933249';
  return (
    <View
      onLayout={e => {
        setLeftContainerWidth(e.nativeEvent.layout.width);
      }}
      style={{
        flex: 1,
        // height: catListH,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <Text size={20} semibold color={bgcolor}>
          {cat.category_name}
        </Text>
        <View
          style={{
            backgroundColor: bgcolor,
            height: 8,
            borderRadius: 20,
            flex: 1,
            marginLeft: 10,
          }}></View>
      </View>
      {showModal ? (
        <ItemModal
          toggleModal={toggleModal}
          showModal={showModal}
          data={selectedItem}
          containerWidth={leftContainerWidth}
        />
      ) : (
        <>
          <FlatList
            // horizontal
            numColumns={col}
            contentContainerStyle={
              {
                // paddingVertical: 2,
                // paddingHorizontal: hPadding,
                // justifyContent: 'space-between',
              }
            }
            data={formatGridData(data, col)}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            // refreshing={!loaded}
            // onRefresh={loadData}
            progressViewOffset={0}
            ListEmptyComponent={ListEmptyComponent}
          />
        </>
      )}
      <SearchModal onItemPress={onItemPress} />
    </View>
  );
}
function _Item({data, index, onPress, containerWidth}) {
  const dispatch = useDispatch();
  let {categories, menuItems, selectedCategory} = useProducts();
  const themeData = useTheme();
  let imageSettings = useSelector(s => s.settings.imageSettings);
  let d = menuItems[data];
  let {price, cutPrice} = getPrice(data, '', false);
  if (!d) {
    return null;
  }
  if (d.pos_status == 0) {
    return null;
  }
  let empty = data.empty === true;

  let marginOffset = 2.5;

  let itemSize = (containerWidth - hPadding * 2) / col - marginOffset;
  let _itemStyle = {
    // flexDirection: 'row',
    // marginHorizontal: 15,
    // marginVertical: 5,
    backgroundColor: empty ? 'transparent' : themeData.cardBg,
    width: itemSize,
    // flex: 1,
    // height: 40,
    // margin: marginOffset,
    // alignItems: 'center',
    // justifyContent: 'space-between',
    paddingVertical: 10, //theme.hp(5),
    paddingHorizontal: 10,
    // height: getPercentValue(itemSize, 45),
    borderRadius: 5,
    marginBottom: 10,
    marginRight: index % 2 ? 0 : 10,
    flexDirection: 'row',
  };
  if (empty) {
    return <View style={_itemStyle} />;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress(d);
      }}
      activeOpacity={0.7}
      style={{
        ..._itemStyle,
      }}>
      {imageSettings.showProductImage && !!d.item_image && (
        <ProgressImage
          color={'#F4F4F6'}
          source={
            d.item_image
              ? {
                  uri: d.item_image,
                  //+ '?t=' + new Date().getTime()
                }
              : dummyImage
          }
          style={{
            width: getPercentValue(itemSize, 33),
            height: getPercentValue(itemSize, 33),
            marginRight: 10,
            // backgroundColor: Color(product_bg).darken(0.2).toString(),

            // borderWidth: 1,
            //borderColor: theme.colors.borderColor,
            // data.item_image
            //  backgroundColor:'red'
          }}
          imageStyle={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            borderRadius: 5,
          }}
        />
      )}
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
          }}>
          <Text
            numberOfLines={1}
            color={themeData.textColor}
            medium
            size={getPercentValue(itemSize, 7)}
            align="left">
            {d.item_name}
          </Text>
          <Text
            numberOfLines={2}
            mb={5}
            color={themeData.textColor}
            size={getPercentValue(itemSize, 4.6)}>
            {d.item_description}
          </Text>
        </View>
        <Text
          color={themeData.textColor}
          bold
          size={getPercentValue(itemSize, 7)}
          align="right">
          $ {parseFloat(price || 0).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
const Item = memo(_Item);

function ItemModal({toggleModal, showModal, data, containerWidth}) {
  const dispatch = useDispatch();
  const themeData = useTheme();
  const [selectedVar, setSelectedVar] = useState({});
  const [selectedAddons, setSelectedAddons] = useState([]);
  let addonProductsById = useSelector(s => s.user.addonProductsById);
  useEffect(() => {
    if (!showModal) {
      setSelectedVar({});
      setSelectedAddons([]);
    }
  }, [showModal]);

  const addToCartPress = () => {
    let {price} = getPrice(data.id, selectedVar);

    let variants = getVariants(data);
    let selectedVariants = Object.keys(selectedVar).filter(
      i => selectedVar[i].length,
    );
    let allReqVarSelected = variants
      .filter(v => v.required)
      .map(v => selectedVariants.includes(v.title_id))
      .every(r => r === true);

    if (!allReqVarSelected) {
      simpleToast('Select required options.');
      return;
    }

    let addons = selectedAddons.map(r => addonProductsById[r]);

    let id = getCartItemID(
      ORDER_ITEM_TYPE.menu.id,
      data.id,
      selectedVar,
      addons,
      PRODUCT_MENU_TYPE.restuarant.id,
    ); //idPart.join("-");

    let added = dispatch(
      orderAction.addToCart(id, {price, add_ons: addons, special_ins: ''}),
    );

    // let added1 = addToCart(data.id, selectedVar, price, addons, '');

    if (added) {
      toggleModal();
    }
  };

  const onItemClick = (item, pdata) => {
    // console.log('var', item, pdata);

    // return () => {
    //console.log(selectedCategoryItem, item.id, price);
    //let { selectedSize } = this.state;
    let list = [...(selectedVar[pdata.title_id] || [])];
    if (pdata.multiselect) {
      let upto = parseInt(pdata.upto || 0);
      if (upto > 0 && !list.includes(item.id) && list.length >= upto) {
        // console.log(`Select up to ${upto}`);

        simpleToast(`Select up to ${upto}`);
        return;
      }

      if (list.includes(item.id)) {
        list.splice(list.indexOf(item.id), 1);
      } else {
        list.push(item.id);
      }
      setSelectedVar({
        ...selectedVar,
        [pdata.title_id]: list,
      });
    } else {
      if (list.includes(item.id)) {
        setSelectedVar({
          ...selectedVar,
          [pdata.title_id]: [],
        });
      } else {
        setSelectedVar({
          ...selectedVar,
          [pdata.title_id]: [item.id],
        });
      }
    }
    // };
  };
  const onAddonsItemClick = item => {
    //console.log(selectedCategoryItem, item.id, price);
    let list = [...selectedAddons];
    if (list.includes(item.id)) {
      list.splice(list.indexOf(item.id), 1);
    } else {
      list.push(item.id);
    }

    let slist = list.sort(function (a, b) {
      return a - b;
    });
    setSelectedAddons(slist);
  };

  if (!data) {
    return null;
  }

  let addons = getAddons(data);

  let variants = getVariants(data);

  let {price, cutPrice} = getPrice(data.id, selectedVar);
  let selected_addons = selectedAddons.map(r => addonProductsById[r]);

  let add_onsTotal = getAddonsTotal(selected_addons);
  let totalPrice = add_onsTotal + price;
  // console.log('[variants] ', data, addons);
  // let price=0;
  return (
    <>
      {/* <ModalContainer
        // hideTitle
        center
        // noscroll
        onRequestClose={toggleModal}
        visible={showModal}
        title={data.item_name}
        width={modalContainerW}
        // height={theme.hp(60)}
        // borderRadius={25}
        renderFooter={() => {
          return (
            <View
              style={{
                alignItems: 'flex-end',
              }}>
              <Button ph={30} size={14} onPress={addToCartPress}>
                Add To Cart $ {parseFloat(totalPrice || 0).toFixed(2)}
              </Button>
            </View>
          );
        }}> */}
      <View
        style={{
          flex: 1,
          // backgroundColor: '#fff',
          // paddingTop: 10,
        }}>
        <TouchableOpacity
          onPress={toggleModal}
          style={{
            backgroundColor: themeData.btnSecondaryBg,
            width: 40,
            height: 40,
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 5,
            marginHorizontal: 0,
            // paddingLeft: 25,
          }}>
          {/* <BackIcon /> */}
          <MaterialIcons name="arrow-back" color={'#fff'} size={25} />
        </TouchableOpacity>
        <Container
          scroll
          style={{
            flex: 1,
            // backgroundColor: '#fff',
          }}
          contentContainerStyle={{
            paddingTop: 10,
            // paddingHorizontal: theme.paddingHorizontal,
          }}>
          {variants.map((m, i) => {
            return (
              <Variants
                key={m.id}
                selectedItems={selectedVar[m.title_id] || []}
                data={m}
                onItemPress={onItemClick}
                containerWidth={containerWidth}
              />
            );
          })}

          {addons.map(m => {
            return (
              <AddOns
                key={m.id}
                data={m}
                selectedItems={selectedAddons}
                onItemPress={onAddonsItemClick}
                containerWidth={containerWidth}
              />
            );
          })}
        </Container>

        <View
          style={{
            alignItems: 'flex-end',
            paddingHorizontal: theme.paddingHorizontal,
            paddingVertical: 5,
          }}>
          <Button noShadow ph={30} pv={10} size={14} onPress={addToCartPress}>
            Add To Cart $ {parseFloat(totalPrice || 0).toFixed(2)}
          </Button>
        </View>
      </View>
      {/* </ModalContainer> */}
    </>
  );
}
function Variants({data, selectedItems = [], onItemPress, containerWidth}) {
  const options = useSelector(s => s.user.options);
  const themeData = useTheme();
  let items = (data.items ?? []).filter(m => {
    let pos_status = m.pos_status ?? true;
    return pos_status;
  });
  // console.log('pppp', items);
  if (!items.length) {
    return null;
  }

  let op = options.find(s => s.id == data.title_id);
  if (!op) {
    return null;
  }
  // console.log('[selectedSize] op', op);
  let upto = parseInt(data.upto || 0);
  // let Root =
  //   modifierStyle == "style2"
  //     ? ({ children }) => {
  //         return <div className="row">{children}</div>;
  //       }
  //     : Fragment;

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Text bold size={18} color={themeData.textColor} style={{flex: 1}}>
          {op.variation_name}
        </Text>
        <Text size={16} color={themeData.textColor}>
          {data.required ? '(Required)' : '(Optional)'}
        </Text>
      </View>
      {!!upto && data.multiselect && (
        <Text size={14} color={themeData.textColor}>
          Select up to {data.upto}{' '}
        </Text>
      )}

      <View
        style={{
          marginTop: 5,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        {formatGridData(items, modalCol).map((m, i) => {
          let opdata = op.variation_options.find(o => o.id == m.id);
          let price = m.price;
          let empty = m.empty === true;
          let size = (containerWidth - 5) / modalCol - 2.5;
          let selected = selectedItems.includes(m.id);
          let multiselect = data.multiselect;
          let _style = {
            flexDirection: 'row',
            width: size,
            height: getPercentValue(size, 25),
            marginBottom: 5,
            backgroundColor: empty ? '#00000000' : themeData.cardBg,

            // borderWidth: 0,
            // borderColor: empty ? 'transparent' : '#ccc',

            paddingHorizontal: 8,
            paddingVertical: 5,
            borderRadius: 4,
            alignItems: 'center',
          };

          let pos_status = m.pos_status ?? true;
          if (!pos_status) {
            return null;
          }
          if (empty) {
            // console.log('[m.id] m.id',data.id, m.id,`empty-${i}`);
            return <View key={`empty-${i}`} style={_style}></View>;
          }

          return (
            <TouchableOpacity
              onPress={() => {
                onItemPress && onItemPress(m, data);
              }}
              key={m.id}
              style={_style}>
              {multiselect ? (
                <FontAwesome5Icon
                  size={16}
                  color={
                    selected ? theme.colors.successColor : themeData.textColor
                  }
                  name={selected ? 'check-circle' : ''}
                  solid={selected}
                />
              ) : (
                <FontAwesome5Icon
                  size={16}
                  color={
                    selected ? theme.colors.successColor : themeData.textColor
                  }
                  name={selected ? 'check-circle' : ''}
                  solid={selected}
                />
              )}
              <Text
                ml={5}
                numberOfLines={2}
                size={12}
                style={{
                  flex: 1,
                }}
                color={themeData.textColor}>
                {m.title}
              </Text>
              <Text size={12} semibold color={themeData.textColor}>
                $ {parseFloat(price || 0).toFixed(2)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
function AddOns({data, selectedItems = [], onItemPress, containerWidth}) {
  let addonProductsById = useSelector(s => s.user.addonProductsById);
  let themeData = useTheme();
  let items = (data.items ?? []).filter(m => {
    let pos_status = data.conf?.[m]?.pos_status ?? true;
    return pos_status;
  });
  // console.log('pppp', items);
  if (!items.length) {
    return null;
  }
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Text bold color={themeData.textColor} size={18} style={{flex: 1}}>
          {data.title}
        </Text>
      </View>
      <Text size={14} color={themeData.textColor}>
        {data.subtitle}
      </Text>

      <View
        style={{
          marginTop: 5,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        {formatGridData(items, modalCol).map((m, i) => {
          let item = addonProductsById[m];
          // let opdata = op.variation_options.find(o => o.id == m.id);
          // let price = m.price;
          let empty = m.empty === true;
          let size = (containerWidth - 5) / modalCol - 2.5;
          let selected = selectedItems.includes(m);
          // let multiselect = data.multiselect;
          let _style = {
            flexDirection: 'row',
            width: size,
            height: getPercentValue(size, 25),
            marginBottom: 5,
            backgroundColor: empty ? 'transparent' : themeData.cardBg,

            // borderWidth: 1,
            // borderColor: empty ? 'transparent' : '#ccc',

            paddingHorizontal: 8,
            paddingVertical: 5,
            borderRadius: 4,
            alignItems: 'center',
          };
          // console.log('[m.id] m.id', i, item);
          let pos_status = data.conf?.[m]?.pos_status ?? true;
          if (!pos_status) {
            return null;
          }
          if (empty) {
            // console.log('[m.id] m.id',data.id, m.id,`empty-${i}`);
            return <View key={`empty-${i}`} style={_style}></View>;
          }
          if (!item) {
            return null;
          }
          return (
            <TouchableOpacity
              onPress={() => {
                onItemPress && onItemPress(item);
              }}
              key={m}
              style={_style}>
              <FontAwesome5Icon
                size={16}
                color={
                  selected ? theme.colors.successColor : themeData.textColor
                }
                name={selected ? 'check-circle' : ''}
                solid={selected}
              />

              <Text
                ml={5}
                numberOfLines={2}
                size={12}
                style={{
                  flex: 1,
                }}
                color={themeData.textColor}>
                {item.product_name}
              </Text>
              <Text size={12} semibold color={themeData.textColor}>
                + $ {parseFloat(item.product_price || 0).toFixed(2)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function SearchModal({onItemPress}) {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  const searchModal = useSelector(s => s.app.searchModal);
  let {menuItems} = useProducts();
  const themeData = useTheme();
  let menus = useMemo(() => {
    return Object.values(menuItems);
  }, [menuItems]);
  const toggleModal = () => {
    dispatch(
      appAction.set({
        searchModal: !searchModal,
      }),
    );
  };
  const onChangeText = val => {
    setText(val);
    onChangeSuccess(val);
  };
  const onChangeSuccess = useCallback(
    debounce(async value => {
      if (!value.trim()) {
        setData([]);
        return;
      }

      console.log('cal', value);
      let seData = menus.filter(d => {
        return (d.item_name || '').toLowerCase().includes(value.toLowerCase());
      });
      setData(seData);
    }, 500),
    [menus],
  );
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
        <Text size={20} color={themeData.textColor} medium>
          No records
        </Text>
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <SearchItem
        data={item}
        onPress={data => {
          toggleModal();
          dispatch(
            userAction.set({
              selectedCategory: data.menu_category_id,
            }),
          );
          onItemPress && onItemPress(data);
        }}
        // containerWidth={leftContainerWidth}
        // index={index}
      />
    );
  };
  return (
    <ModalContainer
      // hideTitle
      center
      noscroll
      onRequestClose={toggleModal}
      visible={searchModal}
      title={`Search Product`}
      minHeight={'80%'}
      landscapeWidth={550}
      containerStyle={{
        flex: 1,
      }}>
      <View
        style={{
          // marginBottom: 10,
          // backgroundColor:'red',
          flex: 1,
          // height:200
        }}>
        <TextInput
          textInputProps={{
            onChangeText: onChangeText,

            value: text,
            // keyboardType: 'email-address',
            // autoCompleteType: 'email',
            // autoCapitalize: 'none',
            // returnKeyType: 'next',
            placeholder: 'Search',
            //  onSubmitEditing: () => this.passwordInput.focus(),
            //ref: r => (this.emailInput = r),
          }}
        />
        <View
          style={{
            flex: 1,
          }}>
          <FlatList
            // horizontal
            // numColumns={col}
            contentContainerStyle={
              {
                // paddingVertical: 2,
                // paddingHorizontal: hPadding,
                // justifyContent: 'space-between',
              }
            }
            data={data}
            keyExtractor={(item, index) => {
              return item.id;
            }}
            renderItem={renderItem}
            // refreshing={!loaded}
            // onRefresh={loadData}
            // progressViewOffset={0}
            ListEmptyComponent={ListEmptyComponent}
          />
        </View>
      </View>
    </ModalContainer>
  );
}
function _SearchItem({data, onPress}) {
  const themeData = useTheme();
  let imageSettings = useSelector(s => s.settings.imageSettings);

  let {price, cutPrice} = getPrice(data.id, '', false);
  if (!data) {
    return null;
  }
  if (data.pos_status == 0) {
    return null;
  }
  let _itemStyle = {
    // flexDirection: 'row',
    // marginHorizontal: 15,
    // marginVertical: 5,
    backgroundColor: themeData.cardBg,
    // width: itemSize,
    // flex: 1,
    // height: 40,
    // margin: marginOffset,
    // alignItems: 'center',
    // justifyContent: 'space-between',
    paddingVertical: 10, //theme.hp(5),
    paddingHorizontal: 10,
    // height: getPercentValue(itemSize, 45),
    borderRadius: 5,
    marginBottom: 10,
    // marginRight: index % 2 ? 0 : 10,
    flexDirection: 'row',
  };

  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress(data);
      }}
      activeOpacity={0.7}
      style={{
        ..._itemStyle,
      }}>
      {imageSettings.showProductImage && !!data.item_image && (
        <ProgressImage
          color={'#F4F4F6'}
          source={
            data.item_image
              ? {
                  uri: data.item_image,
                  //+ '?t=' + new Date().getTime()
                }
              : dummyImage
          }
          style={{
            width: 50,
            height: 50,
            marginRight: 10,
            // backgroundColor: Color(product_bg).darken(0.2).toString(),

            // borderWidth: 1,
            //borderColor: theme.colors.borderColor,
            // data.item_image
            //  backgroundColor:'red'
          }}
          imageStyle={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            borderRadius: 5,
          }}
        />
      )}
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
          }}>
          <Text
            numberOfLines={1}
            color={themeData.textColor}
            medium
            size={16}
            align="left">
            {data.item_name}
          </Text>
          <Text numberOfLines={2} mb={5} color={themeData.textColor} size={14}>
            {data.item_description}
          </Text>
        </View>
        <Text color={themeData.textColor} bold size={16} align="right">
          $ {parseFloat(price || 0).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
const SearchItem = memo(_SearchItem);
