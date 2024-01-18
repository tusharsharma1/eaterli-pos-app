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
import Button from '../../components/Button';
import orderAction from '../../redux/actions/order.action';
export default function HoldOrders({navigation, route}) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const holdCarts = useSelector(s => s.order.holdCarts);

  const columns = useMemo(() => {
    return [
      {
        title: 'Date',
        renderValue: data => {
          return moment(data.date).format('DD MMM, YYYY hh:mm A');
        },
      },
      {
        title: 'Products',
        renderValue: data => {
          return Object.values(data.cart).length;
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
              <Button
                onPress={() => {
                  dispatch(
                    alertAction.showAlert({
                      type: ALERT_TYPE.CONFIRM,
                      icon: ALERT_ICON_TYPE.CONFIRM,
                      text: 'Do you want to Continue this order?',
                      heading: 'Confirmation',
                      positiveText: 'Yes',
                      onPositivePress: async () => {
                        let state = React.store.getState();
                        let {holdCarts} = state.order;
                        let _holdCarts = holdCarts.filter(d => d.id != data.id);
                        dispatch(
                          orderAction.set({
                            holdCarts: _holdCarts,
                            cart: data.cart,
                          }),
                        );
                        navigation.goBack();
                      },
                    }),
                  );
                }}
                size={12}
                pv={4}>
                Continue
              </Button>
            </View>
          );
        },
        // width: 100,
      },
    ];
  }, []);

  return (
    <>
      <Header title={'Hold Orders'} back />
      <Container style={{flex: 1}}>
        <Table data={holdCarts} columns={columns} />
      </Container>
    </>
  );
}
