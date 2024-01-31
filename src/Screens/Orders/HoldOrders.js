import moment from 'moment';
import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Table from '../../components/Table';
import {ALERT_ICON_TYPE, ALERT_TYPE} from '../../constants/alert.constant';
import useTheme from '../../hooks/useTheme';
import alertAction from '../../redux/actions/alert.action';
import orderAction from '../../redux/actions/order.action';
import theme from '../../theme';
export default function HoldOrders({navigation, route}) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const themeData = useTheme();
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
                pv={4}
                borderRadius={4}
                backgroundColor={theme.colors.primaryColor}>
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
      <Container style={{flex: 1,backgroundColor:themeData.cardBg}}>
        <Table data={holdCarts} columns={columns} />
      </Container>
    </>
  );
}
