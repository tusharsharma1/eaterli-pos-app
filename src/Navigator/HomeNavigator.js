import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
// import Dropoff from '../screens/Pickup/Dropoff';
// import Pickup from '../screens/Pickup/Pickup';
// import LookingDriver from '../screens/Pickup/LookingDriver';
import Color from 'color';
import Text from '../components/Text';
import {resetReduxState} from '../redux/actions';
import Container from '../components/Container';
const Drawer = createDrawerNavigator();

function HomeNavigator() {
  // const [loaded, setLoaded] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState('Home');
  // const mobileBuilder = useSelector(s => s.user.mobileBuilder);

  // useEffect(() => {
  //   registerPushNotification(onRegister, onNotification, onOpenNotification);
  //   return () => {
  //     unRegisterPushNotification();
  //   };
  // }, []);
  // const onRegister = token => {
  //   console.log('[App] onRegister: ', token);
  // };

  // const onNotification = notify => {
  //   console.log('[App] onNotification HOme: ', notify);
  //   if (notify) {
  //     const options = {
  //       soundName: 'default',
  //       playSound: true, //,
  //       tag: notify.messageId, // (optional) add tag to message
  //       // group: "group", // (optional) add group to message
  //       // largeIcon: 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
  //       // smallIcon: 'ic_launcher' // add icon small for Android (Link: app/src/main/mipmap)
  //     };

  //     localNotificationService.showNotification(
  //       0,
  //       notify.notification.title,
  //       notify.notification.body,
  //       notify,
  //       options,
  //     );
  //   }
  // };

  // const onOpenNotification = notify => {
  //   console.log('[App] onOpenNotification: ', notify);
  //   if (notify) {
  //     let data = notify.data;
  //     console.log('[App] onOpenNotification: data', data);
  //     if (data) {
  //       let url = data.url;
  //       if (url) {
  //         Linking.openURL(url);
  //         return;
  //       }
  //       // console.log('[App] onOpenNotification: openURL', notify);
  //       // let screenName = getScreenName(data && data.screen);

  //       // if (screenName) {
  //       //   this.props.navigation.navigate(screenName);
  //       // }
  //     }
  //   }
  // };

  // const loadData = async () => {
  //   //adminData.restaurant.id
  //   await dispatch(userAction.getMobileBuilder(adminData.restaurant.id, false));
  //   setLoaded(true);
  //   setTimeout(() => {
  //     dispatch(appAction.set({showWelcomeView: false}));
  //   }, 2000);
  // };
  const renderDrawerContent = props => {
    // let status = getDrawerStatusFromState(props.state);
    return <DrawerContent navigation={props.navigation} />;
  };
  // if (!loaded) {
  //   return isDemoApp ? <SplashView /> : <InitialSplashView />;
  // }
  // if (showWelcomeView) {
  //   return <WelcomeSplashView />;
  // }
  // return <WelcomeSplashView />;
  // let {header_bg} = mobileBuilder.layout;

  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          // // drawerType: theme.screenWidth >= 768 ? 'permanent' : 'front',
          // drawerStyle: {
          //   backgroundColor: '#fff',
          //   // width: 150,
          // },
          unmountOnBlur: true,
          // gestureEnabled:false,
          //  swipeEnabled:false
          drawerType: 'front',
          // overlayColor:'red'
          // sceneContainerStyle:{
          //   backgroundColor: '#ff0',
          // }
        }}
        initialRouteName={initialRouteName}
        drawerContent={renderDrawerContent}>
        <Drawer.Screen
          name="Home"
          options={{
            unmountOnBlur: false,
          }}
          getComponent={() => require('../ScreensNew/Home/Home').default}
        />
      </Drawer.Navigator>
    </>
  );
}
export default HomeNavigator;

