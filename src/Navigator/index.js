import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import SplashView from '../components/SplashView';
import {loginFromKeyChain} from '../helpers/user.helper';

import theme from '../theme';
// import {fcmService} from '../firebase/FCMService';
// import {loginFromKeyChain} from '../helpers/user.helper';
// import userAction from '../redux/actions/user.action';
// import store from '../redux/store';
// import Onboard from '../screens/Onboard/Onboard';
// import SearchLocation from '../screens/Pickup/SearchLocation';
// import PersonalInfo from '../screens/Settings/PersonalInfo';
// import Settings from '../screens/Settings/Settings';
// import UpdatePersonalInfo from '../screens/Settings/UpdatePersonalInfo';
// import AddMobile from '../screens/SignUp/AddMobile';
// import Login from '../screens/SignUp/Login';
// import SignUp from '../screens/SignUp/SignUp';
// import HomeNavigator from './HomeNavigator';
// import CancelRide from '../screens/Pickup/CancelRide';
// import {checkVersion} from 'react-native-check-version';
// import SplashView from './SplashView';
// import Report from '../screens/Report/Report';
// import ReportSubmit from '../screens/Report/ReportSubmit';
const Stack = createNativeStackNavigator();

function Navigator() {
  const [loaded, setLoaded] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState('Login');

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    let r = await loginFromKeyChain();
    console.log('loginFromKeyChain', r);
    if (r && r.status) {
      setInitialRouteName('Home');
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
          name="Home"
          getComponent={() => require('../Screens/Home/Home').default}
        />

        <Stack.Screen
          name="ProductMenu"
          getComponent={() =>
            require('../Screens/ProductMenu/ProductMenu').default
          }
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
