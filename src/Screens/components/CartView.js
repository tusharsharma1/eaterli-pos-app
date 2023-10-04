import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  View,
  TextInput as _TextInput,
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import Button from '../../components/Button';
import Container from '../../components/Container';
import TextInput from '../../components/Controls/TextInput';
import ModalContainer from '../../components/ModalContainer';
import Text from '../../components/Text';
import {ALERT_ICON_TYPE, ALERT_TYPE} from '../../constants/alert.constant';
import {
  CART_MODAL_VIEW,
  CUSTOMER_DETAIL,
  DEFAULT_TAX_TITLE,
  ORDER_ITEM_TYPE,
  PAYMENT_METHOD,
} from '../../constants/order.constant';
import CashPaymentForm from '../../forms/CashPaymentForm';
import {
  getPercentValue,
  showToast,
  simpleToast,
} from '../../helpers/app.helpers';
import {
  breakCartItemID,
  getAddonsTotal,
  getCartItem,
  getCartProducts,
  getGrandTotal,
  getOrderItemDetails,
  getPrice,
} from '../../helpers/order.helper';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import alertAction from '../../redux/actions/alert.action';
import orderAction from '../../redux/actions/order.action';
import userAction from '../../redux/actions/user.action';
import theme from '../../theme';
import Select from '../../components/Controls/Select';
import {MenuProvider} from 'react-native-popup-menu';
import SelectRadio from '../../components/Controls/SelectRadio';
import DiscountModal from './DiscountModal';

