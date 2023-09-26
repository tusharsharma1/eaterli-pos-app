import React, {useEffect, useMemo, useState} from 'react';
import {Image, PermissionsAndroid, TouchableOpacity, View} from 'react-native';
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
import {showToast, simpleToast} from '../../helpers/app.helpers';
import RNPrint from 'react-native-print';
import PinKeyBoard from '../../components/PinKeyBoard';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import {
  CHECK_IN_OUT_STATUS,
  CHECK_IN_OUT_VIEW,
} from '../../constants/user.constant';
let contentH = 550;
let initH = false;
export default function CheckInOut({navigation, route}) {
  const dispatch = useDispatch();
  const userData = useSelector(s => s.user.userData);
  const deviceId = useSelector(s => s.user.deviceId);

  const {height, width, isPortrait} = useWindowDimensions();
  const [bH, setBH] = useState(height);
  const [pinKbRef, setPinKBRef] = useState(null);
  const [staffData, setStaffData] = useState(null);
  const [view, setView] = useState(CHECK_IN_OUT_VIEW.passcode.id);
  const selectedLocation = useSelector(s => s.user.selectedLocation);

  useEffect(() => {
    loadData();
    return () => {
      setView(CHECK_IN_OUT_VIEW.passcode.id);
    };
  }, []);

  const loadData = async () => {};
  const onCompleted = async pin => {
    console.log(pin);
    let {locations, restaurant} = userData;
    let r = await dispatch(
      userAction.validateCheckInPasscode(restaurant.id, {
        passcode: pin,
      }),
    );
    if (r && r.status) {
      pinKbRef && pinKbRef.setPin([]);
      setStaffData(r.data);
      if (
        r.data?.check_in_out_last_status?.status ==
        CHECK_IN_OUT_STATUS.check_in.id
      ) {
        setView(CHECK_IN_OUT_VIEW.check_out.id);
      } else {
        setView(CHECK_IN_OUT_VIEW.check_in.id);
      }
    } else {
      pinKbRef && pinKbRef.setPin([]);
      !!r.message && showToast(r.message, 'error');
    }
  };
  const checkInPress = async () => {
    let {locations, restaurant} = userData;
    let r = await dispatch(
      userAction.updateCheckInStatus(restaurant.id, staffData?.id, {
        status: CHECK_IN_OUT_STATUS.check_in.id,
        device_name: deviceId,
        restaurant_location_id: selectedLocation,
      }),
    );
    if (r && r.status) {
      setView(CHECK_IN_OUT_VIEW.success.id);
      !!r.message && showToast(r.message);
    } else {
      !!r.message && showToast(r.message, 'error');
    }
  };

  const checkOutPress = async () => {
    let {locations, restaurant} = userData;
    let r = await dispatch(
      userAction.updateCheckInStatus(restaurant.id, staffData?.id, {
        status: CHECK_IN_OUT_STATUS.check_out.id,
        device_name: deviceId,
        restaurant_location_id: selectedLocation,
      }),
    );
    if (r && r.status) {
     
      !!r.message && showToast(r.message);
      navigation.goBack();
    } else {
      !!r.message && showToast(r.message, 'error');
    }
  };
  const renderView = () => {
    switch (view) {
      case CHECK_IN_OUT_VIEW.passcode.id:
        return (
          <View
            style={{
              backgroundColor: theme.colors.primaryColor,
              width: 500,
              height: 500,
              borderRadius: 300,
              // alignItems: 'center',

              justifyContent: 'center',
              paddingHorizontal: 80,
              transform: [
                {scale: bH / contentH},
                // {translateY: (bH - contentH) / 2},
              ],
            }}>
            <PinKeyBoard
              getRef={ref => {
                setPinKBRef(ref);
              }}
              onCompleted={onCompleted}
            />
          </View>
        );

      case CHECK_IN_OUT_VIEW.check_in.id:
        return (
          <View
            style={{
              alignItems: 'center',
            }}>
            <Text align="center" bold size={24} mb={10}>
              {staffData?.first_name} {staffData?.last_name}
            </Text>
            <Button onPress={checkInPress}>Clock In</Button>
          </View>
        );

      case CHECK_IN_OUT_VIEW.check_out.id:
        return (
          <View
            style={{
              alignItems: 'center',
            }}>
            <Text align="center" bold size={24} mb={10}>
              {staffData?.first_name} {staffData?.last_name}
            </Text>
            <Button onPress={checkOutPress}>Clock Out</Button>
          </View>
        );
      case CHECK_IN_OUT_VIEW.success.id:
        return (
          <View
            style={{
              alignItems: 'center',
            }}>
            <Text align="center" bold size={24} mb={10}>
              {staffData?.first_name} {staffData?.last_name}
            </Text>
            <Text align="center" semibold size={24} mb={10}>
              {moment().format('hh:mm A')}
            </Text>
            <Text align="center" size={24} mb={10}>
              Clocked In
            </Text>
            <Button
              onPress={() => {
                navigation.goBack();
              }}>
              Continue to POS
            </Button>
          </View>
        );
    }
    return null;
  };

  return (
    <>
      <Header title={'Clock In/Out'} back />
      <Container
        style={{
          flex: 1,
          // flexDirection: 'row',
          alignItems: 'center',
          // padding: 20,
          // flexWrap: 'wrap',
        }}
        onLayout={e => {
          if (!isPortrait) {
            setBH(e.nativeEvent.layout.height);
            console.log('isPortrait');
          }
          if (!initH) {
            setBH(e.nativeEvent.layout.height);
            initH = true;
            console.log('init');
          }
          // console.log('body',
          //   e.nativeEvent.layout,
          //   theme.screenHeight,
          //   theme.screenHeight / 725,
          // );
        }}>
        {renderView()}
        {/* <Image
          style={{
            width: 300,
            height: 50,
            resizeMode: 'contain',
            // backgroundColor:'red'
            marginBottom: 21,
          }}
          source={require('../../assets/images/logo.png')}
        /> */}
      </Container>
    </>
  );
}
