import React, {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import {TouchableOpacity, View} from 'react-native';
import Text from '../../components/Text';
import theme from '../../theme';
import {
  getAddonsTotal,
  getCartItem,
  getCartProducts,
  getGrandTotal,
  getPrice,
} from '../../helpers/order.helper';
import Container from '../../components/Container';
import orderAction from '../../redux/actions/order.action';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import alertAction from '../../redux/actions/alert.action';
import {ALERT_ICON_TYPE, ALERT_TYPE} from '../../constants/alert.constant';
import ModalContainer from '../../components/ModalContainer';
import {PAYMENT_METHOD} from '../../constants/order.constant';
import CashPaymentForm from '../../forms/CashPaymentForm';
import userAction from '../../redux/actions/user.action';
import AppProgess from '../../components/AppProgess';
import {showToast, simpleToast} from '../../helpers/app.helpers';
import TextInput from '../../components/Controls/TextInput';
import useWindowDimensions from '../../hooks/useWindowDimensions';

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
        <Text bold>Dis(%)</Text>
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
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState('');
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discount, setDiscount] = useState('');
  let menuItems = useSelector(s => s.user.menuItems);
  let selectedCartItem = useSelector(s => s.order.selectedCartItem);
  let data = useSelector(s => s.order.cart[id]);

  useEffect(() => {
    if (data) {
      setNote(data.special_ins);
      setDiscount(data.discount ?? '');
    }
  }, [data]);

  if (!data) {
    return null;
  }
  let [itemId, sizeId, addon, productMenuType] = id.split('-');
  let itemData = menuItems[itemId];
  let {price, sizeData} = getPrice(itemId, JSON.parse(sizeId));
  let add_ons = data.add_ons || [];
  let add_onsTotal = getAddonsTotal(add_ons);
  let rate = add_onsTotal + price;
  let totalPrice = rate * data.qty;
  let _discount = parseFloat(data.discount ?? 0);
  if(isNaN(_discount)){
    _discount=0
  }
  let cutPrice = totalPrice;
  if(_discount){
  totalPrice = totalPrice - totalPrice * (_discount / 100);
  }
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
  const updateNote = () => {
    dispatch(
      orderAction.set({
        _prop: 'cart',
        _subprop: id,
        values: {special_ins: note},
      }),
    );
    toggleNoteModal();
  };
  const updateDiscount = () => {
    dispatch(
      orderAction.set({
        _prop: 'cart',
        _subprop: id,
        values: {discount: discount},
      }),
    );
    toggleDiscountModal();
  };

  const toggleNoteModal = () => {
    setShowNoteModal(!showNoteModal);
  };
  const toggleDiscountModal = () => {
    setShowDiscountModal(!showDiscountModal);
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
              {_discount}%
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}>
            {!!_discount && (
              <Text
                size={size}
                medium
                style={{
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                }}>
                ${parseFloat(cutPrice).toFixed(2)}
              </Text>
            )}

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
              <View
                style={{
                  alignItems: 'center',
                  marginRight: 5,
                }}>
                <Button
                  onPress={toggleNoteModal}
                  noShadow
                  width={30}
                  height={30}
                  borderRadius={30}
                  lineHeight={28}
                  // size={24}
                  bold
                  // mr={5}
                  ph={0}
                  pv={0}>
                  <FontAwesome5Icon name="pencil-alt" size={18} />
                </Button>
                <Text medium size={9}>
                  NOTE
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  marginRight: 5,
                }}>
                <Button
                  onPress={toggleDiscountModal}
                  noShadow
                  width={30}
                  height={30}
                  borderRadius={30}
                  lineHeight={28}
                  // size={24}
                  bold
                  ph={0}
                  pv={0}>
                  <FontAwesome5Icon name="tag" size={18} />
                </Button>
                <Text medium size={9}>
                  DISCOUNT
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  marginRight: 5,
                }}>
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
                <Text medium size={9}>
                  DELETE
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <ModalContainer
        // hideTitle
        center
        // noscroll
        onRequestClose={toggleNoteModal}
        visible={showNoteModal}
        title={`Note`}
        width={350}>
        <TextInput
          textInputProps={{
            placeholder: 'Type note here',
            onChangeText: t => {
              setNote(t);
            },
            value: note,
          }}
          textStyle={{
            textAlign: 'left',
          }}
        />
        <Button onPress={updateNote}> Ok</Button>
      </ModalContainer>
      <ModalContainer
        // hideTitle
        center
        // noscroll
        onRequestClose={toggleDiscountModal}
        visible={showDiscountModal}
        title={`Discount`}
        width={350}>
        <TextInput
          textInputProps={{
            onChangeText: t => {
              setDiscount(t);
            },
            value: discount,
            keyboardType: 'numeric',
          }}
          textStyle={{
            textAlign: 'left',
          }}
        />
        <Button onPress={updateDiscount}> Ok</Button>
      </ModalContainer>
    </>
  );
}

