import React, {useEffect, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Table from '../../components/Table';
import moment from 'moment';
import ModalContainer from '../../components/ModalContainer';
import ProgressImage from '../../components/react-native-image-progress';
import Text from '../../components/Text';
import theme from '../../theme';
import {PAYMENT_METHOD} from '../../constants/order.constant';
import {dummyImage} from '../../assets';
import userAction from '../../redux/actions/user.action';
import {getAddons, getVariants} from '../../helpers/order.helper';
import POSModule from '../../helpers/pos.helper';
import Button from '../../components/Button';
export default function TestingPOS({navigation, route}) {
  const dispatch = useDispatch();

  useEffect(() => {
    POSModule.initSDK();
  }, []);

  return (
    <>
      <Header title={'Testing POS'} back />
      <Container
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: 20,
        }}>
        <Button
          // style={{}}
          // backgroundColor="#00000000"
          noShadow
          // bold
          // color="#212121"
          mr={10}
          onPress={() => {
            POSModule.doOpenCashBox();
          }}>
          Open Cashbox
        </Button>
         <Button
          // style={{}}
          // backgroundColor="#00000000"
          noShadow
          // bold
          // color="#212121"
          mr={10}
          onPress={() => {
            POSModule.cutPaperPrint();
          }}>
         Cut paper
        </Button>
        <Button
         mr={10}
          onPress={() => {
            POSModule.textPrint({id: 22, name: 'aakash', active: true}, res => {
              console.log('[textPrint]', res);
              alert(JSON.stringify(res));
            });
          }}>
          Test Printer
        </Button>
         <Button
          mr={10}
          onPress={() => {
            POSModule.scanHQRCode({id: 22, name: 'aakash', active: true}, res => {
              console.log('[scanHQRCode]', res);
              alert(JSON.stringify(res));
            });
          }}>
          Scan QR Code
        </Button>
      </Container>
    </>
  );
}
