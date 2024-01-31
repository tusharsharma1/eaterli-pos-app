import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import SplashView from '../components/SplashView';
import {loginFromKeyChain} from '../helpers/user.helper';

import {getUniqueId} from 'react-native-device-info';
import {useDispatch, useSelector} from 'react-redux';
import userAction from '../redux/actions/user.action';
import theme from '../theme';

import crashlytics from '@react-native-firebase/crashlytics';
const Stack = createNativeStackNavigator();
let initCrashlytics = false;
function Navigator() {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState('Login');
  const userData = useSelector(s => s.user.userData);
  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    // console.log('initCrashlytics ll', initCrashlytics, userData);
    if (!initCrashlytics && userData) {
      loadCrashlytics();
    }
  }, [userData]);

  const loadCrashlytics = async () => {
    console.log(
      'initCrashlytics',
      false,
      crashlytics().isCrashlyticsCollectionEnabled,
    );
    crashlytics().log('User signed in.');
    // await Promise.all([
    crashlytics()
      .setUserId(`${userData.user_id}`)
      .catch(e => {
        console.log('initCrashlytics setUserId error', e);
      });

    crashlytics()
      .setAttributes({
        // role: 'admin',
        // followers: '14',
        user_id: `${userData.user_id}`,
        email: userData.email,
        username: userData.name,
      })
      .catch(e => {
        console.log('initCrashlytics setAttributes error', e);
      });

    // ]).catch(r=>{
    //   console.log('initCrashlytics error',r)
    // });
    initCrashlytics = true;

    console.log('initCrashlytics', initCrashlytics);
  };

  const checkLogin = async () => {
  

    let r = await loginFromKeyChain();
    console.log('loginFromKeyChain', r);
    if (r && r.status) {
      setInitialRouteName('HomeNav');
      setLoaded(true);

      return;
    }
    setInitialRouteName('Login');
    setLoaded(true);
  };

  if (!loaded) {
    return <SplashView />;
  }
  // console.log('[initialRouteName]',initialRouteName)
  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          background: theme.colors.appBackground,
        },
      }}>
      <Stack.Navigator
        // headerMode="screen"
        screenOptions={{headerShown: false}}
        initialRouteName={initialRouteName}>
        <Stack.Screen
          name="Login"
          getComponent={() => require('../Screens/Login/Login').default}
        />

        {/* /////////////////PRIVATE SCREENS///////////////////////// */}
      
        <Stack.Screen
          name="DeviceSetup"
          getComponent={() =>
            require('../Screens/DeviceSetup/DeviceSetup').default
          }
        />
      
      
       <Stack.Screen
          name="HomeNav"
          getComponent={() => require('./HomeNavigator').default}
        />
        <Stack.Screen
          name="Orders"
          getComponent={() => require('../Screens/Orders/Orders').default}
        />

        <Stack.Screen
          name="ActiveOrders"
          getComponent={() => require('../Screens/Orders/ActiveOrders').default}
        />

        <Stack.Screen
          name="ProductMenu"
          getComponent={() =>
            require('../Screens/ProductMenu/ProductMenu').default
          }
        />

        <Stack.Screen
          name="TestingPOS"
          getComponent={() =>
            require('../Screens/TestingPOS/TestingPOS').default
          }
        />
        <Stack.Screen
          name="MenuCategories"
          getComponent={() =>
            require('../Screens/ProductMenu/MenuCategories').default
          }
        />
        <Stack.Screen
          name="MenuItems"
          getComponent={() =>
            require('../Screens/ProductMenu/MenuItems').default
          }
        />
        <Stack.Screen
          name="AddFinixDevice"
          getComponent={() =>
            require('../Screens/AddFinixDevice/AddFinixDevice').default
          }
        />

        <Stack.Screen
          name="ScanRewardBagQR"
          getComponent={() =>
            require('../Screens/ScanRewardBagQR/ScanRewardBagQR').default
          }
        />

        <Stack.Screen
          name="CheckInOut"
          getComponent={() =>
            require('../Screens/CheckInOut/CheckInOut').default
          }
        />

        <Stack.Screen
          name="Statistics"
          getComponent={() =>
            require('../Screens/Statistics/Statistics').default
          }
        />

        <Stack.Screen
          name="ControlCenter"
          getComponent={() =>
            require('../Screens/ControlCenter/ControlCenter').default
          }
        />
        <Stack.Screen
          name="CashDrawer"
          getComponent={() =>
            require('../Screens/CashDrawer/CashDrawer').default
          }
        />
        <Stack.Screen
          name="CashDrawerTransactions"
          getComponent={() =>
            require('../Screens/CashDrawer/CashDrawerTransactions').default
          }
        />
        <Stack.Screen
          name="PrinterSettings"
          getComponent={() =>
            require('../Screens/PrinterSettings/PrinterSettings').default
          }
        />
        <Stack.Screen
          name="TrackOrder"
          getComponent={() =>
            require('../Screens/Orders/TrackOrder').default
          }
        />
         <Stack.Screen
          name="HoldOrders"
          getComponent={() => require('../Screens/Orders/HoldOrders').default}
        />
         <Stack.Screen
          name="Settings"
          getComponent={() => require('../Screens/Settings/Settings').default}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default Navigator;

// class Navigator extends PureComponent {
//   state = {loaded: false, initialRouteName: 'Home'};

//   componentDidMount() {
//     // fcmService.getToken(token => {
//     //   store.dispatch(userAction.setProperty('deviceToken', token));
//     //   setTimeout(() => {
//     //     this.checkLogin();
//     //   }, 500);
//     // });
//     // console.log('---INIT NAVIGATOR---');
//   }

//   // async checkLogin() {
//   //   let r = await loginFromKeyChain();
//   //   // console.log('loginFromKeyChain', r);
//   //   if (r && r.status) {
//   //     this.setState({loaded: true, initialRouteName: 'Home'});
//   //     return;
//   //   }

//   //   this.setState({loaded: true, initialRouteName: 'Onboard'});
//   // }

//   render() {
//     let {initialRouteName, loaded} = this.state;
//     // if (!loaded) {
//     //   return <SplashView loading />;
//     // }
//     // return <></>;
//     return (

//     );
//   }
// }

// export default Navigator;
