import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import Container from '../../components/Container';
import Header from '../../components/Header';
import PinKeyBoard from '../../components/PinKeyBoard';
import Text from '../../components/Text';
import {
  CHECK_IN_OUT_STATUS,
  CHECK_IN_OUT_VIEW,
} from '../../constants/user.constant';
import {dateToTimeFormat, showToast} from '../../helpers/app.helpers';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import userAction from '../../redux/actions/user.action';
import theme from '../../theme';
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
      // setView(CHECK_IN_OUT_VIEW.passcode.id);
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
                {translateY: (bH - contentH) / 4},
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
            <Text align="center" color="#555" bold size={22} mb={0}>
              {moment().format('hh:mm A')}
            </Text>
            <Text align="center" color="#555" medium size={20} mb={10}>
              {moment().format('dddd MMMM DD, YYYY')}
            </Text>
            <Button onPress={checkInPress}>Clock In</Button>
          </View>
        );

      case CHECK_IN_OUT_VIEW.check_out.id:
        let date = staffData?.check_in_out_last_status?.created_at
          ? new Date(staffData?.check_in_out_last_status?.created_at)
          : new Date();

        let timeData = dateToTimeFormat(date);
        console.log('timeData --', timeData);
        return (
          <View
            style={{
              alignItems: 'center',
            }}>
            <Text align="center" bold size={24} mb={10}>
              {staffData?.first_name} {staffData?.last_name}
            </Text>
            <Text align="center" color="#555" bold size={22} mb={0}>
              {moment().format('hh:mm A')}
            </Text>
            <Text align="center" color="#555" medium size={20} mb={10}>
              {moment().format('dddd MMMM DD, YYYY')}
            </Text>

            <Text align="center" color="#555" size={18} mb={10}>
              {timeData.hours ? `${timeData.hours} hrs` : ''}{' '}
              {timeData.minutes ? `${timeData.minutes} mins` : ''} worked so far
              today
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
            <Text align="center" color="#555" bold size={22} mb={0}>
              {moment().format('hh:mm A')}
            </Text>
            <Text align="center" color="#555" medium size={20} mb={10}>
              {moment().format('dddd MMMM DD, YYYY')}
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
