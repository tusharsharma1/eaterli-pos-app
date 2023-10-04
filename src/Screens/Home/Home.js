import {convertDistance, getPreciseDistance} from 'geolib';
import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AppLoader from '../../components/AppLoader';
import Container from '../../components/Container';
import Header from '../../components/Header';
import {getPercentValue, showToast} from '../../helpers/app.helpers';
import {getCurrentPosition} from '../../helpers/location.helper';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import userAction from '../../redux/actions/user.action';
import CartView from '../components/CartView';
import CategoryGrid from '../components/CategoryGrid';
import MenuItemGrid from '../components/MenuItemGrid';
import Button from '../../components/Button';
import Text from '../../components/Text';
import theme from '../../theme';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import POSModule from '../../helpers/pos.helper';
import ModalContainer from '../../components/ModalContainer';
import orderAction from '../../redux/actions/order.action';
import {DINING_OPTION} from '../../constants/order.constant';
import GiftCardsModal from '../components/GiftCardsModal';
import ScanOfferModal from '../components/ScanOfferModal';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  requestMultiple,
} from 'react-native-permissions';
export default function Home(props) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [logs, setLogs] = useState([]);
  const userData = useSelector(s => s.user.userData);
  const diningOption = useSelector(s => s.order.diningOption);
  const diningOptionModal = useSelector(s => s.order.diningOptionModal);

  let {width} = useWindowDimensions();

  useEffect(() => {
    POSModule.initSDK();
    setLogs([]);
    loadData();
  }, []);

  const loadData = async () => {
    if (userData) {
      let {locations, restaurant} = userData;
      let start = {latitude: 0, longitude: 0};
      setLogs(_logs => [..._logs, 'fetching location....']);
      let l = await getCurrentPosition().catch(e => {
        console.log('distL CurrentPosition error', e);
        setLogs(_logs => [..._logs, `getCurrentPosition Error`]);
        // alert(e.message);
      });
      setLogs(_logs => [..._logs, `fetched location ${JSON.stringify(l)}`]);
      // console.log('distL l', l);
      if (l && l.position) {
        start = {
          latitude: l.position.coords.latitude,
          longitude: l.position.coords.latitude,
        };
      }
      // console.log(start);
      let distL = locations.map(r => {
        let end = {
          latitude: r.lat ? parseFloat(r.lat) : 0,
          longitude: r.long ? parseFloat(r.long) : 0,
        };
        let dist = getPreciseDistance(start, end);
        let miDist = Math.round(convertDistance(dist, 'mi'));
        // console.log(end, dist, miDist);
        return {dist: miDist, ...r};
      });
      // console.log('distL', distL);
      distL = distL.sort((a, b) => a.dist - b.dist)[0];
      //  console.log('distL', start, distL);
      setLogs(_logs => [..._logs, `set  location ${distL?.id}`]);

      // setNearByLocation(distL);
      // console.log('Promise',Promise.allSettled);

      // await dispatch(
      //   userAction.getMobileBuilder(userData.restaurant.id, false),
      // );
      // console.time('prom');

      // await dispatch(userAction.getVariations(restaurant.id, false));
      // console.timeLog('prom', 2);

      if (distL) {
        dispatch(
          userAction.set({
            selectedLocation: distL.id,
          }),
        );
        setLogs(_logs => [..._logs, `Calling Apis..`]);

        // dispatch(userAction.set({selectedLocation: location.id}));
        await Promise.all([
          dispatch(userAction.getMenuTitle(restaurant.id, false)),
          dispatch(userAction.getVariations(restaurant.id, false)),
          dispatch(
            userAction.getMenus(distL.id, userData.restaurant.id, false),
          ),
          dispatch(userAction.getAddons(distL.id, '', false)),
        ]);
        setLogs(_logs => [..._logs, `Calling Apis done`]);
        // await dispatch(userAction.getMenus(distL.id, false));

        // console.timeLog('prom', 3);
        // await dispatch(userAction.getAddons(distL.id, '', false));
      }
      // console.timeEnd('prom');
    }
    setLogs(_logs => [..._logs, `End`]);
    toggleModal();

    setLoaded(true);

    let r = await requestMultiple([
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.CAMERA,
    ]).catch(error => {
      console.log('requestMultiple error', error);
    });
    console.log('requestMultiple result', r);
  };
  //
  const toggleModal = () => {
    dispatch(
      orderAction.set({
        diningOptionModal: {show: !diningOptionModal.show, ref: ''},
      }),
    );
  };
  return (
    <>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <Header title={'Eaterli POS'} />
          {loaded && (
            <Container style={{flex: 1}}>
              <CategoryGrid />
              <MenuItemGrid />
            </Container>
          )}
        </View>
        <View
          style={{
            width: getPercentValue(width, 34),
            backgroundColor: '#ddd',
          }}>
          <CartView />
        </View>

        <View
          style={{
            // width: 50,
            backgroundColor: theme.colors.secondaryColor,
            paddingHorizontal: 5,
            paddingVertical: 5,
          }}>
          <Container scroll showsVerticalScrollIndicator={false}>
            <IconBtn
              text="Menu"
              iconName="desktop"
              onPress={() => {
                props.navigation.navigate('ProductMenu');
              }}
            />
            <IconBtn text="Customers" iconName="users" />
            <IconBtn
              text="Orders"
              iconName="clipboard"
              onPress={() => {
                props.navigation.navigate('Orders');
              }}
            />
             <IconBtn
              text="Active Orders"
              iconName="clipboard"
              onPress={() => {
                props.navigation.navigate('ActiveOrders');
              }}
            />
            <IconBtn
              text="Scan Offer"
              iconName="star"
              onPress={() => {
                dispatch(
                  userAction.set({
                    scanOfferModal: {show: true, ref: ''},
                  }),
                );
              }}
            />
            <IconBtn
              text="Gift Cards"
              iconName="id-card"
              onPress={() => {
                dispatch(
                  userAction.set({
                    giftCardModal: {show: true, ref: ''},
                  }),
                );
              }}
            />
            <IconBtn
              text="Clock In/Out"
              iconName="clock"
              onPress={() => {
                props.navigation.navigate('CheckInOut');
              }}
            />
            <IconBtn
              text="Testing"
              iconName="print"
              onPress={() => {
                props.navigation.navigate('TestingPOS');
                // POSModule.printByAllInOnePOS(
                //   {id: 22, name: 'aakash', active: true},
                //   res => {
                //     console.log('[printByAllInOnePOS]', res);
                //     // alert(JSON.stringify(res));
                //   },
                // );
              }}
            />
            <IconBtn
              text="No Sale"
              iconName="dollar-sign"
              onPress={() => {
                POSModule.doOpenCashBox();
              }}
            />
            <IconBtn
              text="Adjust Float"
              // onPress={}
              iconName="retweet"
            />
            <IconBtn
              text="Dining Option"
              subText={DINING_OPTION[diningOption]?.text}
              iconName="utensils"
              onPress={() => {
                toggleModal();
              }}
            />
            <IconBtn
              text="Scan Reader"
              iconName="qrcode"
              onPress={async () => {
                // We need to ask permission for Android only
                if (Platform.OS === 'android') {
                  // Calling the permission function
                  const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                      title: 'Eaterli POS Camera Permission',
                      message: 'Eaterli POS needs access to your camera',
                    },
                  );
                  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Permission Granted
                    POSModule.scanQRCode();
                  } else {
                    // Permission Denied
                    alert('CAMERA Permission Denied');
                  }
                }
              }}
            />
          </Container>
        </View>

        <ModalContainer
          // hideTitle
          center
          // noscroll
          onRequestClose={toggleModal}
          visible={diningOptionModal.show}
          title={`Dining Option`}
          width={350}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <DiningItem
              iconName="utensils"
              text={DINING_OPTION.dine_in.text}
              onPress={() => {
                dispatch(
                  orderAction.set({
                    diningOption: DINING_OPTION.dine_in.id,
                  }),
                );
                toggleModal();
                if (diningOptionModal.ref == 'pay-btn') {
                  dispatch(
                    orderAction.set({
                      payModal: {show: true, ref: ''},
                    }),
                  );
                }
              }}
            />
            <DiningItem
              iconName="utensils"
              text={DINING_OPTION.take_out.text}
              onPress={() => {
                dispatch(
                  orderAction.set({
                    diningOption: DINING_OPTION.take_out.id,
                  }),
                );
                toggleModal();
                if (diningOptionModal.ref == 'pay-btn') {
                  dispatch(
                    orderAction.set({
                      payModal: {show: true, ref: ''},
                    }),
                  );
                }
              }}
            />
          </View>
        </ModalContainer>

        <GiftCardsModal />
        <ScanOfferModal />

        {!loaded && <AppLoader message={'Loading'} />}
      </View>
    </>
  )
}

function IconBtn({
  text,
  subText,
  onPress,
  iconName,
  IconComponent = FontAwesome5Icon,
}) {
  let {width} = useWindowDimensions();
  let w = Math.min(117, getPercentValue(width, 12));

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        width: w,
        backgroundColor: '#eee',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: getPercentValue(w, 9),
        paddingHorizontal: getPercentValue(w, 8),
        marginBottom: 5,
      }}>
      <IconComponent
        color={'#9a9a9a'}
        size={getPercentValue(w, 16)}
        name={iconName}
      />
      <Text semibold mt={getPercentValue(w, 5)} size={getPercentValue(w, 11)}>
        {text}
      </Text>
      {!!subText && (
        <Text semibold size={getPercentValue(w, 10)}>
          {subText}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function DiningItem({
  text,
  iconName,
  IconComponent = FontAwesome5Icon,
  onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 20,
        // borderBottomColor: '#eee',
        // borderBottomWidth: 1,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eee',
        borderRadius: 5,
      }}>
      <IconComponent color={'#9a9a9a'} size={18} name={iconName} />
      <Text medium mt={10} size={16}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