function DrawerContent({navigation}) {
  const dispatch = useDispatch();
  const mobileBuilder = useSelector(s => s.user.mobileBuilder);
  const isDemoApp = useSelector(s => s.app.isDemoApp);
  const drawerItemPress = screenName => {
    navigation.closeDrawer();
    navigation.navigate(screenName);
  };
  const logoutPress = async () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });

    dispatch(resetReduxState());
  };

  let {sidebar_bg, sidebar_text, sidebar_accent} = mobileBuilder.layout;
  let text_color = Color(sidebar_accent);
  return (
    <View
      style={{
        backgroundColor: sidebar_bg,

        flex: 1,
      }}>
      <View
        style={{
          height: 20,
        }}></View>
      <Container
        scroll
        style={{
          flex: 1,
          // height: 166,
          //  backgroundColor:'yellow',
          // borderBottomColor: text_color.alpha(0.15).toString(),
          // borderBottomWidth: 1,
        }}
        contentContainerStyle={{
          paddingHorizontal: 25,
          paddingTop: 15,
          paddingBottom: 5,
        }}>
        {/* <DrawerItem
          // icon={WalletIcon}
          title="Settings"
          // subTitle="USD 0"
          onPress={drawerItemPress}
          screenName="Settings"
        /> */}
        {/* <DrawerItem
          // icon={WalletIcon}
          title="Product Menu"
          // subTitle="USD 0"
          onPress={drawerItemPress}
          screenName="ProductMenu"
        /> */}
        <DrawerItem
          // icon={WalletIcon}
          title="Add Finix Device"
          // subTitle="USD 0"
          onPress={drawerItemPress}
          screenName="AddFinixDevice"
        />
        <DrawerItem
          // icon={WalletIcon}
          title="Testing POS"
          // subTitle="USD 0"
          onPress={drawerItemPress}
          screenName="TestingPOS"
        />
        <DrawerItem
          // icon={WalletIcon}
          title="Product Menu"
          // subTitle="USD 0"
          onPress={drawerItemPress}
          screenName="ProductMenu"
        />
        <DrawerItem
          // icon={WalletIcon}
          title="Orders"
          // subTitle="USD 0"
          onPress={drawerItemPress}
          screenName="Orders"
        />
        <DrawerItem
          // icon={WalletIcon}
          title="Scan Reward Bag QR"
          // subTitle="USD 0"
          onPress={drawerItemPress}
          screenName="ScanRewardBagQR"
        />
        <DrawerItem
          // icon={WalletIcon}
          title="Statistics"
          // subTitle="USD 0"
          onPress={drawerItemPress}
          screenName="Statistics"
        />
        <DrawerItem
          // icon={WalletIcon}
          title="Control Center"
          // subTitle="USD 0"
          onPress={drawerItemPress}
          screenName="ControlCenter"
        />
        <DrawerItem
          // icon={WalletIcon}
          title="Cash Drawer"
          // subTitle="USD 0"
          onPress={drawerItemPress}
          screenName="CashDrawer"
        />
        <DrawerItem
          // icon={WalletIcon}
          title="Printer Settings"
          // subTitle="USD 0"
          onPress={drawerItemPress}
          screenName="PrinterSettings"
        />
        <DrawerItem
          //  icon={PreviousRideIcon}
          title="Logout"
          onPress={logoutPress}
          // screenName="PreviousRides"
        />
      </Container>
    </View>
  );
}

function DrawerItem({title, subTitle, onPress, screenName, icon: Icon}) {
  const mobileBuilder = useSelector(s => s.user.mobileBuilder);

  const _onPress = () => {
    onPress && onPress(screenName);
  };
  let {sidebar_bg, sidebar_text, sidebar_accent} = mobileBuilder.layout;
  return (
    <TouchableOpacity
      onPress={_onPress}
      activeOpacity={0.6}
      style={{
        flexDirection: 'row',
        marginBottom: 10,
        paddingVertical: 5,
        // backgroundColor:'blue'
        alignItems: subTitle ? 'flex-start' : 'center',
      }}>
      {!!Icon && <Icon width={22} height={18} />}
      <View
        style={{
          marginLeft: 15,
          //backgroundColor:'red'
        }}>
        <Text color={sidebar_text} size={16}>
          {title}
        </Text>
        {!!subTitle && (
          <Text color={sidebar_accent} size={14}>
            {subTitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
