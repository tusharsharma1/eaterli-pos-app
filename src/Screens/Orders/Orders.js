import moment from 'moment';
import React, {useEffect, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {dummyImage} from '../../assets';
import Container from '../../components/Container';
import Header from '../../components/Header';
import ModalContainer from '../../components/ModalContainer';
import Table from '../../components/Table';
import Text from '../../components/Text';
import ProgressImage from '../../components/react-native-image-progress';
import {
  DEFAULT_TAX_TITLE,
  PAYMENT_METHOD,
} from '../../constants/order.constant';
import {getAddons, getVariants} from '../../helpers/order.helper';
import {
  checkPrinterConnection,
  createOrderReceiptPrintData,
  doPrintUSBPrinter,
  doWebViewPrint,
} from '../../helpers/printer.helper';
import {useNonInitialEffect} from '../../hooks/useNonInitialEffect';
import usePrevious from '../../hooks/usePrevious';
import userAction from '../../redux/actions/user.action';
import Button from '../../components/Button';
import alertAction from '../../redux/actions/alert.action';
import {ALERT_ICON_TYPE, ALERT_TYPE} from '../../constants/alert.constant';
import {simpleToast} from '../../helpers/app.helpers';
import OrderRefundForm from '../../forms/OrderRefundForm';
import Badge from '../../components/Badge';

export default function Orders({navigation, route}) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  const userData = useSelector(s => s.user.userData);
  const orders = useSelector(s => s.user.orders);
  const [refresh, setRefresh] = useState(true);
  let prevCurrentPage = usePrevious(orders.currentPage);
  const [refundModal, setRefundModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const toggleRefundModal = () => {
    setRefundModal(!refundModal);
  };
  useEffect(() => {
    dispatch(
      userAction.set({
        _prop: 'orders',
        values: {
          currentPage: 1,
        },
      }),
    );

    loadData(true);
  }, []);
  useNonInitialEffect(() => {
    loadData(prevCurrentPage >= orders.currentPage);
  }, [orders.currentPage, refresh]);
  const loadData = async _refresh => {
    setLoaded(false);
    let r = await dispatch(
      userAction.getOrders(
        userData.restaurant.id,
        selectedLocation,
        {
          page: orders.currentPage,
          limit: 25,
          // order_status: 'delivered'
        },
        _refresh,
        'orders',
        false,
      ),
    );
    setLoaded(true);
  };
  const refreshList = () => {
    dispatch(
      userAction.set({
        _prop: 'orders',
        values: {
          currentPage: 1,
        },
      }),
    );
    setRefresh(!refresh);
  };
  const voidPress = () => {
    dispatch(
      alertAction.showAlert({
        type: ALERT_TYPE.CONFIRM,
        icon: ALERT_ICON_TYPE.CONFIRM,
        text: 'Do you want to void this order?',
        heading: 'Confirmation',
        positiveText: 'Yes, remove',
        onPositivePress: async () => {
          let r = await dispatch(
            userAction.voidOrderUpdate(
              userData.restaurant.id,
              selectedOrder.id,
              {
                order_void: 1,
              },
            ),
          );

          if (r && r.status) {
            simpleToast(r.message);
            toggleModal();
            refreshList();
          }
        },
      }),
    );
  };
  const refundPress = () => {
    toggleRefundModal();
  };
  const columns = useMemo(() => {
    return [
      {
        title: 'Order No',
        align: 'left',
        key: 'id',
        renderCell: data => {
          return (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text mr={5}>{data.id}</Text>
              {data.order_void == '1' && (
                <Badge backgroundColor="#e20b3c" mr={4}>
                  Void
                </Badge>
              )}
              {!!data.order_refunds?.length && (
                <Badge backgroundColor="#e27b0b">Refund</Badge>
              )}
            </View>
          );
        },
      },
      {
        title: 'Total Products',
        renderValue: data => {
          return `${data.order_items.length}`;
        },
        align: 'right',
      },
      {
        title: 'Total Amount',
        renderValue: data => {
          return `$ ${parseFloat(data.order_total).toFixed(2)}`;
        },
        align: 'right',
      },
      {
        title: 'Date',
        renderValue: data => {
          return moment(data.created_at).format('DD MMM, YYYY');
        },
      },
      {
        title: 'Payment Method',
        renderValue: data => {
          return data.payment_method?.toLocaleUpperCase();
        },
      },
      {
        title: 'Action',
        renderCell: data => {
          return (
            <View
              style={{
                flexDirection: 'row',
              }}>
              {/* <TouchableOpacity>
          <FontAwesome5Icon name="pen" />
        </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => {
                  setSelectedOrder(data);
                  toggleModal();
                }}
                style={{
                  // backgroundColor:'red',
                  padding: 4,
                  marginRight: 10,
                }}>
                <FontAwesome5Icon name="eye" color={'#212121'} size={22} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  if (!__DEV__) {
                    let c = await checkPrinterConnection();
                    if (!c) {
                      return;
                    }
                  }

                  let printData = createOrderReceiptPrintData(data);
                  await doPrintUSBPrinter(printData);
                  // return;
                  //  __DEV__ && doWebViewPrint(printData);
                  ///////////////////
                  // POSModule.printByAllInOnePOS(printData, res => {
                  //   console.log('[printByAllInOnePOS]', res);
                  //   showToast(res.res);
                  //   // alert(JSON.stringify(res));
                  // });
                }}
                style={{
                  // backgroundColor:'red',
                  padding: 4,
                }}>
                <FontAwesome5Icon name="print" color={'#212121'} size={22} />
              </TouchableOpacity>
            </View>
          );
        },
        // width: 100,
      },
    ];
  }, []);
  let remaining_amount =
    parseFloat(selectedOrder?.order_total) -
    parseFloat(selectedOrder?.received_amount);
  if (!isFinite(remaining_amount)) {
    remaining_amount = 0;
  }

  
  return (
    <>
      <Header title={'Orders'} back />
      <Container style={{flex: 1}}>
        <Table
          data={orders.data}
          columns={columns}
          refreshing={!loaded}
          onRefresh={() => {
            refreshList();
          }}
          onEndReachedThreshold={0.1}
          onEndReached={r => {
            // console.log('onEndReached', r);
            if (loaded && orders.totalPage > orders.currentPage) {
              dispatch(
                userAction.set({
                  _prop: 'orders',
                  values: {
                    currentPage: orders.currentPage + 1,
                  },
                }),
              );
            }
          }}
          progressViewOffset={0}
        />
      </Container>
      <ModalContainer
        // hideTitle
        center
        // noscroll
        onRequestClose={toggleModal}
        visible={showModal}
        title={`Order Details`}
        landscapeWidth={550}
        // width={550}
        // height={theme.hp(60)}
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
        {!!selectedOrder && (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: 10,
                alignItems:'center'
              }}>
              {!(
                selectedOrder.order_void == '1'||
                !!selectedOrder.order_refunds?.length
              )&& (
                <>
                  <Button pv={8} ph={30} mr={5} onPress={voidPress}>
                    Void
                  </Button>

                  <Button pv={8} ph={30} onPress={refundPress}>
                    Refund
                  </Button>
                </>
              )}

              {selectedOrder.order_void == '1' && (
                <Badge backgroundColor="#e20b3c" mr={4}>
                  Void
                </Badge>
              )}
              {!!selectedOrder.order_refunds?.length && (
                <Badge backgroundColor="#e27b0b">Refund</Badge>
              )}
            </View>
            <View
              style={{
                // alignItems: 'flex-end',
                marginBottom: 20,
              }}>
              <InfoRow title={'Order No:'} value={selectedOrder.id} />
              <InfoRow
                title={'Order Date:'}
                value={moment(selectedOrder.created_at).format(
                  'DD MMM, YYYY hh:mm A',
                )}
              />
              <InfoRow
                title={'Payment Method:'}
                value={`${
                  selectedOrder.payment_method || ''
                }`.toLocaleUpperCase()}
              />
              {selectedOrder.paymentMethod == PAYMENT_METHOD.card.id && (
                <>
                  <InfoRow title={'Payment ID:'} value={'PAY_2332hhj34x'} />
                </>
              )}
            </View>

            {selectedOrder.point_transactions &&
              !!selectedOrder.point_transactions.length && (
                <View>
                  <Text size={18} bold mb={5}>
                    Reward Points
                  </Text>
                  {selectedOrder.point_transactions.map((d, i) => {
                    return (
                      <View
                        key={i}
                        style={{
                          marginBottom: 5,
                        }}>
                        <Text size={14}>
                          Description:{' '}
                          <Text size={14} semibold>
                            {d.description}
                          </Text>
                        </Text>
                        <Text size={14}>
                          Point:{' '}
                          <Text size={14} semibold>
                            {d.point}
                          </Text>
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

            <Text size={18} bold>
              Products
            </Text>
            <View
              style={{
                // height:theme.hp(50),
                marginBottom: 20,
              }}>
              <Table
                data={selectedOrder.order_items}
                columns={[
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
                          <ProgressImage
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
                          />
                          <View>
                            <Text>{data.item_name}</Text>
                            {!!variants.length && (
                              <Text color="#666" size={12}>
                                {variants.map(r => r.title).join(', ')}
                              </Text>
                            )}
                            {!!add_ons.length && (
                              <Text color="#666" size={12}>
                                {add_ons.map(r => r.product_name).join(', ')}
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
                    title: 'Total',
                    align: 'right',
                    renderValue: data => {
                      let discount_type = data.discount_type ?? '1';

                      let _discount = parseFloat(data.discount ?? 0);
                      let totalPrice = data.total_price;
                      if (_discount) {
                        if (discount_type == '1') {
                          totalPrice =
                            totalPrice - totalPrice * (_discount / 100);
                        } else if (discount_type == '2') {
                          totalPrice = totalPrice - _discount;
                        }
                      }
                      return totalPrice
                        ? `$${parseFloat(totalPrice).toFixed(2)}`
                        : '';
                    },
                  },
                ]}
              />
            </View>

            {[PAYMENT_METHOD.split_payment.id].includes(
              selectedOrder.payment_method,
            ) && (
              <View
                style={{
                  marginBottom: 10,
                }}>
                <Text size={18} bold>
                  Split Payment
                </Text>

                <Table
                  data={selectedOrder.order_split_payments || []}
                  columns={[
                    {
                      title: 'Type',
                      align: 'left',
                      key: 'type',
                    },

                    {
                      title: 'Amount',
                      align: 'right',
                      renderValue: data => {
                        return data.amount
                          ? `$${parseFloat(data.amount).toFixed(2)}`
                          : '';
                      },
                    },
                    {
                      title: 'Received Amount',
                      align: 'right',
                      renderValue: data => {
                        return data.received_amount
                          ? `$${parseFloat(data.received_amount).toFixed(2)}`
                          : '';
                      },
                    },
                  ]}
                />

                {/* {(selectedOrder.order_split_payments || []).map(sp => {
                  return <View key={sp.id}></View>;
                })} */}
              </View>
            )}

            <View
              style={{
                alignSelf: 'flex-end',
                width: 300,
              }}>
              <InfoRow
                title={'Sub Total:'}
                value={`$ ${parseFloat(selectedOrder.sub_total).toFixed(2)}`}
              />
              <InfoRow
                title={`${
                  selectedOrder?.tax_title || DEFAULT_TAX_TITLE
                } (${parseFloat(selectedOrder?.tax_per || 0)}%)`}
                value={`$ ${parseFloat(selectedOrder.tax_amt).toFixed(2)}`}
              />

              {!!selectedOrder.discount && (
                <>
                  <InfoRow
                    title={'Total:'}
                    value={`$ ${(
                      parseFloat(selectedOrder.sub_total) +
                      parseFloat(selectedOrder.tax_amt)
                    ).toFixed(2)}`}
                  />
                  <InfoRow
                    title={'Discount:'}
                    value={`${selectedOrder.discount_type == '2' ? '$ ' : ''}${
                      selectedOrder.discount ?? 0
                    }${selectedOrder.discount_type == '1' ? '%' : ''}`}
                  />
                </>
              )}

              <InfoRow
                title={'Grand Total:'}
                value={`$ ${parseFloat(selectedOrder.order_total).toFixed(2)}`}
              />
              {[
                PAYMENT_METHOD.cash.id,
                PAYMENT_METHOD.split_payment.id,
              ].includes(selectedOrder.payment_method) && (
                <>
                  <InfoRow
                    title={'Received Amount:'}
                    value={`$ ${parseFloat(
                      selectedOrder.received_amount,
                    ).toFixed(2)}`}
                  />
                  <InfoRow
                    title={'Remaining Amount:'}
                    value={`$ ${parseFloat(remaining_amount).toFixed(2)}`}
                  />
                </>
              )}
            </View>
          </>
        )}
      </ModalContainer>

      <ModalContainer
        // hideTitle
        center
        // noscroll
        onRequestClose={toggleRefundModal}
        visible={refundModal}
        title={`Refund`}
        landscapeWidth={400}
        // width={550}
        // height={theme.hp(60)}
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
        <OrderRefundForm
          onSubmitSuccess={() => {
            toggleRefundModal();
            toggleModal();
            refreshList();
          }}
          orderData={selectedOrder}
        />
      </ModalContainer>
    </>
  );
}
function InfoRow({title, value, style = {}}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',

        ...style,
      }}>
      <Text bold>{title}</Text>
      <Text ml={5}>{value}</Text>
    </View>
  );
}
