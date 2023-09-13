import React, {useEffect, useState} from 'react';
import {ActivityIndicator, TextInput as _TextInput, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Container from '../../components/Container';
import Header from '../../components/Header';
import {
  getPercentValue,
  showToast,
  simpleToast,
} from '../../helpers/app.helpers';
import Text from '../../components/Text';
import userAction from '../../redux/actions/user.action';
import AppLoader from '../../components/AppLoader';
import theme from '../../theme';
import Button from '../../components/Button';
import {getTotalRewardBagPoints} from '../../helpers/order.helper';
const Buffer = require('buffer').Buffer;
export default function ScanRewardBagQR({navigation, route}) {
  const dispatch = useDispatch();
  const [QRData, setQRData] = useState(''); //WzYsMjc1LDdd
  const userData = useSelector(s => s.user.userData);
  const rewards = useSelector(s => s.user.rewards);
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  const diningOption = useSelector(s => s.order.diningOption);
  const deviceId = useSelector(s => s.user.deviceId);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState(0);
  const [scanData, setScanData] = useState(null);
  // const [customerData, setCustomerData] = useState(null);
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    await dispatch(userAction.getRewards(userData.restaurant.id, false));
    setLoaded(true);
  };
  const QRValidating = async () => {
    if (QRData) {
      let jsonob = null;
      // console.log(QRData);
      try {
        let json = Buffer.from(QRData, 'base64').toString('utf8');

        console.log(json);
        jsonob = JSON.parse(json);
      } catch {
        jsonob = null;
      }
      jsonob = jsonob || [];
      let [type,id, uid, rid] = jsonob;
      // console.log(id, rid);
      if (jsonob && type=='reward'&& id && uid && rid && rid == userData.restaurant.id) {
        // console.log(jsonob);
        //   let u = await dispatch(userAction.getCustomerDetail(rid, uid));
        //  if(u && u.status){
        //   setCustomerData(u.data);
        //  }
        let r = await dispatch(userAction.getRewardBag(rid, id));
        if (r && r.status) {
          if(r.data){
            setScanData(r.data);
            setView(1);
          }else{
            simpleToast('Reward Bag not found.');
          }
         
          // dispatch(
          //   orderAction.set({
          //     customerDetail: {
          //       phoneNo: r.data.phone || '',
          //       email: r.data.email || '',
          //       firstName: r.data.first_name || '',
          //       lastName: r.data.last_name || '',
          //     },
          //   }),
          // );
        } else {
          simpleToast('Invalid QR Code.');
          // setQRValue('');
          // setQRData({error: true, message: 'Invalid QR Code.'});
        }
      } else {
        simpleToast('Invalid QR Code.');
      }
      // setValidating(false);
    }
  };
  const redeemPoint = async () => {
    let body = {
      bag_id: scanData.id,
      user_id: scanData.user_id,
      device_id: deviceId,
      dining_option: diningOption,
      restaurant_id: userData.restaurant.id,
      restaurant_location_id: selectedLocation,
      staff_id: userData.user_id,
    };
    let r = await dispatch(userAction.createRewardBagOrder(body));
    if (r && r.status) {
      showToast(r.message);
      navigation.goBack();
    }
  };
  const renderView = () => {
    if (view == 0) {
      return (
        <View
          style={{
            flex: 1,
            // width: '100%',
            // height: getPercentValue(height, 60),
            alignItems: 'center',
            justifyContent: 'center',
            // paddingVertical: 10,
            // backgroundColor: 'red',
          }}>
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
            }}>
            <ActivityIndicator size={'large'} />
            <Text>Scanning...</Text>
          </View>
          <_TextInput
            style={{
              backgroundColor: '#000000',
              color: '#00000000',
              opacity: 0.1,
              width: '100%',
              height: '100%',
              zIndex: 2,
              textAlignVertical: 'top',
            }}
            caretHidden
            selectionColor={'#00000000'}
            autoFocus
            showSoftInputOnFocus={false}
            returnKeyType="next"
            value={QRData}
            onChangeText={t => {
              setQRData(t);
            }}
            onSubmitEditing={() => {
              QRValidating();
            }}
          />
        </View>
      );
    } else if (view == 1) {
      if (scanData) {
        let bagJson = JSON.parse(scanData.bag_json);
        let totalPoints = getTotalRewardBagPoints(bagJson);
        return (
          <>
            <Container
              scroll
              style={{
                flex: 1,
                paddingHorizontal: theme.paddingHorizontal,
                paddingTop: 10,
              }}>
              {bagJson.map(r => {
                let reward = rewards.find(d => d.id == r.id);
                if (!reward) return null;

                let menuItem = reward.menu_item;
                return (
                  <View
                    key={r.id}
                    style={{
                      paddingHorizontal: 10,
                      backgroundColor: '#fff',
                      paddingVertical: 5,
                      borderRadius: 8,
                      marginBottom: 10,
                    }}>
                    <Text bold>{menuItem?.item_name || reward.title}</Text>
                    <Text medium>Qty- {r.qty}</Text>

                    <Text medium>Points- {reward.points}</Text>
                    <Text medium>
                      Total Points- {parseInt(reward.points) * parseInt(r.qty)}
                    </Text>
                  </View>
                );
              })}
            </Container>
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: theme.paddingHorizontal,
              }}>
              <Button ph={30} style={{
                alignSelf:'center'
              }} onPress={redeemPoint}>
                Redeem Points - {totalPoints}
              </Button>
            </View>
          </>
        );
      }
    }
    return null;
  };

  if (!loaded) {
    return <AppLoader message={'Loading'} />;
  }
  return (
    <>
      <Header title={'Scan Reward Bag QR'} back />
      <Container
        // scroll
        style={{
          flex: 1,
          // flexDirection: 'row',

          // padding: 20,
        }}
        contentContainerStyle={{
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}>
        {renderView()}
      </Container>
    </>
  );
}
