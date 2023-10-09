import {Formik} from 'formik';
import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, View} from 'react-native';
// import ActionSheet from 'react-native-actionsheet';
// import ImagePicker from 'react-native-image-crop-picker';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import Button from '../components/Button';
import TextInput from '../components/Controls/TextInput';
import Text from '../components/Text';
import {simpleToast} from '../helpers/app.helpers';
import userAction from '../redux/actions/user.action';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Table from '../components/Table';
import {REFUND_TYPE} from '../constants/order.constant';
import {getAddons, getVariants} from '../helpers/order.helper';
import theme from '../theme';

const _validationSchema = yup.object({
  reason: yup.string().required('Required'),
  perc: yup
    .number()
    .min(0, 'Percentage must be greater than or equal to 100')
    .max(100, 'Percentage must be less than or equal to 100')
    .typeError('Invalid No.'),
  amt: yup
    .number()
    .min(0, 'Percentage must be greater than or equal to 100')
    .max(100, 'Percentage must be less than or equal to 100')
    .typeError('Invalid No.'),
});
const _initialValues = {
  reason: '',
  perc: '10',
  amt: 0,
  items: [],
};

const OrderRefundForm = ({orderData, onSubmitSuccess}) => {
  let formikRef = useRef(null);
  const userData = useSelector(s => s.user.userData);
  const deviceId = useSelector(s => s.user.deviceId);
  const [type, setType] = useState(REFUND_TYPE.full.id);
  const [initialValues, setInitialValues] = useState(_initialValues);
  const [validationSchema, setValidationSchema] = useState(_validationSchema);
  const dispatch = useDispatch();
  useEffect(() => {
    loadData();
  }, [type]);
  const loadData = () => {
    let voB = {
      reason: yup.string().required('Required'),
      perc: yup.number(),

      amt: yup.number(),
      items: yup.array(),
    };

    if (type == REFUND_TYPE.percantage.id) {
      voB.perc = yup
        .number()
        .min(0, 'Percentage must be greater than or equal to 100')
        .max(100, 'Percentage must be less than or equal to 100')
        .typeError('Invalid No.')
        .required('Required');
    } else if (type == REFUND_TYPE.amount.id) {
      voB.amt = yup
        .number()
        .min(0, 'Amount must be greater than or equal to 100')
        .max(
          parseFloat(orderData.order_total),
          `Amount must be less than or equal to ${parseFloat(
            orderData.order_total,
          ).toFixed(2)}`,
        )
        .typeError('Invalid No.')
        .required('Required');
    } else if (type == REFUND_TYPE.items.id) {
      voB.items = yup.array().min(1, 'Select at least 1 item');
    }

    setValidationSchema(yup.object(voB));
    setInitialValues({
      ...initialValues,
      perc: '100',
      items: [],
      amt: orderData.order_total,
    });
  };

  const onSubmit = async (values, helpers) => {
    console.log(values);
    Keyboard.dismiss();

    let body = {
      order_id: orderData.id,
      refund_amount: getRefundAmount(),
      refund_reason: values.reason,
      staff_id: userData.user_id,
      payment_method: orderData.payment_method,
      refund_status: 'refunded',
      device_id: deviceId,
      metadata: JSON.stringify({
        perc: values.perc,
        items: values.items,
        amt: values.amt,
        type
      }),
      // customer_id
    };

    if (orderData.gift_card_id) {
      body.gift_card_id = orderData.gift_card_id;
    }
    // console.log(body);
    // return;
    let r = await dispatch(
      userAction.refundOrder(userData.restaurant.id, orderData.id, body),
    );
    console.log('result===>  ', r);
    if (r && r.status) {
      // let {onSubmit} = this.props;
      simpleToast(r.message);
      onSubmitSuccess && onSubmitSuccess();
    }
  };
  const getRefundAmount = () => {
    if (formikRef.current) {
      if (type == REFUND_TYPE.percantage.id) {
        let perc = parseFloat(formikRef.current.values.perc || 100);
        let total_price = parseFloat(orderData.order_total);
        let percAmt = (total_price * perc) / 100;
        return percAmt;
      } else if (type == REFUND_TYPE.amount.id) {
        return formikRef.current.values.amt || orderData.order_total;
      } else if (type == REFUND_TYPE.items.id) {
        let total = formikRef.current.values.items.reduce((s, index) => {
          let data = orderData.order_items[index];
          let price = getItemPrice(data);

          return s + parseFloat(price.total);
        }, 0);

        return total;
      }
    }
    return orderData.order_total;
  };
  const getItemPrice = data => {
    let discount_type = data.discount_type ?? '1';

    let _discount = parseFloat(data.discount ?? 0);
    let totalPrice = data.total_price;
    if (_discount) {
      if (discount_type == '1') {
        totalPrice = totalPrice - totalPrice * (_discount / 100);
      } else if (discount_type == '2') {
        totalPrice = totalPrice - _discount;
      }
    }

    let sub_total = totalPrice;
    let tax_amt = (sub_total * orderData.tax_per) / 100;
    let tax_total = parseFloat(tax_amt) + parseFloat(sub_total);
    let total = tax_total;

    return {
      sub_total,
      total,
      tax_amt,
    };
  };

  // console.log(initialValues, validationSchema);
  return (
    <>
      <Formik
        key={type}
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
        innerRef={formikRef}
        validateOnChange={true}>
        {props => {
          // console.log(props.values, props.errors, props.touched);

          let percAmt = getRefundAmount();
          return (
            <>
              <Text size={18} mb={10}>
                Total Amount:{' '}
                <Text semibold size={18}>
                  $ {parseFloat(orderData.order_total).toFixed(2)}
                </Text>
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <TypeButton
                  type={REFUND_TYPE.full.id}
                  selected={type == REFUND_TYPE.full.id}
                  onPress={_t => {
                    setType(_t);
                  }}
                  text="Full Refund"
                />
                <TypeButton
                  type={REFUND_TYPE.percantage.id}
                  selected={type == REFUND_TYPE.percantage.id}
                  onPress={_t => {
                    setType(_t);
                  }}
                  text="By Percentage"
                />
                <TypeButton
                  type={REFUND_TYPE.amount.id}
                  selected={type == REFUND_TYPE.amount.id}
                  onPress={_t => {
                    setType(_t);
                  }}
                  text="By Amount"
                />
                <TypeButton
                  type={REFUND_TYPE.items.id}
                  selected={type == REFUND_TYPE.items.id}
                  onPress={_t => {
                    setType(_t);
                  }}
                  text="By Item"
                />
              </View>

              {type == REFUND_TYPE.items.id && (
                <View
                  style={{
                    marginBottom: 10,
                  }}>
                  <Table
                    rowPress={(data, index) => {
                      let _items = [...props.values.items];
                      let _index = _items.indexOf(index);

                      if (_index != -1) {
                        _items.splice(_index, 1);
                      } else {
                        _items.push(index);
                      }

                      props.setFieldValue('items', _items);
                    }}
                    data={orderData.order_items}
                    columns={[
                      {
                        title: '#',
                        align: 'left',

                        renderCell: (data, index) => {
                          let selected = props.values.items.includes(index);
                          return (
                            <FontAwesome5
                              size={20}
                              solid={selected}
                              color={
                                selected
                                  ? theme.colors.secondaryColor
                                  : '#222222'
                              }
                              name={selected ? 'check-circle' : 'circle'}
                            />
                          );
                        },
                      },
                      {
                        title: 'Name',
                        align: 'left',
                        renderCell: data => {
                          let variants = getVariants(data);
                          let add_ons = getAddons(data);
                          return (
                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              {/* <ProgressImage
                              // color={}
                              source={
                                data.image
                                  ? {
                                      uri: data.image,
                                      //+ '?t=' + new Date().getTime()
                                    }
                                  : dummyImage
                              }
                              style={{
                                width: 50,
                                height: 50,

                                backgroundColor: '#aaa',
                                marginRight: 5,
                                // borderRadius: theme.wp(26) / 2,
                                // borderWidth: 1,
                                //borderColor: theme.colors.borderColor,
                                // data.item_image
                                //  backgroundColor:'red'
                              }}
                              imageStyle={{
                                width: '100%',
                                height: '100%',
                                // width: 60,
                                resizeMode: 'cover',
                                // height: theme.screenWidth / numColumns - 100,
                                // height:
                                //   theme.screenWidth / numColumns -
                                //   2 * theme.wp(2) * numColumns -
                                //   theme.hp(5),
                                // backgroundColor: 'red',
                                // - (vheight * (10 / 100)), // theme.hp(10),
                                flex: 1,
                              }}
                            /> */}
                              <View>
                                <Text>{data.item_name}</Text>
                                {!!variants.length && (
                                  <Text color="#666" size={12}>
                                    {variants.map(r => r.title).join(', ')}
                                  </Text>
                                )}
                                {!!add_ons.length && (
                                  <Text color="#666" size={12}>
                                    {add_ons
                                      .map(r => r.product_name)
                                      .join(', ')}
                                  </Text>
                                )}
                              </View>
                            </View>
                          );
                        },
                      },
                      {
                        title: 'Qty',
                        align: 'right',
                        key: 'quantity',
                      },
                      {
                        title: 'Rate',
                        align: 'right',
                        renderValue: data => {
                          return data.rate
                            ? `$${parseFloat(data.rate).toFixed(2)}`
                            : '';
                        },
                      },
                      {
                        title: 'Dis.',
                        align: 'right',
                        renderValue: data => {
                          return `${data.discount_type == '2' ? '$' : ''}${
                            data.discount ?? 0
                          }${data.discount_type == '1' ? '%' : ''}`;
                          // return data.rate
                          //   ? `$${parseFloat(data.rate).toFixed(2)}`
                          //   : '';
                        },
                      },
                      {
                        title: 'Sub Total',
                        align: 'right',
                        renderValue: data => {
                          let price = getItemPrice(data);

                          return price.sub_total
                            ? `$${parseFloat(price.sub_total).toFixed(2)}`
                            : '';
                        },
                      },
                      {
                        title: 'Tax',
                        align: 'right',
                        renderValue: data => {
                          let price = getItemPrice(data);
                          return price.tax_amt
                            ? `$${parseFloat(price.tax_amt).toFixed(2)}`
                            : '';
                        },
                      },
                      {
                        title: 'Total',
                        align: 'right',
                        renderValue: data => {
                          let price = getItemPrice(data);
                          return price.total
                            ? `$${parseFloat(price.total).toFixed(2)}`
                            : '';
                        },
                      },
                    ]}
                  />
                  {props.errors.items ? (
                    <Text align="center" color={theme.colors.errorColor}>
                      {props.errors.items}
                    </Text>
                  ) : null}
                </View>
              )}

              <Text size={18} mb={10}>
                Refund Amount:{' '}
                <Text semibold size={18}>
                  $ {parseFloat(percAmt).toFixed(2)}
                </Text>
              </Text>

              {type == REFUND_TYPE.percantage.id && (
                <TextInput
                  title="Percentage"
                  containerStyle={{
                    marginBottom: 20,
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                  }}
                  textStyle={{
                    flex: 1,
                    textAlignVertical: 'top',
                  }}
                  textInputProps={{
                    placeholder: '',
                    onChangeText: props.handleChange('perc'),
                    onBlur: props.handleBlur('perc'),
                    value: props.values.perc,
                    keyboardType: 'numeric',
                  }}
                  error={
                    props.errors.perc && props.touched.perc
                      ? props.errors.perc
                      : ''
                  }
                />
              )}

              {type == REFUND_TYPE.amount.id && (
                <TextInput
                  title="Amount"
                  containerStyle={{
                    marginBottom: 20,
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                  }}
                  textStyle={{
                    flex: 1,
                    textAlignVertical: 'top',
                  }}
                  textInputProps={{
                    placeholder: '',
                    onChangeText: props.handleChange('amt'),
                    onBlur: props.handleBlur('amt'),
                    value: props.values.amt,
                    keyboardType: 'numeric',
                  }}
                  error={
                    props.errors.amt && props.touched.amt
                      ? props.errors.amt
                      : ''
                  }
                />
              )}

              <TextInput
                title="Reason"
                containerStyle={{
                  marginBottom: 20,
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  height: 100,
                }}
                textStyle={{
                  flex: 1,
                  textAlignVertical: 'top',
                }}
                textInputProps={{
                  multiline: true,
                  placeholder: '',
                  onChangeText: props.handleChange('reason'),
                  onBlur: props.handleBlur('reason'),
                  value: props.values.reason,
                }}
                error={
                  props.errors.reason && props.touched.reason
                    ? props.errors.reason
                    : ''
                }
              />

              <Button
                width={200}
                style={{alignSelf: 'center'}}
                // disabled={props.isSubmitting}
                onPress={props.handleSubmit}>
                Submit
              </Button>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default OrderRefundForm;

function TypeButton({text = '', type, selected, onPress}) {
  return (
    <Button
      // style={{
      //   flex:1
      // }}
      color={selected ? undefined : '#111111'}
      backgroundColor={selected ? undefined : '#efefef'}
      onPress={() => {
        onPress && onPress(type);
      }}>
      {selected && (
        <FontAwesome5 size={20} solid color="#02ff06" name="check-circle" />
      )}{' '}
      {text}
    </Button>
  );
}
