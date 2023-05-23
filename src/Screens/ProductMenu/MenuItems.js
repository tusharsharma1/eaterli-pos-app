import React, {memo, useEffect, useState} from 'react';
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
import {
  formatGridData,
  getPercentValue,
  simpleToast,
} from '../../helpers/app.helpers';
import theme from '../../theme';
import ModalContainer from '../../components/ModalContainer';
import Switch from '../../components/Controls/Switch';
import {getAddons, getVariants} from '../../helpers/order.helper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Button from '../../components/Button';
let col = 4;
let hPadding = 2;

export default function MenuItems({navigation, route}) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const selectedLocation=useSelector(s=>s.user.selectedLocation)
  let {categories} = useProducts();
  let category_id = route.params?.id;
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
    setSelectedItem(data);
    toggleModal();
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
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  let cat = categories[category_id];
  if (!cat) {
    return null;
  }
  let data = cat.menu_items || [];
  const onModifierPosStatusChange = (d, mid, v) => {
    // console.log(d, mid, v, selectedItem);
    let variants = getVariants(selectedItem);
    let items = [...d.items];
    let ind = items.findIndex(dd => mid == dd.id);
    ind != -1 && items.splice(ind, 1, {...items[ind], pos_status: v});

    let indv = variants.findIndex(dd => d.id == dd.id);
    indv != -1 && variants.splice(indv, 1, {...variants[indv], items});
    setSelectedItem({...selectedItem, variants: JSON.stringify(variants)});
  };
  const onAddOnPosStatusChange = (d, mid, v) => {
    let conf = {...d.conf, [mid]: {...d.conf?.[mid], pos_status: v}};
    let addons = getAddons(selectedItem);
    // console.log(d, mid, v);
    let indv = addons.findIndex(dd => d.id == dd.id);
    indv != -1 && addons.splice(indv, 1, {...addons[indv], conf});
    // console.log(indv, addons);
    setSelectedItem({...selectedItem, add_ons: JSON.stringify(addons)});
  };
  const onSave = async () => {
    let body = {
      pos_status: selectedItem.pos_status,
      add_ons: selectedItem.add_ons, //values.addons.map((r) => r.id).join(","),

      variants: selectedItem.variants,
    };
    let r = await dispatch(
      userAction.updateSubCategory(body, selectedItem.id, {
        showLoader: true,
      }),
    );
    if (r && r.status) {
      simpleToast(r.message);
      await dispatch(userAction.getMenus(selectedLocation));
      toggleModal();
    }
  };
  const renderEditView = () => {
    if (!selectedItem) {
      return null;
    }

    let addons = getAddons(selectedItem);

    let variants = getVariants(selectedItem);

    // console.log(variants, addons);
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
          }}>
          <Text
            style={{
              flex: 1,
            }}>
            Available for POS
          </Text>
          <Switch
            checked={selectedItem.pos_status == 1}
            onChange={e => {
              setSelectedItem({...selectedItem, pos_status: e ? 1 : 0});
            }}
          />
        </View>
        {!!variants.length && <Text bold size={18} mb={5}>
          Modifiers
        </Text>}
        {variants.map((m, i) => {
          return (
            <Variants
              key={m.id}
              // selectedItems={selectedVar[m.title_id] || []}
              data={m}
              onPosStatusChange={onModifierPosStatusChange}
              // onItemPress={onItemClick}
              //containerWidth={containerWidth}
            />
          );
        })}
       {!!addons.length && <Text mt={10} bold size={18} mb={5}>
          Add-ons
        </Text>}
        {addons.map((m, i) => {
          return (
            <AddOns
              key={m.id}
              // selectedItems={selectedVar[m.title_id] || []}
              data={m}
              onPosStatusChange={onAddOnPosStatusChange}
              // onItemPress={onItemClick}
              //containerWidth={containerWidth}
            />
          );
        })}
      </>
    );
  };

  return (
    <>
      <Header title={'Menu Items'} back />
      {/* <CategoryNav /> */}
      <Container style={{flex: 1}}>
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
      </Container>
      <ModalContainer
        // hideTitle
        center
        // noscroll
        onRequestClose={toggleModal}
        visible={showModal}
        title={'Edit'}
        width={350}
        // height={'98%'}
        // borderRadius={25}
        renderFooter={() => {
          return (
            <View
              style={{
                alignItems: 'flex-end',
              }}>
              <Button ph={30} size={14} onPress={onSave}>
                Save
              </Button>
            </View>
          );
        }}>
        {renderEditView()}
      </ModalContainer>
    </>
  );
}
function _Item({data, onPress, containerWidth = theme.wp(100)}) {
  const dispatch = useDispatch();
  const {menuItems} = useProducts();
  const _data = menuItems[data];
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
    backgroundColor: empty ? 'transparent' : '#bbb',
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
        color="#111"
        medium
        size={getPercentValue(itemSize, 6.6)}
        align="center">
        {_data.item_name}
      </Text>
    </TouchableOpacity>
  );
}
const Item = memo(_Item);
function Variants({data, onPosStatusChange}) {
  const options = useSelector(s => s.user.options);

  if (!data.items && !data.items.length) {
    return null;
  }
  let op = options.find(s => s.id == data.title_id);
  if (!op) {
    return null;
  }
  // console.log('[selectedSize] op', op);
  // let upto = parseInt(data.upto || 0);
  // let Root =
  //   modifierStyle == "style2"
  //     ? ({ children }) => {
  //         return <div className="row">{children}</div>;
  //       }
  //     : Fragment;

  return (
    <View>
      <Text bold size={16} mb={5}>
        {op.variation_name}
      </Text>

      {data.items.map((m, i) => {
        let pos_status = m.pos_status ?? true;
        let _style = {
          flexDirection: 'row',
          // width: size,
          // height: getPercentValue(size, 25),
          marginBottom: 5,
          // backgroundColor: empty ? '#00000000' : '#ccc00000',

          borderWidth: 1,
          borderColor: '#ccc',

          paddingHorizontal: 8,
          paddingVertical: 5,
          borderRadius: 4,
          alignItems: 'center',
        };

        return (
          <View key={m.id} style={_style}>
            <Text
              ml={5}
              numberOfLines={2}
              size={12}
              medium
              style={{
                flex: 1,
              }}>
              {m.title}
            </Text>
            <Switch
              checked={pos_status}
              onChange={e => {
                onPosStatusChange && onPosStatusChange(data, m.id, e);
              }}
            />
          </View>
        );
      })}
    </View>
  );
}
function AddOns({data, onPosStatusChange}) {
  let addonProductsById = useSelector(s => s.user.addonProductsById);
  if (!data.items && !data.items.length) {
    return null;
  }

  return (
    <View>
      <Text bold size={16} mb={5}>
        {data.title}
      </Text>

      {data.items.map((m, i) => {
        let item = addonProductsById[m];
        let pos_status = data.conf?.[m]?.pos_status ?? true;
        let _style = {
          flexDirection: 'row',
          // width: size,
          // height: getPercentValue(size, 25),
          marginBottom: 5,
          // backgroundColor: empty ? '#00000000' : '#ccc00000',

          borderWidth: 1,
          borderColor: '#ccc',

          paddingHorizontal: 8,
          paddingVertical: 5,
          borderRadius: 4,
          alignItems: 'center',
        };

        return (
          <View key={m.id} style={_style}>
            <Text
              ml={5}
              numberOfLines={2}
              size={12}
              medium
              style={{
                flex: 1,
              }}>
              {item.product_name}
            </Text>
            <Switch
              checked={pos_status}
              onChange={e => {
                onPosStatusChange && onPosStatusChange(data, m, e);
              }}
            />
          </View>
        );
      })}
    </View>
  );
}
