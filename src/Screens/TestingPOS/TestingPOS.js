import React, {useEffect, useMemo, useState} from 'react';
import {PermissionsAndroid, TouchableOpacity, View} from 'react-native';
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
import appAction from '../../redux/actions/app.action';
export default function TestingPOS({navigation, route}) {
  const dispatch = useDispatch();

  useEffect(() => {
    POSModule.initSDK();


   loadData();


  }, []);

const loadData=async()=>{
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE],
      {
        title: 'Camera Permission',
        message:
          'Needs access to your camera ' +
          'so you can take pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //   console.log('You can use the camera');
    // } else {
    //   console.log('Camera permission denied');
    // }
  } catch (err) {
    console.warn(err);
  }
}

  const readCard = type => {
    dispatch(appAction.showProgress('Searching...'));
    POSModule.readCard({type: type}, res => {
      dispatch(appAction.hideProgress());
      console.log('[readCard]', res);
      alert(JSON.stringify(res));
    });
  };
  return (
    <>
      <Header title={'Testing POS'} back />
      <Container
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: 20,
          flexWrap: 'wrap',
        }}>
        <Button
          // style={{}}
          // backgroundColor="#00000000"
          noShadow
          // bold
          // color="#212121"
          mr={10}
          mb={10}
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
          mb={10}
          onPress={() => {
            POSModule.cutPaperPrint();
          }}>
          Cut paper
        </Button>
        <Button
          mr={10}
          mb={10}
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
          mb={10}
          onPress={() => {
            POSModule.scanHQRCode(
              {id: 22, name: 'aakash', active: true},
              res => {
                console.log('[scanHQRCode]', res);
                alert(JSON.stringify(res));
              },
            );
          }}>
          Scan QR Code
        </Button>
        <Button
          mr={10}
          mb={10}
          onPress={() => {
            readCard('ic');
          }}>
          IC Card
        </Button>
        <Button
          mr={10}
          mb={10}
          onPress={() => {
            POSModule.initFinixSDK(
              {
                env: 'sandbox',
                username: 'USss1r5jqUXgpndmp5vyEuBK',
                password: '5433ee5f-2c8b-4289-b5aa-0e2394144703',
                merchantId: 'MUeCcC7PToWcsgexGaERJ7jC',
                deviceId: 'DVtTMarXFnyVU6NmiMLTmvzb',
                deviceIdentifier: '3011087727539064',
              },
              res => {
                console.log('[initFinixSDK]', res);
                alert(JSON.stringify(res));
              },
            );
          }}>
          Init Finix Payment SDK
        </Button>
      </Container>
    </>
  );
}