const Buffer = require('buffer').Buffer;
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
  let Ids = getCartItem(cart);
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
        <Text bold>Dis.</Text>
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
  let menuItems = useSelector(s => s.user.menuItems);
  let selectedCartItem = useSelector(s => s.order.selectedCartItem);
  let data = useSelector(s => s.order.cart[id]);

  useEffect(() => {
    if (data) {
      setNote(data.special_ins);
    }
  }, [data]);

  if (!data) {
    return null;
  }

  let {itemtype, itemId, sizeId, addon, productMenuType} = breakCartItemID(id);

  let itemData = menuItems[itemId];

  let {price, sizeData} = getPrice(itemId, JSON.parse(sizeId));
  if (!price) {
    price = data.price;
  }
  if (!itemData) {
    itemData = getOrderItemDetails(id, data);
  }

  let add_ons = data.add_ons || [];
  let add_onsTotal = getAddonsTotal(add_ons);
  let rate = add_onsTotal + price;
  let totalPrice = rate * data.qty;
  let subPrice = totalPrice;
  let discount_type = data.discount_type ?? '1';
  let _discount = parseFloat(data.discount ?? 0);
  if (isNaN(_discount)) {
    _discount = 0;
  }

  if (_discount) {
    if (discount_type == '1') {
      totalPrice = totalPrice - totalPrice * (_discount / 100);
    } else if (discount_type == '2') {
      totalPrice = totalPrice - _discount;
    }
  }
  // console.log(data);
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
  const updateDiscount = discountValues => {
    dispatch(
      orderAction.set({
        _prop: 'cart',
        _subprop: id,
        values: {
          ...discountValues,
        },
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
  console.log('cccccc', itemtype,itemData, data,);
  if (!itemData) {
    return null;
  }
  if (itemData.out_of_stock == '1') return null;
  if (
    itemtype == ORDER_ITEM_TYPE.offer.id &&
    data?.offerData?.offer_type != '1'
  ) {
    return null;
  }

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
            {!!sizeData?.length && (
              <Text color="#666" size={12}>
                {sizeData.map(r => r.title).join(', ')}
              </Text>
            )}
            {!!add_ons?.length && (
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
              {discount_type == '2' && '$'}
              {_discount}
              {discount_type == '1' && '%'}
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
                ${parseFloat(subPrice).toFixed(2)}
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
              {itemtype == ORDER_ITEM_TYPE.menu.id ? (
                <>
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
                </>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}></View>
              )}
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

      <DiscountModal
        data={data}
        subPrice={subPrice}
        visible={showDiscountModal}
        title={`Discount`}
        width={350}
        onRequestClose={toggleDiscountModal}
        onUpdatePress={updateDiscount}
      />
    </>
  );
}
const TEST_ORDATA = ''; //WzI3NSw3XQ== customer QR
//WyJnaWZ0LWNhcmQiLDE3LDI3NSw3XQ== //gift card

function Footer({}) {
  const dispatch = useDispatch();
  const [modalView, setModalView] = useState(
    CART_MODAL_VIEW.reward_question.id,
  );
  const [paymentMethod, setPaymentMethod] = useState('');

  const [existCustomer, setExistCustomer] = useState(false);
  const [loyalityProgram, setLoyalityProgram] = useState(false);
  const {height, width} = useWindowDimensions();
  const cart = useSelector(s => s.order.cart);
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  const userData = useSelector(s => s.user.userData);
  const deviceId = useSelector(s => s.user.deviceId);
  const diningOption = useSelector(s => s.order.diningOption);
  const customerDetail = useSelector(s => s.order.customerDetail);
  const payModal = useSelector(s => s.order.payModal);
  const [QRDataScaning, setQRDataScaning] = useState(false); //
  const [QRData, setQRData] = useState(TEST_ORDATA); //WzI3NSw3XQ==
  //WyJnaWZ0LWNhcmQiLDE3LDI3NSw3XQ== //gift card
  const [splitNo, setSplitNo] = useState(2);
  const [splitPayments, setSplitPayments] = useState([]);
  const [selectedSplitAmtRow, setSelectedSplitAmtRow] = useState(0);
  const [splitPayment, setSplitPayment] = useState(false);
  const [splitPaymentBy, setSplitPaymentBy] = useState(1);
  const [totalSplitBills, setTotalSplitBills] = useState(2);

  const [giftCardID, setGiftCardId] = useState(0);
  const [giftCardBalance, setGiftCardBalance] = useState(0);
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  const [discountValues, setDiscountValues] = useState({
    discount: 0,
    discount_type: '1',
    discount_reason: '',
  });

  const splitBills = useSelector(s => s.order.splitBills);

  const location = userData.locations.find(s => s.id == selectedLocation);

  let offerDiscount = useMemo(() => {
    let findId = Object.keys(cart).find(d => {
      let {itemtype, itemId, sizeId, addon, productMenuType} =
        breakCartItemID(d);

      return (
        itemtype == ORDER_ITEM_TYPE.offer.id &&
        cart[d]?.offerData?.offer_type == '0'
      );
    });

    return cart[findId];
  }, [cart]);

  let tax_title = location?.tax_title || DEFAULT_TAX_TITLE;

  let tax_per = location?.tax ? parseFloat(location.tax) : 0;

  let sub_total = getGrandTotal();
  let tax_amt = (sub_total * tax_per) / 100;
  let tax_total = tax_amt + sub_total;
  let total = tax_total;

  let discount_type = discountValues.discount_type ?? '1';
  let _discount = parseFloat(discountValues.discount ?? 0);
  if (isNaN(_discount)) {
    _discount = 0;
  }

  if (_discount) {
    if (discount_type == '1') {
      total = total - total * (_discount / 100);
    } else if (discount_type == '2') {
      total = total - _discount;
    }
  }

  let offer_discount_type = offerDiscount?.offerData?.discount_type ?? '1';
  let _offer_discount = parseFloat(offerDiscount?.offerData?.discount ?? 0);
  if (isNaN(_offer_discount)) {
    _offer_discount = 0;
  }

  if (_offer_discount) {
    if (offer_discount_type == '1') {
      total = total - total * (_offer_discount / 100);
    } else if (offer_discount_type == '2') {
      total = total - _offer_discount;
    }
  }

  useEffect(() => {
    if (!payModal.show) {
      setPaymentMethod('');
      dispatch(orderAction.set({customerDetail: CUSTOMER_DETAIL}));
      setModalView(CART_MODAL_VIEW.reward_question.id);

      setSplitNo(2);
      genarateSplitPayments(2, true);
      setSplitPayment(false);
      setSplitPaymentBy(1);
      setTotalSplitBills(2);
      genarateSplitPaymentsBill(2, true);
    }
  }, [payModal]);

  useEffect(() => {
    if (QRDataScaning) {
      setQRDataScaning(false);

      customerDetailNextPress();
    }
  }, [customerDetail]);

  useEffect(() => {
    genarateSplitPayments(splitNo);
  }, [splitNo, total]);

  useEffect(() => {
    let allPaid = splitPayments.every(d => d.paid);
    // console.log('call',allPaid);
    if (
      modalView == CART_MODAL_VIEW.split_payment.id &&
      splitPaymentBy == 1 &&
      allPaid
    ) {
      // console.log('call', splitPayments);
      let received_amount = getSptilReceivedAmt(splitPayments);
      onCashSubmitSuccess({received_amount: received_amount});
    }
  }, [splitPayments, splitPaymentBy, modalView]);

  useEffect(() => {
    genarateSplitPaymentsBill(totalSplitBills);
  }, [totalSplitBills]);
  const genarateSplitPaymentsBill = (_totalSplitBills = 2, refresh = false) => {
    let spmts = Array.from(Array(_totalSplitBills)).map((r, i) => {
      if (refresh) {
        return {
          cart: {},
        };
      }

      return (
        splitBills[i] || {
          cart: {},
        }
      );
    });

    dispatch(orderAction.set({splitBills: spmts}));
  };
  const genarateSplitPayments = (_splitNo = 2, refresh = false) => {
    let paidTotal = splitPayments.reduce((s, r) => {
      if (r.paid) {
        return s + 1;
      }
      return s;
    }, 0);
    let paidTotalAmt = getSplitPaidTotal();
    //  splitPayments.reduce((s, r) => {
    //   if (r.paid) {
    //     return s + (parseFloat(r.amount) || 0);
    //   }
    //   return s;
    // }, 0);
    if (refresh) {
      paidTotalAmt = 0;
      paidTotal = 0;
    }
    console.log('yyyyy', total, paidTotalAmt, _splitNo, paidTotal);
    let perUser = ((total - paidTotalAmt) / (_splitNo - paidTotal)).toFixed(2);

    let spmts = Array.from(Array(_splitNo)).map((r, i) => {
      if (refresh) {
        return {
          type: 'cash',
          paid: false,
          amount: perUser,
          received_amount: 0,
        };
      }

      return {
        ...(splitPayments[i] ?? {}),
        type: splitPayments[i]?.type || 'cash',
        paid: splitPayments[i]?.paid ?? false,
        amount: splitPayments[i]?.paid
          ? splitPayments[i]?.amount ?? '00.00'
          : perUser,
        received_amount: splitPayments[i]?.received_amount ?? 0,
      };
    });

    let rma = getSplitRemainingAmt(spmts);
    console.log('sssssss', rma);
    if (rma != 0) {
      let index = spmts.findIndex(r => {
        return !r.paid;
      });
      index != -1 &&
        spmts.splice(index, 1, {
          ...spmts[index],
          amount: (parseFloat(spmts[index].amount) + rma).toFixed(2),
        });
    }

    setSplitPayments(spmts);
  };

  const toggleModal = () => {
    dispatch(
      orderAction.set({
        payModal: {show: !payModal.show, ref: ''},
      }),
    );
  };
  const validateCutomerDetail = () => {
    return new Promise(async res => {
      const validationSchema = yup.object({
        firstName: yup.string().trim().required('Enter First Name'),
        lastName: yup.string().trim(),
        phoneNo: yup
          .string()
          .min(14, 'Invalid Phone No.')
          .required('Enter Phone No.'),
        email: yup.string().email('Invalid Email'),
      });
      const validate = await validationSchema
        .validate(customerDetail)
        .catch(err => {
          console.log(err);
          simpleToast(err.message);
          setModalView(CART_MODAL_VIEW.customer_phone.id);
        });
      res(!!validate);
    });
  };

  const validateCutomerPhoneNo = () => {
    return new Promise(async res => {
      const validationSchema = yup.object({
        phoneNo: yup
          .string()
          .min(14, 'Invalid Phone No.')
          .required('Enter Phone No.'),
      });
      const validate = await validationSchema
        .validate(customerDetail)
        .catch(err => {
          console.log(err);
          simpleToast(err.message);
          setModalView(CART_MODAL_VIEW.customer_phone.id);
        });
      res(!!validate);
    });
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

  const onCashSubmitSuccess = async values => {
    let products = getCartProducts();
    if (!products.length) {
      simpleToast('No Product Added.');
      return;
    }

    if (parseFloat(total) > parseFloat(values.received_amount)) {
      // console.log('success no');

      simpleToast('Received amount is not valid.');
      return;
    }

    let body = {
      products: products,
      restaurant_location_id: selectedLocation,
      restaurant_id: userData.restaurant.id,
      // total,

      sub_total: sub_total.toFixed(2),
      order_total: total.toFixed(2),
      tax_per: tax_per,
      tax_amt: tax_amt,
      tax_title: tax_title,

      received_amount: values.received_amount,
      paymentMethod: splitPayment
        ? PAYMENT_METHOD.split_payment.id
        : paymentMethod,
      deviceId: deviceId,
      userId: userData.user_id,

      existCustomer,
      loyalityProgram,
      diningOption,

      split_payments: splitPayment ? JSON.stringify(splitPayments) : '[]',
      gift_card_id: giftCardID,
      // paymentMethod:PAYMENT_METHOD.gift_card.id,
      ...customerDetail,
      ...discountValues,
    };

    console.log(body);
    // return;
    let r = await dispatch(userAction.createOrder(body));
    console.log(r);
    if (r && r.status) {
      simpleToast(r.message);
      toggleModal();
      setDiscountValues({
        discount: 0,
        discount_type: '1',
        discount_reason: '',
      });
      dispatch(
        orderAction.set({
          cart: {},
          diningOption: '',
          customerDetail: CUSTOMER_DETAIL,
        }),
      );
    }
  };

  const QRValidating = async () => {
    if (QRData) {
      let jsonob = null;
      // console.log(QRData);
      try {
        let json = Buffer.from(QRData, 'base64').toString('utf8');

        console.log(json);
        jsonob = JSON.parse(json);
      } catch {
        jsonob = null;
      }
      jsonob = jsonob || [];
      let [type, id, rid] = jsonob;
      // console.log(id, rid);
      if (
        jsonob &&
        type == 'my-qr' &&
        id &&
        rid &&
        rid == userData.restaurant.id
      ) {
        // console.log(jsonob);
        let r = await dispatch(userAction.getCustomerDetail(rid, id));
        if (r && r.status) {
          if (!r.data) {
            simpleToast('Invalid QR Code.');
            setQRData('');
            return;
          }

          dispatch(
            orderAction.set({
              customerDetail: {
                phoneNo: r.data.phone || '',
                email: r.data.email || '',
                firstName: r.data.first_name || '',
                lastName: r.data.last_name || '',
              },
            }),
          );

          // setModalView(CART_MODAL_VIEW.customer_phone.id);
        } else {
          simpleToast('Invalid QR Code.');
          setQRData('');
          // setQRData({error: true, message: 'Invalid QR Code.'});
        }
      } else {
        simpleToast('Invalid QR Code.');
        setQRData('');
      }
      // setValidating(false);
    }
  };

  const giftCardQRValidating = async () => {
    if (QRData) {
      let jsonob = null;
      // console.log(QRData);
      try {
        let json = Buffer.from(QRData, 'base64').toString('utf8');

        console.log(json);
        jsonob = JSON.parse(json);
      } catch {
        jsonob = null;
      }
      jsonob = jsonob || [];
      let [type, card_id, uid, rid] = jsonob;
      // console.log(id, rid);
      if (
        jsonob &&
        card_id &&
        rid &&
        rid == userData.restaurant.id &&
        type == 'gift-card'
      ) {
        // console.log(jsonob);
        let r = await dispatch(userAction.getGiftCardBalance(rid, card_id));
        if (r && r.status) {
          if (!r.data) {
            simpleToast('Invalid QR Code.');
            setQRData('');
            return;
          }
          setGiftCardId(card_id);
          setGiftCardBalance(r.data.total_balance || 0);
          // console.log(card_id,r.data.total_balance)
          // setModalView(CART_MODAL_VIEW.customer_phone.id);
        } else {
          simpleToast('Invalid QR Code.');
          setQRData('');
          // setQRData({error: true, message: 'Invalid QR Code.'});
        }
      } else {
        simpleToast('Invalid QR Code.');
        setQRData('');
      }
      // setValidating(false);
    }
  };

  const customerDetailNextPress = async () => {
    if (loyalityProgram) {
      let validate = await validateCutomerDetail();
      if (!validate) {
        return;
      }

      setModalView(CART_MODAL_VIEW.payment_method.id);
      return;
    }

    if (existCustomer) {
      let validate = await validateCutomerPhoneNo();
      if (!validate) {
        return;
      }
      Keyboard.dismiss();
      let r = await dispatch(
        userAction.getCustomerDetailPhoneNo(
          userData.restaurant.id,
          customerDetail.phoneNo,
        ),
      );
      if (r && r.status && r.data) {
        // console.log('eeee',r.data.phone )

        dispatch(
          orderAction.set({
            customerDetail: {
              phoneNo: r.data.phone || '',
              email: r.data.email || '',
              firstName: r.data.first_name || '',
              lastName: r.data.last_name || '',
            },
          }),
        );
      } else {
        simpleToast('Phone No. does not exist.');
        return;
      }
      // return;

      setModalView(CART_MODAL_VIEW.payment_method.id);
    } else {
      setModalView(CART_MODAL_VIEW.loyality.id);
    }
  };
  const getSplitPaidTotal = () => {
    let _total = splitPayments.reduce((s, r) => {
      if (r.paid) {
        return s + (parseFloat(r.amount) || 0);
      }
      return s;
    }, 0);
    return _total;
  };
  const getSplitTotal = _splitPayments => {
    let _total = _splitPayments.reduce((s, r) => {
      return s + (parseFloat(r.amount) || 0);
    }, 0);
    return _total;
  };

  const getSptilReceivedAmt = _splitPayments => {
    let received_amount = _splitPayments.reduce((s, r) => {
      return s + (parseFloat(r.received_amount) || 0);
    }, 0);
    return received_amount;
  };

  const getSplitRemainingAmt = _splitPayments => {
    let _total = getSplitTotal(_splitPayments);

    let remaining_amount = parseFloat(total) - parseFloat(_total);
    if (!isFinite(remaining_amount)) {
      remaining_amount = 0;
    }
    remaining_amount = parseFloat(remaining_amount.toFixed(2));
    return remaining_amount;
  };
  const renderView = () => {
    switch (modalView) {
      case CART_MODAL_VIEW.reward_question.id:
        return (
          <View
            style={{
              width: '60%',
              alignSelf: 'center',
              paddingVertical: 40,
              // backgroundColor: 'red',
            }}>
            <Text mb={10} bold size={22}>
              Existing Rewards Customer?
            </Text>

            <View
              style={{
                flexDirection: 'row',
              }}>
              <PayMethodButton
                text="Yes"
                onPress={() => {
                  setExistCustomer(true);
                  setModalView(CART_MODAL_VIEW.customer_phone.id);
                }}
              />
              <PayMethodButton
                text="No"
                onPress={() => {
                  setExistCustomer(false);
                  setModalView(CART_MODAL_VIEW.loyality.id);

                  // setPaymentMethod(PAYMENT_METHOD.card.id);
                }}
              />
            </View>
          </View>
        );
      case CART_MODAL_VIEW.customer_phone.id:
        return (
          <>
            <Button
              onPress={() => {
                if (loyalityProgram) {
                  setModalView(CART_MODAL_VIEW.loyality.id);
                  return;
                }

                dispatch(orderAction.set({customerDetail: CUSTOMER_DETAIL}));
                setModalView(CART_MODAL_VIEW.reward_question.id);
              }}
              style={{
                alignSelf: 'flex-start',
              }}>
              Back
            </Button>
            <View
              style={{
                width: '60%',
                alignSelf: 'center',
                paddingVertical: 10,
                // backgroundColor: 'red',
              }}>
              {existCustomer ? (
                <>
                  <Text mb={10} bold size={22}>
                    Customer Phone No.
                  </Text>
                  <TextInput
                    // title="Customer Phone No."
                    textInputProps={{
                      onChangeText: d => {
                        dispatch(
                          orderAction.set({
                            _prop: 'customerDetail',
                            values: {phoneNo: d},
                          }),
                        );
                      },
                      // onBlur: props.handleBlur('email'),
                      value: customerDetail.phoneNo,

                      autoCapitalize: 'none',
                      returnKeyType: 'next',
                      placeholder: 'Phone No.',
                      //  onSubmitEditing: () => this.passwordInput.focus(),
                      //ref: r => (this.emailInput = r),
                      type: 'custom',
                      options: {
                        mask: '(999) 999-9999',
                      },
                    }}
                    // error={
                    //   props.errors.email && props.touched.email
                    //     ? props.errors.email
                    //     : ''
                    // }
                    // round
                  />
                </>
              ) : (
                <>
                  <Text mb={10} bold size={22}>
                    Customer Details
                  </Text>
                  <TextInput
                    // title="Customer Phone No."
                    textInputProps={{
                      onChangeText: d => {
                        dispatch(
                          orderAction.set({
                            _prop: 'customerDetail',
                            values: {firstName: d},
                          }),
                        );
                      },
                      // onBlur: props.handleBlur('email'),
                      value: customerDetail.firstName,
                      // keyboardType: 'email-address',
                      // autoCompleteType: 'email',
                      // autoCapitalize: 'none',
                      // returnKeyType: 'next',
                      placeholder: 'First Name',
                      //  onSubmitEditing: () => this.passwordInput.focus(),
                      //ref: r => (this.emailInput = r),
                    }}
                    // error={
                    //   props.errors.email && props.touched.email
                    //     ? props.errors.email
                    //     : ''
                    // }
                    // round
                  />
                  <TextInput
                    // title="Customer Phone No."
                    textInputProps={{
                      onChangeText: d => {
                        dispatch(
                          orderAction.set({
                            _prop: 'customerDetail',
                            values: {lastName: d},
                          }),
                        );
                      },
                      // onBlur: props.handleBlur('email'),
                      value: customerDetail.lastName,
                      // keyboardType: 'email-address',
                      // autoCompleteType: 'email',
                      // autoCapitalize: 'none',
                      // returnKeyType: 'next',
                      placeholder: 'Last Name',
                      //  onSubmitEditing: () => this.passwordInput.focus(),
                      //ref: r => (this.emailInput = r),
                    }}
                    // error={
                    //   props.errors.email && props.touched.email
                    //     ? props.errors.email
                    //     : ''
                    // }
                    // round
                  />
                  <TextInput
                    // title="Customer Phone No."
                    textInputProps={{
                      onChangeText: d => {
                        dispatch(
                          orderAction.set({
                            _prop: 'customerDetail',
                            values: {email: d},
                          }),
                        );
                      },
                      // onBlur: props.handleBlur('email'),
                      value: customerDetail.email,
                      keyboardType: 'email-address',
                      autoCompleteType: 'email',
                      autoCapitalize: 'none',
                      returnKeyType: 'next',
                      placeholder: 'Email',
                      //  onSubmitEditing: () => this.passwordInput.focus(),
                      //ref: r => (this.emailInput = r),
                    }}
                    // error={
                    //   props.errors.email && props.touched.email
                    //     ? props.errors.email
                    //     : ''
                    // }
                    // round
                  />
                  <TextInput
                    // title="Customer Phone No."
                    textInputProps={{
                      onChangeText: d => {
                        dispatch(
                          orderAction.set({
                            _prop: 'customerDetail',
                            values: {phoneNo: d},
                          }),
                        );
                      },
                      // onBlur: props.handleBlur('email'),
                      value: customerDetail.phoneNo,

                      autoCapitalize: 'none',
                      returnKeyType: 'next',
                      placeholder: 'Phone No.',
                      //  onSubmitEditing: () => this.passwordInput.focus(),
                      //ref: r => (this.emailInput = r),
                      type: 'custom',
                      options: {
                        mask: '(999) 999-9999',
                      },
                    }}
                    // error={
                    //   props.errors.email && props.touched.email
                    //     ? props.errors.email
                    //     : ''
                    // }
                    // round
                  />
                </>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                }}>
                <Button
                  // mt={10}
                  onPress={async () => {
                    setQRDataScaning(true);
                    setQRData(TEST_ORDATA);
                    setModalView(CART_MODAL_VIEW.scan_qr.id);
                  }}
                  ph={40}
                  backgroundColor={theme.colors.primaryColor}
                  style={
                    {
                      // alignSelf: 'center',
                    }
                  }>
                  Scan QR
                </Button>
                <Button
                  onPress={customerDetailNextPress}
                  ph={40}
                  ml={10}
                  style={
                    {
                      // alignSelf: 'center',
                    }
                  }>
                  Next
                </Button>
              </View>
            </View>
          </>
        );
      case CART_MODAL_VIEW.scan_qr.id:
        //  if (device == null) return null;
        return (
          <>
            <Button
              mb={10}
              onPress={() => {
                setModalView(CART_MODAL_VIEW.customer_phone.id);
              }}
              style={{
                alignSelf: 'flex-start',
              }}>
              Back
            </Button>
            <View
              style={{
                width: '100%',
                height: getPercentValue(height, 60),
                alignItems: 'center',
                justifyContent: 'center',
                // paddingVertical: 10,
                // backgroundColor: 'red',
              }}>
              <View
                style={{
                  position: 'absolute',
                  zIndex: 1,
                }}>
                <ActivityIndicator size={'large'} />
                <Text>Scanning...</Text>
              </View>
              <_TextInput
                style={{
                  backgroundColor: '#000000',
                  color: '#00000000',
                  opacity: 0.1,
                  width: '100%',
                  height: '100%',
                  zIndex: 2,
                  textAlignVertical: 'top',
                }}
                caretHidden
                selectionColor={'#00000000'}
                autoFocus
                showSoftInputOnFocus={!!TEST_ORDATA}
                returnKeyType="next"
                value={QRData}
                onChangeText={t => {
                  setQRData(t);
                }}
                onSubmitEditing={() => {
                  QRValidating();
                }}
              />
            </View>
          </>
        );
      case CART_MODAL_VIEW.loyality.id:
        return (
          <>
            <Button
              onPress={() => {
                setLoyalityProgram(false);
                setModalView(CART_MODAL_VIEW.reward_question.id);
              }}
              style={{
                alignSelf: 'flex-start',
              }}>
              Back
            </Button>
            <View
              style={{
                width: '60%',
                alignSelf: 'center',
                paddingVertical: 40,
                // backgroundColor: 'red',
              }}>
              <Text mb={10} bold size={22}>
                Would you like to add this customer to our the Rewards Program?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                }}>
                <PayMethodButton
                  text="Yes"
                  onPress={async () => {
                    setLoyalityProgram(true);

                    // let validate = await validateCutomerDetail();
                    // if (!validate) {
                    setModalView(CART_MODAL_VIEW.customer_phone.id);
                    //   return;
                    // }

                    // setModalView(CART_MODAL_VIEW.payment_method.id);
                  }}
                />
                <PayMethodButton
                  text="No"
                  onPress={() => {
                    setLoyalityProgram(false);
                    dispatch(
                      orderAction.set({customerDetail: CUSTOMER_DETAIL}),
                    );
                    setModalView(CART_MODAL_VIEW.payment_method.id);
                  }}
                />
              </View>
            </View>
          </>
        );
      case CART_MODAL_VIEW.ask_split_payment.id:
        return (
          <>
            <Button
              onPress={() => {
                if (existCustomer || loyalityProgram) {
                  setModalView(CART_MODAL_VIEW.customer_phone.id);
                  return;
                }

                setModalView(CART_MODAL_VIEW.loyality.id);
              }}
              style={{
                alignSelf: 'flex-start',
              }}>
              Back
            </Button>

            <View
              style={{
                width: '70%',
                alignSelf: 'center',
                paddingVertical: 40,
                // backgroundColor: 'red',
              }}>
              {!!customerDetail?.phoneNo &&
                !!(customerDetail?.firstName || customerDetail?.lastName) && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 15,
                    }}>
                    <Text medium size={20} mr={10}>
                      Reward Member :{' '}
                      <Text
                        // mb={10}
                        style={{
                          textTransform: 'capitalize',
                        }}
                        semibold
                        size={20}>
                        {customerDetail?.firstName} {customerDetail?.lastName}
                      </Text>
                    </Text>
                    <FontAwesome5Icon
                      size={20}
                      color={theme.colors.successColor}
                      name="check-circle"
                      solid
                    />
                  </View>
                )}

              <Text mb={10} bold size={22}>
                Would like to split payment?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                }}>
                <PayMethodButton
                  text="Yes"
                  onPress={() => {
                    setSplitPayment(true);
                    setModalView(CART_MODAL_VIEW.split_payment.id);
                  }}
                />
                <PayMethodButton
                  text="No"
                  onPress={() => {
                    setSplitPayment(false);
                    setModalView(CART_MODAL_VIEW.payment_method.id);
                  }}
                />
              </View>
            </View>
          </>
        );

      case CART_MODAL_VIEW.payment_method.id:
        return (
          <>
            <Button
              onPress={() => {
                if (existCustomer || loyalityProgram) {
                  setModalView(CART_MODAL_VIEW.customer_phone.id);
                  return;
                }

                setModalView(CART_MODAL_VIEW.loyality.id);
                // if (splitPayment) {
                //   setModalView(CART_MODAL_VIEW.split_payment.id);
                //   return;
                // }

                // setModalView(CART_MODAL_VIEW.ask_split_payment.id);
              }}
              style={{
                alignSelf: 'flex-start',
              }}>
              Back
            </Button>

            <View
              style={{
                width: '70%',
                alignSelf: 'center',
                paddingVertical: 40,
                // backgroundColor: 'red',
              }}>
              {!!customerDetail?.phoneNo &&
                !!(customerDetail?.firstName || customerDetail?.lastName) && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 15,
                    }}>
                    <Text medium size={20} mr={10}>
                      Reward Member :{' '}
                      <Text
                        // mb={10}
                        style={{
                          textTransform: 'capitalize',
                        }}
                        semibold
                        size={20}>
                        {customerDetail?.firstName} {customerDetail?.lastName}
                      </Text>
                    </Text>
                    <FontAwesome5Icon
                      size={20}
                      color={theme.colors.successColor}
                      name="check-circle"
                      solid
                    />
                  </View>
                )}

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
                    setModalView(CART_MODAL_VIEW.price_calc.id);
                  }}
                />
                <PayMethodButton
                  text="Gift Card"
                  onPress={() => {
                    setGiftCardId(0);
                    setGiftCardBalance(0);
                    setQRData(TEST_ORDATA);
                    setPaymentMethod(PAYMENT_METHOD.gift_card.id);
                    setModalView(CART_MODAL_VIEW.scan_gift_card.id);
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
          </>
        );
      case CART_MODAL_VIEW.scan_gift_card.id:
        //  if (device == null) return null;
        let gcdebitAmt = splitPayment
          ? splitPayments[selectedSplitAmtRow]?.amount || 0
          : total;
        let lessBalance = parseFloat(giftCardBalance) < parseFloat(total);
        return (
          <>
            <Button
              mb={10}
              onPress={() => {
                if (splitPayment) {
                  setModalView(CART_MODAL_VIEW.split_payment.id);
                  return;
                }

                setModalView(CART_MODAL_VIEW.payment_method.id);
              }}
              style={{
                alignSelf: 'flex-start',
              }}>
              Back
            </Button>

            {giftCardID != 0 ? (
              <View
                style={{
                  width: '60%',
                  alignItems: 'center',
                  alignSelf: 'center',
                  paddingVertical: 20,
                  // backgroundColor: 'red',
                }}>
                <Text mb={10} medium size={22}>
                  Gift Card No.:{' '}
                  <Text bold size={22}>
                    {giftCardID}
                  </Text>
                </Text>
                <Text mb={10} medium size={22}>
                  Balance:{' '}
                  <Text bold size={22} color={lessBalance ? 'red' : undefined}>
                    {parseFloat(giftCardBalance).toFixed(2)}
                  </Text>
                </Text>
                <Text mb={10} medium size={22}>
                  Total Amount:{' '}
                  <Text bold size={22}>
                    {parseFloat(gcdebitAmt).toFixed(2)}
                  </Text>
                </Text>
                {lessBalance && (
                  <Text bold mb={10} color="red" size={22}>
                    Insufficient Balance
                  </Text>
                )}

                {!splitPayment && lessBalance && (
                  <Button
                    mt={20}
                    width={200}
                    backgroundColor={theme.colors.primaryColor}
                    // style={{alignSelf: 'center'}}
                    // disabled={props.isSubmitting}
                    onPress={() => {
                      setSplitPayment(true);
                      setModalView(CART_MODAL_VIEW.split_payment.id);
                    }}>
                    Split Payment
                  </Button>
                )}
                {!lessBalance && (
                  <Button
                    mt={20}
                    width={200}
                    // style={{alignSelf: 'center'}}
                    // disabled={props.isSubmitting}
                    onPress={() => {
                      if (splitPayment) {
                        setSplitPayments(_sp => {
                          let sp = [..._sp];
                          sp.splice(selectedSplitAmtRow, 1, {
                            ...sp[selectedSplitAmtRow],
                            paid: true,
                            received_amount: parseFloat(gcdebitAmt),
                            card_id: giftCardID,
                          });
                          return sp;
                        });

                        setModalView(CART_MODAL_VIEW.split_payment.id);
                      } else {
                        onCashSubmitSuccess({
                          received_amount: parseFloat(gcdebitAmt).toFixed(2),
                        });
                      }
                    }}>
                    {splitPayment ? 'Charge' : 'Pay'}
                  </Button>
                )}
              </View>
            ) : (
              <View
                style={{
                  width: '100%',
                  height: getPercentValue(height, 60),
                  alignItems: 'center',
                  justifyContent: 'center',
                  // paddingVertical: 10,
                  // backgroundColor: 'red',
                }}>
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                  }}>
                  <ActivityIndicator size={'large'} />
                  <Text>Scanning...</Text>
                </View>
                <_TextInput
                  style={{
                    backgroundColor: '#000000',
                    color: '#00000000',
                    opacity: 0.1,
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    textAlignVertical: 'top',
                  }}
                  caretHidden
                  selectionColor={'#00000000'}
                  autoFocus
                  showSoftInputOnFocus={!!TEST_ORDATA}
                  returnKeyType="next"
                  value={QRData}
                  onChangeText={t => {
                    setQRData(t);
                  }}
                  onSubmitEditing={() => {
                    giftCardQRValidating();
                  }}
                />
              </View>
            )}
          </>
        );
      case CART_MODAL_VIEW.price_calc.id:
        return (
          <>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <Button
                  onPress={() => {
                    // if (splitPayment) {
                    //   setModalView(CART_MODAL_VIEW.split_payment.id);
                    //   return;
                    // }
                    setModalView(CART_MODAL_VIEW.payment_method.id);
                  }}
                  style={{
                    alignSelf: 'flex-start',
                  }}>
                  Back
                </Button>
              </View>
              <Button
                backgroundColor={theme.colors.primaryColor}
                onPress={() => {
                  // if (splitPayment) {
                  //   setModalView(CART_MODAL_VIEW.split_payment.id);
                  //   return;
                  // }
                  setSplitPayment(true);
                  setModalView(CART_MODAL_VIEW.split_payment.id);
                }}
                style={{
                  alignSelf: 'flex-start',
                }}>
                Split Payment
              </Button>
            </View>
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
                  // phoneNo={phoneNo}
                  total={total}
                  onSubmitSuccess={onCashSubmitSuccess}
                />
              </View>
            </View>
          </>
        );

      case CART_MODAL_VIEW.split_payment.id:
        let remaining_amount = getSplitRemainingAmt(splitPayments);
        // console.log('remaining_amount', remaining_amount);
        return (
          <>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
              }}>
              <Button
                onPress={() => {
                  if (paymentMethod == PAYMENT_METHOD.gift_card.id) {
                    setModalView(CART_MODAL_VIEW.payment_method.id);
                  } else {
                    setModalView(CART_MODAL_VIEW.price_calc.id);
                  }

                  setSplitPayment(false);
                }}
                style={{
                  alignSelf: 'flex-start',
                }}>
                Back
              </Button>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Button
                  mr={10}
                  backgroundColor={splitPaymentBy == 1 ? '#333' : '#999'}
                  onPress={() => {
                    // if (splitPayment) {
                    //   setModalView(CART_MODAL_VIEW.split_payment.id);
                    //   return;
                    // }
                    setSplitPaymentBy(1);
                    // setSplitPayment(true);
                    //setModalView(CART_MODAL_VIEW.split_payment.id);
                  }}
                  style={
                    {
                      // alignSelf: 'flex-start',
                    }
                  }>
                  Split By Amount
                </Button>
                <Button
                  backgroundColor={splitPaymentBy == 2 ? '#333' : '#999'}
                  onPress={() => {
                    // if (splitPayment) {
                    //   setModalView(CART_MODAL_VIEW.split_payment.id);
                    //   return;
                    // }
                    setSplitPaymentBy(2);
                    //  setSplitPayment(true);
                    // setModalView(CART_MODAL_VIEW.split_payment.id);
                  }}
                  style={
                    {
                      // alignSelf: 'flex-start',
                    }
                  }>
                  Split By Item
                </Button>
              </View>
            </View>
            {splitPaymentBy == 1 && (
              <MenuProvider skipInstanceCheck>
                <View
                  style={
                    {
                      // width: '70%',
                      // alignItems: 'center',
                      // justifyContent:'flex-start',
                      // paddingVertical: 40,
                      // backgroundColor: 'red',
                    }
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      // justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text semibold>
                      Total Amount: <Text>${parseFloat(total).toFixed(2)}</Text>
                    </Text>
                    <Text semibold ml={10}>
                      Remaining Amount:{' '}
                      <Text
                        semibold
                        color={remaining_amount >= 0 ? 'green' : 'red'}>
                        {remaining_amount >= 0 ? '+' : '-'}$
                        {Math.abs(remaining_amount).toFixed(2)}
                      </Text>
                    </Text>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: -190,
                      }}>
                      <Button
                        onPress={() => {
                          if (splitNo > 1) {
                            setSplitNo(s => {
                              return s - 1;
                            });
                          }
                        }}>
                        -
                      </Button>
                      <Text
                        align="center"
                        style={{
                          minWidth: 50,
                        }}>
                        {splitNo}
                      </Text>
                      <Button
                        onPress={() => {
                          setSplitNo(s => {
                            return s + 1;
                          });
                        }}>
                        +
                      </Button>
                    </View>
                  </View>
                  <Container>
                    {splitPayments.map((r, i) => {
                      // let _rem_amount =
                      //   parseFloat(r.received_amount) - parseFloat(r.amount);
                      // if (!isFinite(_rem_amount)) {
                      //   _rem_amount = 0;
                      // }

                      return (
                        <View
                          key={i}
                          style={{
                            flexDirection: 'row',
                            // backgroundColor:'red',
                            alignItems: 'center',
                            marginBottom: 10,
                          }}>
                          <Text mr={5}>{i + 1}.</Text>

                          <Select
                            containerStyle={{
                              marginBottom: 0,
                              // flex: 1,
                              width: getPercentValue(width, 20),
                              paddingVertical: 5,
                              paddingHorizontal: 15,
                              // backgroundColor: 'red',
                              marginRight: 5,
                            }}
                            onValueChange={item => {
                              if (r.paid) {
                                return;
                              }
                              setSplitPayments(_sp => {
                                let sp = [..._sp];
                                sp.splice(i, 1, {
                                  ...sp[i],
                                  type: item,
                                });
                                return sp;
                              });
                              // console.log(item);
                              //  props.setFieldValue('mode', item);
                            }}
                            data={[
                              // {
                              //   value: '',
                              //   label: 'Select',
                              // },
                              {
                                value: 'cash',
                                label: 'Cash',
                              },
                              {
                                value: 'card',
                                label: 'Card',
                              },
                              {
                                value: 'gift-card',
                                label: 'Gift Card',
                              },
                            ]}
                            value={r.type}
                            // error={props.errors.mode?.value ? props.errors.mode?.value : ''}
                            // containerStyle={{marginBottom: 20}}
                          />

                          <TextInput
                            containerStyle={{
                              marginBottom: 0,
                              // flex: 2,
                              width: getPercentValue(width, 40),
                              paddingVertical: 5,
                              paddingHorizontal: 15,
                              // backgroundColor: 'red',
                            }}
                            // title="Customer Phone No."
                            textInputProps={{
                              onChangeText: d => {
                                if (r.paid) {
                                  return;
                                }

                                let input = parseFloat(d) || 0;
                                let maxValue = splitPayments.reduce(
                                  (s, r, j) => {
                                    if (i == j) {
                                      return s;
                                    }
                                    return s + (parseFloat(r.amount) || 0);
                                  },
                                  0,
                                );

                                maxValue = parseFloat(total) - maxValue;

                                maxValue = parseFloat(maxValue.toFixed(2));

                                console.log(
                                  input <= parseFloat(maxValue),
                                  input,
                                  parseFloat(maxValue),
                                );
                                if (input <= parseFloat(maxValue)) {
                                  setSplitPayments(_sp => {
                                    let sp = [..._sp];
                                    sp.splice(i, 1, {
                                      ...sp[i],
                                      amount: d,
                                    });
                                    return sp;
                                  });
                                }
                                // dispatch(
                                //   orderAction.set({
                                //     _prop: 'customerDetail',
                                //     values: {phoneNo: d},
                                //   }),
                                // );
                              },
                              // onBlur: props.handleBlur('email'),
                              value: r.amount.toString(),
                              keyboardType: 'numeric',
                              autoCapitalize: 'none',
                              // returnKeyType: 'next',
                              // placeholder: 'Phone No.',
                              //  onSubmitEditing: () => this.passwordInput.focus(),
                              //ref: r => (this.emailInput = r),
                              // type: 'custom',
                              // options: {
                              //   mask: '(999) 999 9999',
                              // },
                            }}
                            // error={
                            //   props.errors.email && props.touched.email
                            //     ? props.errors.email
                            //     : ''
                            // }
                            // round
                          />
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              flex: 1,
                            }}>
                            <Text semibold ml={10}>
                              Received Amount:{' '}
                              <Text semibold>
                                ${parseFloat(r.received_amount).toFixed(2)}
                              </Text>
                            </Text>

                            {/* <Text semibold ml={10}>
                            Remaining Amount:{' '}
                            <Text
                              semibold
                              color={_rem_amount >= 0 ? 'green' : 'red'}>
                              {_rem_amount >= 0 ? '+' : '-'}$
                              {Math.abs(_rem_amount).toFixed(2)}
                            </Text>
                          </Text> */}

                            {r.paid ? (
                              <View
                                style={{
                                  width: 105,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <FontAwesome5Icon
                                  size={20}
                                  color={theme.colors.successColor}
                                  name="check-circle"
                                />
                              </View>
                            ) : (
                              <Button
                                onPress={() => {
                                  console.log(remaining_amount);
                                  if (remaining_amount != 0) {
                                    simpleToast(
                                      'Your total amount is over the balance',
                                    );
                                    return;
                                  }
                                  setSelectedSplitAmtRow(i);
                                  if (r.type == 'gift-card') {
                                    setGiftCardId(0);
                                    setQRData(TEST_ORDATA);
                                    setModalView(
                                      CART_MODAL_VIEW.scan_gift_card.id,
                                    );
                                  } else {
                                    setModalView(
                                      CART_MODAL_VIEW.price_calc_split.id,
                                    );
                                  }
                                }}
                                backgroundColor={
                                  remaining_amount != 0
                                    ? 'red'
                                    : theme.colors.primaryColor
                                }
                                ml={10}
                                ph={20}
                                pv={5}>
                                Charge
                              </Button>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </Container>
                </View>
              </MenuProvider>
            )}

            {splitPaymentBy == 2 && (
              <MenuProvider skipInstanceCheck>
                <View
                  style={
                    {
                      // width: '70%',
                      // alignItems: 'center',
                      // justifyContent:'flex-start',
                      // paddingVertical: 40,
                      // backgroundColor: 'red',
                    }
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      // justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    {/* <Text semibold>
                      Total Amount: <Text>{total}</Text>
                    </Text> */}
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Button
                        onPress={() => {
                          if (totalSplitBills > 1) {
                            setTotalSplitBills(s => {
                              return s - 1;
                            });
                          }
                        }}>
                        -
                      </Button>
                      <Text
                        align="center"
                        style={{
                          minWidth: 50,
                        }}>
                        {totalSplitBills}
                      </Text>
                      <Button
                        onPress={() => {
                          setTotalSplitBills(s => {
                            return s + 1;
                          });
                        }}>
                        +
                      </Button>
                    </View>
                  </View>

                  <Container scroll horizontal>
                    {splitBills.map((r, i) => {
                      return <SplitByItemProduct key={i} index={i} data={r} />;
                    })}
                  </Container>
                </View>
              </MenuProvider>
            )}

            {/* <Button
              onPress={() => {
                setModalView(CART_MODAL_VIEW.price_calc.id);
              }}
              ph={40}
              ml={10}
              style={{
                alignSelf: 'center',
              }}>
              Next
            </Button> */}
          </>
        );

      case CART_MODAL_VIEW.price_calc_split.id:
        return (
          <>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <Button
                  onPress={() => {
                    // if (splitPayment) {
                    //   setModalView(CART_MODAL_VIEW.split_payment.id);
                    //   return;
                    // }
                    setModalView(CART_MODAL_VIEW.split_payment.id);
                  }}
                  style={{
                    alignSelf: 'flex-start',
                  }}>
                  Back
                </Button>
              </View>
            </View>
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
                  // phoneNo={phoneNo}
                  total={splitPayments[selectedSplitAmtRow]?.amount || 0}
                  onSubmitSuccess={values => {
                    setSplitPayments(_sp => {
                      let sp = [..._sp];
                      sp.splice(selectedSplitAmtRow, 1, {
                        ...sp[selectedSplitAmtRow],
                        paid: true,
                        received_amount: values.received_amount,
                      });
                      return sp;
                    });

                    setModalView(CART_MODAL_VIEW.split_payment.id);
                  }}
                />
              </View>
            </View>
          </>
        );
    }
  };
  const toggleDiscountModal = () => {
    setShowDiscountModal(!showDiscountModal);
  };
  const updateDiscount = _discountValues => {
    setDiscountValues(_discountValues);

    toggleDiscountModal();
  };
  return (
    <>
      <View
        style={{
          backgroundColor: '#fff',
          // height: 50,
          paddingHorizontal: 10,
          justifyContent: 'center',
          paddingVertical: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 2,
          }}>
          <Text
            style={{
              flex: 1,
            }}
            semibold
            size={16}>
            Total
          </Text>
          <Text size={16}>${parseFloat(sub_total).toFixed(2)}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 2,
          }}>
          <Text
            style={{
              flex: 1,
            }}
            semibold
            size={16}>
            {tax_title} ({tax_per}%)
          </Text>
          <Text size={16}>${parseFloat(tax_amt).toFixed(2)}</Text>
        </View>

        {!!offerDiscount && (
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 2,
            }}>
            <Text
              style={{
                flex: 1,
              }}
              semibold
              size={16}>
              Offer Discount
            </Text>
            <Text size={16}>
              {offer_discount_type == '2' && '$'}
              {_offer_discount}
              {offer_discount_type == '1' && '%'}
            </Text>
          </View>
        )}

        {!!_discount && (
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 2,
            }}>
            <Text
              style={{
                flex: 1,
              }}
              semibold
              size={16}>
              Discount
            </Text>
            <Text size={16}>
              {discount_type == '2' && '$'}
              {_discount}
              {discount_type == '1' && '%'}
            </Text>
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            marginBottom: 4,
          }}>
          <Text
            style={{
              flex: 1,
            }}
            semibold
            size={16}>
            Grand Total
          </Text>
          {!!_discount && (
            <Text
              size={16}
              mr={5}
              style={{
                textDecorationLine: 'line-through',
                textDecorationStyle: 'solid',
              }}>
              ${parseFloat(tax_total).toFixed(2)}
            </Text>
          )}
          <Text bold size={16}>
            ${parseFloat(total).toFixed(2)}
          </Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Button
            onPress={onDeletePress}
            noShadow
            backgroundColor={theme.colors.dangerColor}
            mr={5}
            ph={20}>
            <FontAwesome5Icon color={'#fff'} size={18} name="trash" />
          </Button>
          <Button
            onPress={() => {
              toggleDiscountModal();
            }}
            noShadow
            backgroundColor={theme.colors.dangerColor}
            mr={5}
            ph={20}>
            <FontAwesome5Icon name="tag" size={18} />
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
        landscapeWidth={
          modalView == CART_MODAL_VIEW.split_payment.id ? '98%' : 720
        }>
        {renderView()}
      </ModalContainer>

      <DiscountModal
        data={discountValues}
        subPrice={total}
        visible={showDiscountModal}
        title={`Discount`}
        width={350}
        onRequestClose={toggleDiscountModal}
        onUpdatePress={updateDiscount}
      />
    </>
  );
}