function Footer({}) {
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState('');
  const cart = useSelector(s => s.order.cart);
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  const userData = useSelector(s => s.user.userData);
  const deviceId = useSelector(s => s.user.deviceId);
  const diningOption = useSelector(s => s.order.diningOption);

  const payModal = useSelector(s => s.order.payModal);
  useEffect(() => {
    if (!payModal.show) {
      setPaymentMethod('');
    }
  }, [payModal]);
  const toggleModal = () => {
    dispatch(
      orderAction.set({
        payModal: {show: !payModal.show, ref: ''},
      }),
    );
  };
  const onPayPress = () => {
    let products = getCartProducts();
    if (!products.length) {
      simpleToast('Add Products first.');
      return;
    }
    if (!diningOption) {
      dispatch(
        orderAction.set({
          diningOptionModal: {show: true, ref: 'pay-btn'},
        }),
      );
      return;
    }
    toggleModal();
  };

  const onDeletePress = () => {
    let products = getCartProducts();
    if (!products.length) {
      return;
    }
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
  const onCashSubmitSuccess = async values => {
    let products = getCartProducts();
    if (!products.length) {
      return;
    }
    let body = {
      products: products,
      restaurant_location_id: selectedLocation,
      restaurant_id: userData.restaurant.id,
      total,
      received_amount: values.received_amount,
      paymentMethod,
      deviceId: deviceId,
      userId: userData.user_id,
    };
    console.log(body);
    let r = await dispatch(userAction.createOrder(body));
    console.log(r);
    if (r && r.status) {
      simpleToast(r.message);
      toggleModal();
      dispatch(orderAction.set({cart: {}, diningOption: ''}));
    }
  };
  const renderView = () => {
    if (paymentMethod == PAYMENT_METHOD.cash.id) {
      return (
        <View
          style={{
            // width: '80%',
            alignSelf: 'center',
            paddingVertical: 10,
            // backgroundColor: 'red',
            alignItems: 'center',
          }}>
          <View
            style={
              {
                // flex:1
                // width: '100%',
                // backgroundColor: 'red',
              }
            }>
            <CashPaymentForm
              total={total}
              onSubmitSuccess={onCashSubmitSuccess}
            />
          </View>
        </View>
      );
    }

    return (
      <View
        style={{
          width: '60%',
          alignSelf: 'center',
          paddingVertical: 40,
          // backgroundColor: 'red',
        }}>
        <Text mb={10} bold size={22}>
          Select Payment Method
        </Text>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <PayMethodButton
            text="Cash"
            onPress={() => {
              setPaymentMethod(PAYMENT_METHOD.cash.id);
            }}
          />
          <PayMethodButton
            text="Card"
            onPress={() => {
              setPaymentMethod(PAYMENT_METHOD.card.id);
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <>
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
            onPress={onPayPress}
            backgroundColor={theme.colors.primaryColor}
            noShadow
            style={{flex: 1}}>
            Pay - ${parseFloat(total).toFixed(2)}
          </Button>
        </View>
      </View>
      <ModalContainer
        // hideTitle
        center
        // noscroll
        onRequestClose={toggleModal}
        visible={payModal.show}
        title={'Pay'}
        // widthPerc={60}
        landscapeWidth={720}
        // width={isPortrait?undefined:720} 
        // height={'98%'}
        // borderRadius={25}
        // renderFooter={() => {
        //   return (
        //     <View
        //       style={{
        //         alignItems: 'flex-end',
        //       }}>
        //       <Button ph={30} size={14} onPress={addToCartPress}>
        //         Add To Cart $ {parseFloat(totalPrice || 0).toFixed(2)}
        //       </Button>
        //     </View>
        //   );
        // }}
      >
        {renderView()}
      </ModalContainer>
    </>
  );
}

function PayMethodButton({text, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        height: 100,
        backgroundColor: '#eee',
        margin: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
      }}>
      <Text semibold size={18}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
