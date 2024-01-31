import moment from 'moment';
import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
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
import {useNonInitialEffect} from '../../hooks/useNonInitialEffect';
import usePrevious from '../../hooks/usePrevious';
import userAction from '../../redux/actions/user.action';
import useTheme from '../../hooks/useTheme';

export default function CashDrawerTransactions({navigation, route}) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const themeData = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  const userData = useSelector(s => s.user.userData);
  const deviceId = useSelector(s => s.user.deviceId);
  const cashDrawerTrasactions = useSelector(s => s.user.cashDrawerTrasactions);
  const [refresh, setRefresh] = useState(true);
  let prevCurrentPage = usePrevious(cashDrawerTrasactions.currentPage);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  useEffect(() => {
    dispatch(
      userAction.set({
        _prop: 'cashDrawerTrasactions',
        values: {
          currentPage: 1,
        },
      }),
    );

    loadData(true);
  }, []);
  useNonInitialEffect(() => {
    loadData(prevCurrentPage >= cashDrawerTrasactions.currentPage);
  }, [cashDrawerTrasactions.currentPage, refresh]);
  const loadData = async _refresh => {
    setLoaded(false);
    let r = await dispatch(
      userAction.getCashDrawerTrasactions(
        {
          device_id: deviceId,
          location_id: selectedLocation,
          page: cashDrawerTrasactions.currentPage,
          limit: 25,
        },
        userData.restaurant.id,
        _refresh,
        false,
      ),
    );
    setLoaded(true);
  };

  const columns = useMemo(() => {
    return [
      {
        title: 'Date',
        renderValue: data => {
          return moment(data.created_at).format('DD MMM, YYYY hh:mm A');
        },
      },
      {
        title: 'Reason',
        key: 'reason',
      },
      // {
      //   title: 'Type',
      //   renderCell: data => {
      //     return <Text bold color={data.type == '1' ?'green':'red'}>{data.type == '1' ? 'Credit' : 'Debit'}</Text>;
      //   },
      //   // align: 'right',
      // },

      {
        title: 'Amount',
        renderCell: data => {
          return (
            <Text bold color={data.type == '1' ? 'green' : 'red'}>
              {data.type == '1' ? '' : '-'} $
              {parseFloat(data.amount).toFixed(2)}
            </Text>
          );
        },
        align: 'right',
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
      <Header title={'Cash Drawer Transactions'} back />
      <Container style={{flex: 1, backgroundColor: themeData.cardBg}}>
        <Table
          data={cashDrawerTrasactions.data}
          columns={columns}
          refreshing={!loaded}
          onRefresh={() => {
            dispatch(
              userAction.set({
                _prop: 'cashDrawerTrasactions',
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
            if (
              loaded &&
              cashDrawerTrasactions.totalPage >
                cashDrawerTrasactions.currentPage
            ) {
              dispatch(
                userAction.set({
                  _prop: 'cashDrawerTrasactions',
                  values: {
                    currentPage: cashDrawerTrasactions.currentPage + 1,
                  },
                }),
              );
            }
          }}
          progressViewOffset={0}
        />
      </Container>
    </>
  );
}
