import moment from 'moment';
import React, {useEffect, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import Badge from '../../components/Badge';
import Container from '../../components/Container';
import Header from '../../components/Header';
import ModalContainer from '../../components/ModalContainer';
import OptionMenu from '../../components/OptionMenu';
import Table from '../../components/Table';
import Text from '../../components/Text';
import {ALERT_ICON_TYPE, ALERT_TYPE} from '../../constants/alert.constant';
import {DELIVERY_TYPE} from '../../constants/order.constant';
import OrderRefundForm from '../../forms/OrderRefundForm';
import {simpleToast} from '../../helpers/app.helpers';
import {
  checkPrinterConnection,
  createOrderReceiptPrintData,
  doPrintUSBPrinter,
} from '../../helpers/printer.helper';
import {useNonInitialEffect} from '../../hooks/useNonInitialEffect';
import usePrevious from '../../hooks/usePrevious';
import alertAction from '../../redux/actions/alert.action';
import userAction from '../../redux/actions/user.action';
import OrderDetail from '../components/OrderDetail';
import RightMenu from '../../components/app/RightMenu';
import LeftMenu from '../../components/app/LeftMenu';
import useTheme from '../../hooks/useTheme';
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
  const themeData = useTheme();
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
        positiveText: 'Yes',
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
              <Text color={themeData.textColor} mr={5}>{data.id}</Text>
              {data.order_void == '1' && (
                <Badge color={themeData.textColor} backgroundColor="#e20b3c" mr={4}>
                  Void
                </Badge>
              )}
              {!!data.order_refunds?.length && (
                <Badge color={themeData.textColor} backgroundColor="#e27b0b">Refund</Badge>
              )}
            </View>
          );
        },
      },
      {
        title: 'Order Type',
        align: 'left',
        renderValue: data => {
          return `${DELIVERY_TYPE[data.delivery_type || 'pickup']?.text}`;
        },
      },
      {
        title: 'Estimated Time',
        align: 'left',
        renderValue: data => {
          return `${parseInt(data.estimated_cooking_time)} min`;
        },
      },
      {
        title: 'Products',
        renderValue: data => {
          return `${data.order_items.length}`;
        },
        align: 'right',
      },
      {
        title: 'Amount',
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
                <FontAwesome5Icon name="eye" color={themeData.textColor} size={22} />
              </TouchableOpacity>

              {/* <TouchableOpacity
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
              </TouchableOpacity> */}

              <OptionMenu
               color={themeData.textColor}
                menus={[
                  {
                    icon: (
                      <FontAwesome5Icon
                        size={16}
                        name="print"
                        color={'#212121'}
                      />
                    ),
                    text: 'Print Receipt',
                    onPress: async () => {
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
                    },
                  },
                  !!data.tracking_url &&
                    data.delivery_type == DELIVERY_TYPE.delivery.id && {
                      icon: (
                        <FontAwesome5Icon
                          size={16}
                          name="truck"
                          color={'#212121'}
                        />
                      ),
                      text: 'Track',
                      onPress: () => {
                        navigation.navigate('TrackOrder', {
                          data: data,
                        });
                      },
                    },
                ].filter(Boolean)}
              />
            </View>
          );
        },
        // width: 100,
      },
    ];
  }, []);

  // return (
  //   <>
  //     <View
  //       style={{
  //         flex: 1,
  //         flexDirection: 'row',
  //         backgroundColor: themeData.appBg,
  //       }}>
  //       <LeftMenu />
  //       <View
  //         style={{
  //           flex: 1,
  //           marginBottom: 15,
  //         }}>
  //         <View
  //           style={{
  //             // backgroundColor:'#000',
  //             height: 40,
  //           }}></View>
  //         <View
  //           style={{
  //             backgroundColor: themeData.bodyBg,
  //             borderRadius: 8,
  //             flex: 1,
  //             paddingHorizontal: 10,
  //             paddingVertical: 10,
  //             flexDirection: 'row',
  //           }}>
          
  //         </View>
  //       </View>
  //       <RightMenu />
  //     </View>
  //   </>
  // );

  return (
    <>
      <Header title={'Orders'} back />
      <Container style={{flex: 1,backgroundColor:themeData.cardBg}}>
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
          <OrderDetail
            voidPress={voidPress}
            refundPress={refundPress}
            data={selectedOrder}
          />
        )}
      </ModalContainer>

      <ModalContainer
        // hideTitle
        center
        // noscroll
        onRequestClose={toggleRefundModal}
        visible={refundModal}
        title={`Refund`}
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
