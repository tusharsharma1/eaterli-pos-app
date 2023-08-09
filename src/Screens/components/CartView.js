import React, {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import {
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  View,
  TextInput as _TextInput,
} from 'react-native';
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
import {
  CART_MODAL_VIEW,
  CUSTOMER_DETAIL,
  PAYMENT_METHOD,
} from '../../constants/order.constant';
import CashPaymentForm from '../../forms/CashPaymentForm';
import userAction from '../../redux/actions/user.action';
import AppProgess from '../../components/AppProgess';
import {
  getPercentValue,
  showToast,
  simpleToast,
} from '../../helpers/app.helpers';
import TextInput from '../../components/Controls/TextInput';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import * as yup from 'yup';

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
  if (isNaN(_discount)) {
    _discount = 0;
  }
  let cutPrice = totalPrice;
  if (_discount) {
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
  const [modalView, setModalView] = useState(
    CART_MODAL_VIEW.reward_question.id,
  );
  const [paymentMethod, setPaymentMethod] = useState('');
  const [existCustomer, setExistCustomer] = useState(false);
  const [loyalityProgram, setLoyalityProgram] = useState(false);
  const {height} = useWindowDimensions();
  const cart = useSelector(s => s.order.cart);
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  const userData = useSelector(s => s.user.userData);
  const deviceId = useSelector(s => s.user.deviceId);
  const diningOption = useSelector(s => s.order.diningOption);
  const customerDetail = useSelector(s => s.order.customerDetail);
  const payModal = useSelector(s => s.order.payModal);

  const [QRData, setQRData] = useState(''); //WzI3NSw3XQ==

  useEffect(() => {
    if (!payModal.show) {
      setPaymentMethod('');
      dispatch(orderAction.set({customerDetail: CUSTOMER_DETAIL}));
      setModalView(CART_MODAL_VIEW.reward_question.id);
    }
  }, [payModal]);

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
        email: yup.string().email('Invalid Email').required('Enter Email'),
      });
      const validate = await validationSchema
        .validate(customerDetail)
        .catch(err => {
          console.log(err);
          simpleToast(err.message);
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

      existCustomer,
      loyalityProgram,
      diningOption,
      ...customerDetail,
    };
    console.log(body);
    // return
    let r = await dispatch(userAction.createOrder(body));
    console.log(r);
    if (r && r.status) {
      simpleToast(r.message);
      toggleModal();
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
      let [id, rid] = jsonob;
      // console.log(id, rid);
      if (jsonob && id && rid && rid == userData.restaurant.id) {
        // console.log(jsonob);
        let r = await dispatch(userAction.getCustomerDetail(rid, id));
        if (r && r.status) {
          
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
          simpleToast('Invalid QR Code.');
          // setQRValue('');
          // setQRData({error: true, message: 'Invalid QR Code.'});
        }
      } else {
        simpleToast('Invalid QR Code.');
      }
      // setValidating(false);
    }
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
                        mask: '(999) 999 9999',
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
                        mask: '(999) 999 9999',
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
              <Button
                onPress={async () => {
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
                    setModalView(CART_MODAL_VIEW.payment_method.id);
                  } else {
                    setModalView(CART_MODAL_VIEW.loyality.id);
                  }
                }}
                ph={40}
                style={{
                  alignSelf: 'center',
                }}>
                Next
              </Button>
              <Button
                mt={10}
                onPress={async () => {
                  setModalView(CART_MODAL_VIEW.scan_qr.id);
                  setQRData('');
                }}
                ph={40}
                style={{
                  alignSelf: 'center',
                }}>
                Scan QR
              </Button>
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
                // multiline
                // onFocus={() => {
                //   // Keyboard.dismiss();
                // }}
                autoFocus
                showSoftInputOnFocus={false}
                returnKeyType="next"
                value={QRData}
                onChangeText={t => {
                  setQRData(t);
                }}
                onSubmitEditing={() => {
                  QRValidating();
                  setModalView(CART_MODAL_VIEW.customer_phone.id);
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
                  text="Card"
                  onPress={() => {
                    setPaymentMethod(PAYMENT_METHOD.card.id);
                  }}
                />
              </View>
            </View>
          </>
        );

      case CART_MODAL_VIEW.price_calc.id:
        return (
          <>
            <Button
              onPress={() => {
                setModalView(CART_MODAL_VIEW.payment_method.id);
              }}
              style={{
                alignSelf: 'flex-start',
              }}>
              Back
            </Button>
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
    }
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