const SplitByItemProduct = memo(function ({index, data}) {
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState('');
  const {height} = useWindowDimensions();
  const cart = useSelector(s => s.order.cart);
  const splitBills = useSelector(s => s.order.splitBills);
  const addPress = () => {
    if (!selectedItem) {
      return;
    }
    let c = cart[selectedItem];
    let _splitBills = [...splitBills];

    _splitBills.splice(index, 1, {
      ..._splitBills[index],
      cart: {
        ..._splitBills[index].cart,
        [selectedItem]: {...c, qty: 1},
      },
    });
    dispatch(orderAction.set({splitBills: _splitBills}));
  };
  const options = useMemo(() => {
    let products = getCartProducts();
    console.log('wwwww', products);
    let options = products.map(r => {
      let {add_ons, variants} = r;
      // let add_ons = data.add_ons || [];

      return {
        value: r.cart_id,
        label: `${r.name}${
          variants.length ? `- ${variants.map(v => v.title).join(',')}` : ''
        }${
          add_ons.length
            ? `- ${add_ons.map(r => r.product_name).join(', ')}`
            : ''
        }`,
      };
    });

    options = options.filter(o => {
      if (Object.keys(data.cart).includes(o.value)) {
        return false;
      }

      let totalQty = cart[o.value].qty;
      let currentQty = splitBills.reduce((s, r) => {
        let qty = r.cart[o.value]?.qty ?? 0;

        return s + qty;
      }, 0);
      // console.log('wwwww ccc',totalQty,currentQty)

      return currentQty < totalQty;
    });
    setSelectedItem('');
    return options;
  }, [cart, data, splitBills]);

  let Ids = getCartItem(data.cart);
  return (
    <View
      style={{
        backgroundColor: '#eee',
        width: 350,
        marginHorizontal: 5,
        height: getPercentValue(height, 80) - 180,

        paddingHorizontal: 5,
        paddingVertical: 5,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 5,
        }}>
        <Select
          containerStyle={{
            marginBottom: 0,
            flex: 1,
            paddingVertical: 5,
            paddingHorizontal: 15,
            // backgroundColor: 'red',
            marginRight: 5,
          }}
          // sm
          // title="Mode of Pooja"
          // leftComponent={
          //   <Image
          //     resizeMode="contain"
          //     style={{
          //       width: 25,
          //       height: 25,
          //       marginRight: 10,
          //       // backgroundColor:'red'
          //     }}
          //     source={require('../assets/images/list.png')}
          //   />
          // }
          onValueChange={v => {
            setSelectedItem(v);
          }}
          data={options}
          value={selectedItem}
          // error={props.errors.mode?.value ? props.errors.mode?.value : ''}
          // containerStyle={{marginBottom: 20}}
        />
        <Button pv={5} onPress={addPress}>
          Add
        </Button>
      </View>
      <Container
        scroll
        style={{
          flex: 1,
        }}>
        {Ids.map(id => {
          let cdata = data.cart[id];
          return <SplitCartItem key={id} index={index} id={id} data={cdata} />;
        })}
      </Container>
    </View>
  );
});

