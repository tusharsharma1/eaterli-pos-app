import _ from 'lodash';
import React, {memo, useEffect, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Text from '../../components/Text';
import {
  formatGridData,
  getPercentValue,
  showToast,
  simpleToast,
} from '../../helpers/app.helpers';
import useProducts from '../../hooks/useProducts';
import {resetReduxState} from '../../redux/reducers';
import theme from '../../theme';
import userAction from '../../redux/actions/user.action';
import {
  addToCart,
  getAddons,
  getAddonsTotal,
  getPrice,
  getVariants,
} from '../../helpers/order.helper';
import ModalContainer from '../../components/ModalContainer';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Button from '../../components/Button';
let col = 4;

let hPadding = 2;
let modalContainerW = 720;
let modalCol = 3;
export default function MenuItemGrid(props) {
  const [leftContainerWidth, setLeftContainerWidth] = useState(theme.wp(70));
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  let {selectedCategory, categories} = useProducts();
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
    let variants = getVariants(data);
    if (variants.length) {
      setSelectedItem(data);
      toggleModal();
    } else {
      let {price, cutPrice} = getPrice(data.id, '', false);
      let added = addToCart(data.id, {}, price, [], '');
    }
  };
  const renderItem = ({item, index}) => {
    return (
      <Item
        data={item}
        onPress={onItemPress}
        containerWidth={leftContainerWidth}
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

  return (
    <View
      onLayout={e => {
        setLeftContainerWidth(e.nativeEvent.layout.width);
      }}
      style={{
        flex: 1,
        // height: catListH,
      }}>
      <FlatList
        // horizontal
        numColumns={col}
        contentContainerStyle={{
          paddingVertical: 2,
          paddingHorizontal: hPadding,
        }}
        data={formatGridData(data, col)}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        // refreshing={!loaded}
        // onRefresh={loadData}
        progressViewOffset={0}
        ListEmptyComponent={ListEmptyComponent}
      />
      <ItemModal
        toggleModal={toggleModal}
        showModal={showModal}
        data={selectedItem}
      />
    </View>
  );
}
function _Item({data, onPress, containerWidth}) {
  const dispatch = useDispatch();
  let {categories, subCategories, selectedCategory} = useProducts();

  let d = subCategories[data];
  let {price, cutPrice} = getPrice(data, '', false);
  if (!d) {
    return null;
  }

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
    justifyContent: 'space-between',
    paddingVertical: 10, //theme.hp(5),
    paddingHorizontal: 10,
    height: getPercentValue(itemSize, 50),
    borderRadius: 5,
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
      <Text
        numberOfLines={2}
        color="#111"
        medium
        size={getPercentValue(itemSize, 7.6)}
        align="left">
        {d.item_name}
      </Text>

      <Text
        color="#111"
        bold
        size={getPercentValue(itemSize, 6.7)}
        align="left">
        $ {parseFloat(price || 0).toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
}
const Item = memo(_Item);

function ItemModal({toggleModal, showModal, data}) {
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

    let added = addToCart(data.id, selectedVar, price, addons, '');

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
    <ModalContainer
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
      }}>
      {variants.map((m, i) => {
        return (
          <Variants
            key={m.id}
            selectedItems={selectedVar[m.title_id] || []}
            data={m}
            onItemPress={onItemClick}
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
          />
        );
      })}
    </ModalContainer>
  );
}
function Variants({data, selectedItems = [], onItemPress}) {
  const options = useSelector(s => s.user.options);

  if (!data.items && !data.items.length) {
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
        <Text bold size={18} style={{flex: 1}}>
          {op.variation_name}
        </Text>
        <Text size={16} color="#aaa">
          {data.required ? '(Required)' : '(Optional)'}
        </Text>
      </View>
      {!!upto && data.multiselect && (
        <Text size={14} color="#aaa">
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
        {formatGridData(data.items, modalCol).map((m, i) => {
          let opdata = op.variation_options.find(o => o.id == m.id);
          let price = m.price;
          let empty = m.empty === true;
          let size = (modalContainerW - 20) / modalCol - 2.5;
          let selected = selectedItems.includes(m.id);
          let multiselect = data.multiselect;
          let _style = {
            flexDirection: 'row',
            width: size,
            height: getPercentValue(size, 25),
            marginBottom: 5,
            backgroundColor: empty ? 'transparent' : '#ccc00000',

            borderWidth: 1,
            borderColor: empty ? 'transparent' : '#ccc',

            paddingHorizontal: 8,
            paddingVertical: 5,
            borderRadius: 4,
            alignItems: 'center',
          };
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
                  color={selected ? theme.colors.secondaryColor : '#aaa'}
                  name={selected ? 'check-square' : 'square'}
                  solid={selected}
                />
              ) : (
                <FontAwesome5Icon
                  size={16}
                  color={selected ? theme.colors.secondaryColor : '#aaa'}
                  name={selected ? 'dot-circle' : 'circle'}
                  solid={selected}
                />
              )}
              <Text
                ml={5}
                numberOfLines={2}
                size={12}
                style={{
                  flex: 1,
                }}>
                {m.title}
              </Text>
              <Text size={12} semibold>
                $ {parseFloat(price || 0).toFixed(2)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
function AddOns({data, selectedItems = [], onItemPress}) {
  let addonProductsById = useSelector(s => s.user.addonProductsById);
  if (!data.items && !data.items.length) {
    return null;
  }
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Text bold size={18} style={{flex: 1}}>
          {data.title}
        </Text>
      </View>
      <Text size={14} color="#aaa">
        {data.subtitle}
      </Text>

      <View
        style={{
          marginTop: 5,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        {formatGridData(data.items, modalCol).map((m, i) => {
          let item = addonProductsById[m];
          // let opdata = op.variation_options.find(o => o.id == m.id);
          // let price = m.price;
          let empty = m.empty === true;
          let size = (modalContainerW - 20) / modalCol - 2.5;
          let selected = selectedItems.includes(m);
          // let multiselect = data.multiselect;
          let _style = {
            flexDirection: 'row',
            width: size,
            height: getPercentValue(size, 25),
            marginBottom: 5,
            backgroundColor: empty ? 'transparent' : '#ccc00000',

            borderWidth: 1,
            borderColor: empty ? 'transparent' : '#ccc',

            paddingHorizontal: 8,
            paddingVertical: 5,
            borderRadius: 4,
            alignItems: 'center',
          };
          // console.log('[m.id] m.id', i, item);

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
                color={selected ? theme.colors.secondaryColor : '#aaa'}
                name={selected ? 'check-square' : 'square'}
                solid={selected}
              />

              <Text
                ml={5}
                numberOfLines={2}
                size={12}
                style={{
                  flex: 1,
                }}>
                {item.product_name}
              </Text>
              <Text size={12} semibold>
                + $ {parseFloat(item.product_price || 0).toFixed(2)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
