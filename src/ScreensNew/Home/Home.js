import React, {useEffect, useState} from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import Text from '../../components/Text';
import {ORDER_STATUS} from '../../constants/order.constant';
import {
  registerPushNotification,
  unRegisterPushNotification,
} from '../../firebase/firebase-notification.helper';
import {displayNotification} from '../../firebase/notification-service';
import {getPercentValue} from '../../helpers/app.helpers';
import POSModule from '../../helpers/pos.helper';
import {loadPrinters} from '../../helpers/printer.helper';
import storageHelper from '../../helpers/storage.helper';
import {getNearRestaurantLocation} from '../../helpers/user.helper';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import appAction from '../../redux/actions/app.action';
import orderAction from '../../redux/actions/order.action';
import userAction from '../../redux/actions/user.action';
import LeftMenu from '../../components/app/LeftMenu';
import RightMenu from '../../components/app/RightMenu';
import useTheme from '../../hooks/useTheme';
import Container from '../../components/Container';
import CategoryGrid from '../../Screens/components/CategoryGrid';
import MenuItemGrid from '../../Screens/components/MenuItemGrid';
import CartView from '../../Screens/components/CartView';
export default function Home(props) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [logs, setLogs] = useState([]);
  const deviceToken = useSelector(s => s.user.deviceToken);
  const userData = useSelector(s => s.user.userData);
  const diningOption = useSelector(s => s.order.diningOption);
  const diningOptionModal = useSelector(s => s.order.diningOptionModal);
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  const themeData = useTheme();
  const totalActiveOrder = useSelector(s => s.user.totalActiveOrder);

  let {width} = useWindowDimensions();

  useEffect(() => {
    POSModule.initSDK();
    setLogs([]);
    loadData();
    loadPrinters();
    registerPushNotification(onRegister, onNotification, onOpenNotification);
    return () => {
      unRegisterPushNotification();
    };
  }, [userData]);
  useEffect(() => {
    loadTotalActiveOrder();
  }, [selectedLocation]);

  const loadData = async () => {
    let distL = await getNearRestaurantLocation();
    let {locations, restaurant} = userData;
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
        dispatch(userAction.getMenus(distL.id, userData.restaurant.id, false)),
        dispatch(
          userAction.getAddons(userData.restaurant.id, distL.id, '', false),
        ),
      ]);

      await dispatch(
        userAction.updateDeviceLocation(userData.restaurant.id, {
          location_id: distL.id,
          type: 'pos',
          device_token: deviceToken,
        }),
      );

      setLogs(_logs => [..._logs, `Calling Apis done`]);
      // await dispatch(userAction.getMenus(distL.id, false));

      // console.timeLog('prom', 3);
      // await dispatch(userAction.getAddons(distL.id, '', false));
    }

    // if (userData) {
    //   let {locations, restaurant} = userData;
    //   let start = {latitude: 0, longitude: 0};
    //   setLogs(_logs => [..._logs, 'fetching location....']);
    //   let l = await getCurrentPosition().catch(e => {
    //     console.log('distL CurrentPosition error', e);
    //     setLogs(_logs => [..._logs, `getCurrentPosition Error`]);
    //     // alert(e.message);
    //   });
    //   setLogs(_logs => [..._logs, `fetched location ${JSON.stringify(l)}`]);
    //   // console.log('distL l', l);
    //   if (l && l.position) {
    //     start = {
    //       latitude: l.position.coords.latitude,
    //       longitude: l.position.coords.longitude,
    //     };
    //   }
    //   // console.log(start);
    //   let distL = locations.map(r => {
    //     let end = {
    //       latitude: r.lat ? parseFloat(r.lat) : 0,
    //       longitude: r.long ? parseFloat(r.long) : 0,
    //     };
    //     let dist = getPreciseDistance(start, end);
    //     let miDist = Math.round(convertDistance(dist, 'mi'));
    //     // console.log(end, dist, miDist);
    //     return {dist: miDist, ...r};
    //   });
    //   // console.log('distL', distL);
    //   distL = distL.sort((a, b) => a.dist - b.dist)[0];
    //   //  console.log('distL', start, distL);
    //   setLogs(_logs => [..._logs, `set  location ${distL?.id}`]);

    //   // setNearByLocation(distL);
    //   // console.log('Promise',Promise.allSettled);

    //   // await dispatch(
    //   //   userAction.getMobileBuilder(userData.restaurant.id, false),
    //   // );
    //   // console.time('prom');

    //   // await dispatch(userAction.getVariations(restaurant.id, false));
    //   // console.timeLog('prom', 2);

    //   if (distL) {
    //     dispatch(
    //       userAction.set({
    //         selectedLocation: distL.id,
    //       }),
    //     );
    //     setLogs(_logs => [..._logs, `Calling Apis..`]);

    //     // dispatch(userAction.set({selectedLocation: location.id}));
    //     await Promise.all([
    //       dispatch(userAction.getMenuTitle(restaurant.id, false)),
    //       dispatch(userAction.getVariations(restaurant.id, false)),
    //       dispatch(
    //         userAction.getMenus(distL.id, userData.restaurant.id, false),
    //       ),
    //       dispatch(userAction.getAddons(userData.restaurant.id,distL.id, '', false)),
    //     ]);

    //     await dispatch(
    //       userAction.updateDeviceLocation(userData.restaurant.id, {
    //         location_id: distL.id,
    //         type: 'pos',
    //         device_token: deviceToken,
    //       }),
    //     );

    //     setLogs(_logs => [..._logs, `Calling Apis done`]);
    //     // await dispatch(userAction.getMenus(distL.id, false));

    //     // console.timeLog('prom', 3);
    //     // await dispatch(userAction.getAddons(distL.id, '', false));
    //   }
    //   // console.timeEnd('prom');
    // }
    // setLogs(_logs => [..._logs, `End`]);
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

    let pageWidthLength = await storageHelper.getData('pageWidthLength');

    if (pageWidthLength) {
      dispatch(
        appAction.set({
          pageWidthLength,
        }),
      );
    }
  };

  const loadTotalActiveOrder = async () => {
    if (selectedLocation) {
      let r = await dispatch(
        userAction.getOrdersTotal(userData.restaurant.id, selectedLocation, {
          order_status: ORDER_STATUS.created.id,
        }),
      );
      if (r && r.status) {
        dispatch(
          userAction.set({
            totalActiveOrder: r.data.total,
          }),
        );
      }
    }
  };

  //
  const toggleModal = () => {
    dispatch(
      orderAction.set({
        diningOptionModal: {show: !diningOptionModal.show, ref: ''},
      }),
    );
  };

  const onRegister = token => {
    console.log('[App] onRegister: ', token);
  };

  const onNotification = notify => {
    console.log('[display] [App] onNotification HOme: ', notify);
    if (notify) {
      const options = {
        title: notify.notification.title,
        body: notify.notification.body,
        data: notify.data,
        tag: notify.messageId, // (optional) add tag to message
      };

      displayNotification(options);

      // displayNotification(JSON.parse(notify.data.notifee));

      // localNotificationService.showNotification(
      //   0,
      //   notify.notification.title,
      //   notify.notification.body,
      //   notify,
      //   options,
      // );
    }
  };

  const onOpenNotification = (notify, ref) => {
    console.log('[display] [App] onOpenNotification: ', notify, ref);
    if (notify) {
      let data = notify.data || notify.notification?.data || notify.item;
      console.log('[App] onOpenNotification: data', data);
      if (data) {
        let url = data.url;
        if (url) {
          Linking.openURL(url);
          return;
        }

        // if (data.type == 'SCHEDULE') {

        // }
        // console.log('[App] onOpenNotification: openURL', notify);
        // let screenName = getScreenName(data && data.screen);

        // if (screenName) {
        //   this.props.navigation.navigate(screenName);
        // }
      }
    }
  };
  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: themeData.appBg,
        }}>
        <LeftMenu />
        <View
          style={{
            flex: 1,
            marginBottom: 15,
          }}>
          <View
            style={{
              // backgroundColor:'#000',
              height: 40,
            }}></View>
          <View
            style={{
              backgroundColor: themeData.bodyBg,
              borderRadius: 8,
              flex: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              flexDirection: 'row',
            }}>
            <View
              style={{
                flex: 1.2,
                // backgroundColor: 'red',
              }}>
              {loaded && (
                <Container
                  style={{
                    flex: 1,
                    //  backgroundColor: 'yellow'
                  }}>
                  <CategoryGrid />
                  <MenuItemGrid />
                </Container>
              )}
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: themeData.cardBg,
                borderRadius: 8,
                marginLeft: 10,
              }}>
                <CartView />
              </View>
          </View>
        </View>
        <RightMenu />
      </View>
    </>
  );
}

function IconBtn({
  badge,
  text,
  subText,
  onPress,
  iconName,
  IconComponent = FontAwesome5Icon,
}) {
  let {width} = useWindowDimensions();
  let w = Math.min(117, getPercentValue(width, 12));
  //  badge=99
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
      {!!badge && (
        <View
          style={{
            position: 'absolute',
            top: 5,
            right: 5,
            width: getPercentValue(w, 22),
            height: getPercentValue(w, 22),
            borderRadius: getPercentValue(w, 22),
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text size={getPercentValue(w, 10)} color="#fff">
            {badge > 99 ? '99+' : badge.toString().padStart(2, 0)}
          </Text>
        </View>
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