function SplitCartItem({id, index, data}) {
  const dispatch = useDispatch();
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState('');
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discount, setDiscount] = useState('');
  const [discountReason, setDiscountReason] = useState('');
  const [discountType, setDiscountType] = useState('1');
  const splitBills = useSelector(s => s.order.splitBills);
  const cart = useSelector(s => s.order.cart);
  let menuItems = useSelector(s => s.user.menuItems);
  let selectedCartItem = ''; //useSelector(s => s.order.selectedCartItem);

  useEffect(() => {
    if (data) {
      setNote(data.special_ins);
      setDiscount(data.discount ?? '');
      setDiscountReason(data.discountReason ?? '');
      setDiscountType(data.discount_type ?? '1');
    }
  }, [data]);

  if (!data) {
    return null;
  }
  let {itemtype, itemId, sizeId, addon, productMenuType} = breakCartItemID(id);

  let itemData = menuItems[itemId];
  let {price, sizeData} = getPrice(itemId, JSON.parse(sizeId));
  let add_ons = data.add_ons || [];
  let add_onsTotal = getAddonsTotal(add_ons);
  let rate = add_onsTotal + price;
  let totalPrice = rate * data.qty;
  let discount_type = data.discount_type ?? '1';
  let _discount = parseFloat(data.discount ?? 0);
  if (isNaN(_discount)) {
    _discount = 0;
  }
  let cutPrice = totalPrice;
  if (_discount) {
    if (discount_type == '1') {
      totalPrice = totalPrice - totalPrice * (_discount / 100);
    } else if (discount_type == '2') {
      totalPrice = totalPrice - _discount;
    }
  }
  // console.log(data);
  const onDeletePress = () => {
    dispatch(
      alertAction.showAlert({
        type: ALERT_TYPE.CONFIRM,
        icon: ALERT_ICON_TYPE.CONFIRM,
        text: 'Do you want to remove?',
        heading: 'Confirmation',
        positiveText: 'Yes, remove',
        onPositivePress: () => {
          let _splitBills = [...splitBills];

          let scart = {..._splitBills[index].cart};
          delete scart[id];
          _splitBills.splice(index, 1, {
            ..._splitBills[index],
            cart: scart,
          });
          dispatch(orderAction.set({splitBills: _splitBills}));
        },
      }),
    );
  };
  const onMinusPress = () => {
    if (data.qty > 1) {
      let _splitBills = [...splitBills];

      _splitBills.splice(index, 1, {
        ..._splitBills[index],
        cart: {
          ..._splitBills[index].cart,
          [id]: {...data, qty: data.qty - 1},
        },
      });
      dispatch(orderAction.set({splitBills: _splitBills}));
    }
  };
  const onAddPress = () => {
    let totalQty = cart[id].qty;
    let currentQty = splitBills.reduce((s, r) => {
      let qty = r.cart[id]?.qty ?? 0;

      return s + qty;
    }, 0);

    if (currentQty < totalQty) {
      let _splitBills = [...splitBills];

      _splitBills.splice(index, 1, {
        ..._splitBills[index],
        cart: {
          ..._splitBills[index].cart,
          [id]: {...data, qty: data.qty + 1},
        },
      });
      dispatch(orderAction.set({splitBills: _splitBills}));
    }
    // console.log('wwwww ccc',totalQty,currentQty)

    // return currentQty < totalQty;

    // dispatch(
    //   orderAction.set({
    //     _prop: 'cart',
    //     _subprop: id,
    //     values: {qty: data.qty + 1},
    //   }),
    // );
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
        values: {discount: discount, discount_type: discountType},
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
  let selected = true; //selectedCartItem == id;
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
              {discount_type == '2' && '$'}
              {_discount}
              {discount_type == '1' && '%'}
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
              {/* <View
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
              </View> */}
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
        <SelectRadio
          // disabled={submitted}
          // error={
          //   props.errors[data.id] && props.touched[data.id]
          //     ? props.errors[data.id]
          //     : ''
          // }
          onValueChange={value => {
            setDiscountType(value);
          }}
          value={discountType}
          data={[
            {label: 'Discount by percentage', value: '1'},
            {label: 'Discount by Amount', value: '2'},
          ]}
        />

        <TextInput
          textInputProps={{
            onChangeText: t => {
              setDiscount(t);
            },
            value: discount,
            keyboardType: 'numeric',
            autoFocus: true,
            placeholder: 'Enter Value',
          }}
          textStyle={{
            textAlign: 'left',
          }}
        />

        <TextInput
          title="Discount Reason"
          textInputProps={{
            onChangeText: t => {
              setDiscountReason(t);
            },
            value: discountReason,
            // keyboardType: 'numeric',
            autoFocus: true,
            placeholder: 'Reason',
            multiline: true,
          }}
          textStyle={{
            textAlign: 'left',
            height: 80,
            textAlignVertical: 'top',
          }}
        />
        <Button onPress={updateDiscount}> Ok</Button>
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
