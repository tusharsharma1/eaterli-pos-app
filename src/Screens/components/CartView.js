import React, {memo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import {TouchableOpacity, View} from 'react-native';
import Text from '../../components/Text';
import theme from '../../theme';
import {
  getAddonsTotal,
  getCartItem,
  getGrandTotal,
  getPrice,
} from '../../helpers/order.helper';
import Container from '../../components/Container';
import orderAction from '../../redux/actions/order.action';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import alertAction from '../../redux/actions/alert.action';
import {ALERT_ICON_TYPE, ALERT_TYPE} from '../../constants/alert.constant';

// import BackIcon from '../assets/BackIcon';

function _CartView({}) {
  return (
    <>
      <View
        style={{
          backgroundColor: theme.colors.primaryColor,
          height: 50,
          paddingHorizontal: 10,
          justifyContent: 'center',
          // paddingVertical: 10,
        }}>
        <Text bold size={18} color="#fff">
          Cart
        </Text>
      </View>
      <TableHeader />
      <Container
        scroll
        style={{
          flex: 1,
        }}>
        <CartTable />
      </Container>
      <Footer />
    </>
  );
}
const CartView = memo(_CartView);
export default CartView;
function CartTable({}) {
  let cart = useSelector(s => s.order.cart);
  let Ids = getCartItem();
  return (
    <>
      {Ids.map(id => {
        return <CartRow key={id} id={id} />;
      })}
    </>
  );
}
function TableHeader({}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
      }}>
      <View
        style={{
          flex: 2,
        }}>
        <Text bold>Product</Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'flex-end',
        }}>
        <Text bold>Qty</Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'flex-end',
        }}>
        <Text bold>Rate</Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'flex-end',
        }}>
        <Text bold>Total</Text>
      </View>
    </View>
  );
}
function CartRow({id}) {
  const dispatch = useDispatch();
  let subCategories = useSelector(s => s.user.subCategories);
  let selectedCartItem = useSelector(s => s.order.selectedCartItem);
  let data = useSelector(s => s.order.cart[id]);

  if (!data) {
    return null;
  }
  let [itemId, sizeId, addon, productMenuType] = id.split('-');
  let itemData = subCategories[itemId];
  let {price, sizeData} = getPrice(itemId, JSON.parse(sizeId));
  let add_ons = data.add_ons || [];
  let add_onsTotal = getAddonsTotal(add_ons);
  let rate = add_onsTotal + price;
  let totalPrice = rate * data.qty;
  // console.log(itemData.item_name, price, itemId, sizeId);
  const onDeletePress = () => {
    dispatch(
      alertAction.showAlert({
        type: ALERT_TYPE.CONFIRM,
        icon: ALERT_ICON_TYPE.CONFIRM,
        text: 'Do you want to remove?',
        heading: 'Confirmation',
        positiveText: 'Yes, remove',
        onPositivePress: () => {
          let cart = {...React.store.getState().order.cart};
          delete cart[id];

          dispatch(orderAction.set({cart}));
        },
      }),
    );
  };
  const onMinusPress = () => {
    if (data.qty > 1) {
      dispatch(
        orderAction.set({
          _prop: 'cart',
          _subprop: id,
          values: {qty: data.qty - 1},
        }),
      );
    }
  };
  const onAddPress = () => {
    dispatch(
      orderAction.set({
        _prop: 'cart',
        _subprop: id,
        values: {qty: data.qty + 1},
      }),
    );
  };

  if (!itemData) {
    return null;
  }
  if (itemData.out_of_stock == '1') return null;
  let selected = selectedCartItem == id;
  let size = 12;
  return (
    <>
      <View
        style={{
          backgroundColor: selected ? '#e5acb5' : '#ccc',
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderBottomColor: '#aaa',
          borderBottomWidth: 1,
        }}>
        <TouchableOpacity
          onPress={() => {
            dispatch(
              orderAction.set({
                selectedCartItem: selected ? '' : id,
              }),
            );
          }}
          style={{
            flexDirection: 'row',
            // backgroundColor: selected?'#e5acb5':'#ccc',
            // paddingHorizontal: 10,
            // paddingVertical: 5,
            // borderBottomColor: '#ccc',
            // borderBottomWidth: 1,
          }}>
          <View
            style={{
              flex: 2,
            }}>
            <Text medium>{itemData.item_name}</Text>
            {!!sizeData.length && (
              <Text color="#666" size={12}>
                {sizeData.map(r => r.title).join(', ')}
              </Text>
            )}
            {!!add_ons.length && (
              <Text color="#666" size={12}>
                {add_ons.map(r => r.product_name).join(', ')}
              </Text>
            )}
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}>
            <Text size={size} medium>
              {data.qty}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}>
            <Text size={size} medium>
              ${parseFloat(rate).toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}>
            <Text size={size} medium>
              ${parseFloat(totalPrice).toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>
        {selected && (
          <View
            style={{
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Button
                  onPress={onMinusPress}
                  noShadow
                  width={30}
                  height={30}
                  borderRadius={30}
                  lineHeight={28}
                  size={24}
                  bold
                  ph={0}
                  pv={0}>
                  -
                </Button>
                <Text
                  ml={5}
                  style={{minWidth: 45}}
                  backgroundColor={'#eeeeee67'}
                  align="center"
                  semibold
                  size={18}
                  mr={5}>
                  {data.qty}
                </Text>
                <Button
                  onPress={onAddPress}
                  noShadow
                  width={30}
                  height={30}
                  borderRadius={30}
                  lineHeight={28}
                  size={24}
                  bold
                  ph={0}
                  pv={0}>
                  +
                </Button>
              </View>
              <Button
                onPress={onDeletePress}
                noShadow
                width={30}
                height={30}
                borderRadius={30}
                lineHeight={28}
                // size={24}
                bold
                ph={0}
                pv={0}>
                <FontAwesome5Icon name="trash" size={18} />
              </Button>
            </View>
          </View>
        )}
      </View>
    </>
  );
}

function Footer({}) {
  const dispatch = useDispatch();
  const cart = useSelector(s => s.order.cart);
  const onDeletePress = () => {
    dispatch(
      alertAction.showAlert({
        type: ALERT_TYPE.CONFIRM,
        icon: ALERT_ICON_TYPE.CONFIRM,
        text: 'Do you want to delete cart?',
        heading: 'Confirmation',
        positiveText: 'Yes, delete',
        onPositivePress: () => {
          dispatch(orderAction.set({cart: {}}));
        },
      }),
    );
  };
  let total = getGrandTotal();
  return (
    <View
      style={{
        // backgroundColor: theme.colors.primaryColor,
        // height: 50,
        paddingHorizontal: 10,
        justifyContent: 'center',
        paddingVertical: 10,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Button
          onPress={onDeletePress}
          noShadow
          backgroundColor={theme.colors.dangerColor}
          mr={5}>
          Delete
        </Button>
        <Button
          backgroundColor={theme.colors.primaryColor}
          noShadow
          style={{flex: 1}}>
          Pay - ${parseFloat(total).toFixed(2)}
        </Button>
      </View>
    </View>
  );
}
