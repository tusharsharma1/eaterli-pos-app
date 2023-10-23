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
  DELIVERY_TYPE,
  ORDER_STATUS,
  PAYMENT_METHOD,
} from '../../constants/order.constant';
import {getAddons, getVariants} from '../../helpers/order.helper';
import {useNonInitialEffect} from '../../hooks/useNonInitialEffect';
import usePrevious from '../../hooks/usePrevious';
import userAction from '../../redux/actions/user.action';
import OrderDetail from '../components/OrderDetail';
import {showToast} from '../../helpers/app.helpers';
import AddCashDrawerButton from '../CashDrawer/AddCashDrawerButton';
import OptionButton from '../components/OptionButton';
import theme from '../../theme';

export default function ActiveOrders({navigation, route}) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  const deviceId = useSelector(s => s.user.deviceId);
  const userData = useSelector(s => s.user.userData);
  const totalActiveOrder = useSelector(s => s.user.totalActiveOrder);
  const totalOngoingDeliveryOrder = useSelector(
    s => s.user.totalOngoingDeliveryOrder,
  );
  const totalOngoingPickupOrder = useSelector(
    s => s.user.totalOngoingPickupOrder,
  );

  const activeOrders = useSelector(s => s.user.activeOrders);
  const [selectedFilter, setSelectedFilter] = useState(1);

  const [filter, setFilter] = useState({order_status: ORDER_STATUS.created.id});
  const [refresh, setRefresh] = useState(true);
  let prevCurrentPage = usePrevious(activeOrders.currentPage);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  useEffect(() => {
    loadTotalCountOrder();
  }, [refresh]);
  useEffect(() => {
    dispatch(
      userAction.set({
        _prop: 'activeOrders',
        values: {
          currentPage: 1,
        },
      }),
    );

    loadData(true);
  }, [filter]);
  useNonInitialEffect(() => {
    loadData(prevCurrentPage >= activeOrders.currentPage);
  }, [activeOrders.currentPage, refresh]);
  const loadData = async _refresh => {
    setLoaded(false);
    let r = await dispatch(
      userAction.getOrders(
        userData.restaurant.id,
        selectedLocation,
        {
          page: activeOrders.currentPage,
          limit: 25,
          ...filter,
        },
        _refresh,
        'activeOrders',
        false,
      ),
    );
    setLoaded(true);
  };

  const loadTotalCountOrder = async () => {
    if (selectedLocation) {
      let r = await dispatch(
        userAction.getOrdersTotal(
          userData.restaurant.id,
          selectedLocation,
          {
            order_status: ORDER_STATUS.created.id,
          },
          false,
        ),
      );
      if (r && r.status) {
        dispatch(
          userAction.set({
            totalActiveOrder: r.data.total,
          }),
        );
      }

      r = await dispatch(
        userAction.getOrdersTotal(
          userData.restaurant.id,
          selectedLocation,
          {
            delivery_type: DELIVERY_TYPE.pickup.id,
            order_status: ORDER_STATUS.restaurant_confirmed.id,
          },
          false,
        ),
      );
      if (r && r.status) {
        dispatch(
          userAction.set({
            totalOngoingPickupOrder: r.data.total,
          }),
        );
      }

      r = await dispatch(
        userAction.getOrdersTotal(
          userData.restaurant.id,
          selectedLocation,
          {
            delivery_type: DELIVERY_TYPE.delivery.id,
            order_status: ORDER_STATUS.restaurant_confirmed.id,
          },
          false,
        ),
      );
      if (r && r.status) {
        dispatch(
          userAction.set({
            totalOngoingDeliveryOrder: r.data.total,
          }),
        );
      }
    }
  };
  const changeStatus = async (status, params = {}) => {
    let r = await dispatch(
      userAction.updateOrderStatus(userData.restaurant.id, selectedOrder.id, {
        order_status: status,
        device_id: deviceId,
        staff_id: userData.user_id,
        ...params,
      }),
    );

    if (r && r.status) {
      toggleModal();
      loadData(true);
      showToast(r.message);
    }
  };
  const columns = useMemo(() => {
    return [
      {title: 'Order No', align: 'left', key: 'id'},
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
              {/* <TouchableOpacity
                onPress={() => {
                  // setSelectedOrder(data);
                  // toggleModal();
                }}
                style={{
                  // backgroundColor:'red',
                  padding: 4,
                  marginRight: 10,
                }}>
                <FontAwesome5Icon
                  name="pencil-alt"
                  color={'#212121'}
                  size={22}
                />
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
            </View>
          );
        },
        // width: 100,
      },
    ];
  }, []);

  return (
    <>
      <Header title={'Active Orders'} back />
      <Container style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
          }}>
          <OptionButton
            badge={totalActiveOrder}
            color={selectedFilter == 1 ? '#fff' : undefined}
            backgroundColor={
              selectedFilter == 1 ? theme.colors.secondaryColor : undefined
            }
            onPress={() => {
              setSelectedFilter(1);
              setFilter({order_status: ORDER_STATUS.created.id});
            }}
            title={'Pending Order'}
          />
          <OptionButton
            badge={totalOngoingPickupOrder}
            color={selectedFilter == 2 ? '#fff' : undefined}
            backgroundColor={
              selectedFilter == 2 ? theme.colors.secondaryColor : undefined
            }
            onPress={() => {
              setSelectedFilter(2);
              setFilter({
                delivery_type: DELIVERY_TYPE.pickup.id,
                order_status: ORDER_STATUS.restaurant_confirmed.id,
              });
            }}
            title={'Ongoing Pickup'}
          />
          <OptionButton
            badge={totalOngoingDeliveryOrder}
            color={selectedFilter == 3 ? '#fff' : undefined}
            backgroundColor={
              selectedFilter == 3 ? theme.colors.secondaryColor : undefined
            }
            onPress={() => {
              setSelectedFilter(3);
              setFilter({
                delivery_type: DELIVERY_TYPE.delivery.id,
                order_status: ORDER_STATUS.restaurant_confirmed.id,
              });
            }}
            title={'Ongoing Delivery'}
          />
        </View>
        <Table
          data={activeOrders.data}
          columns={columns}
          refreshing={!loaded}
          onRefresh={() => {
            dispatch(
              userAction.set({
                _prop: 'activeOrders',
                values: {
                  currentPage: 1,
                },
              }),
            );
            setRefresh(!refresh);
          }}
          onEndReachedThreshold={0.1}
          onEndReached={r => {
            // console.log('onEndReached', r);
            if (loaded && activeOrders.totalPage > activeOrders.currentPage) {
              dispatch(
                userAction.set({
                  _prop: 'activeOrders',
                  values: {
                    currentPage: activeOrders.currentPage + 1,
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
        landscapeWidth={550}>
        {!!selectedOrder && (
          <OrderDetail
            showAccept
            hideRefund
            data={selectedOrder}
            changeStatus={changeStatus}
          />
        )}
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
