import React, {useEffect, useRef, useState} from 'react';
import {Image, ImageBackground, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import Container from '../../components/Container';
import PinKeyBoard from '../../components/PinKeyBoard';
import SplashView from '../../components/SplashView';
import Text from '../../components/Text';
import LoginForm from '../../forms/LoginForm';
import {getPercentValue, showToast} from '../../helpers/app.helpers';
import storageHelper from '../../helpers/storage.helper';
import userAction from '../../redux/actions/user.action';
import theme from '../../theme';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useTheme from '../../hooks/useTheme';
import moment from 'moment';
import ProgressImage from '../../components/react-native-image-progress';
let contentH = 725;
let initH = false;
export default function Login(props) {
  // const value = useSelector(s => s.app.value);
  const dispatch = useDispatch();
  let height = 610;
  const {width, isPortrait} = useWindowDimensions();
  const [loaded, setLoaded] = useState(false);
  const [loginTab, setLoginTab] = useState(1);
  const [bH, setBH] = useState(height);
  const deviceId = useSelector(s => s.user.deviceId);
  const userData = useSelector(s => s.user.userData);
  const loginFormikRef = useRef();
  let themeData = useTheme();
  const [logo, setLogo] = useState('');
  useEffect(() => {
    loadData();
    return () => {
      initH = false;
    };
  }, []);

  useEffect(() => {
    checkDevice();
  }, [userData]);

  const loadData = async () => {
    let email = await storageHelper.getData('email');
    let rest_id = await storageHelper.getData('rest_id');
    let _logo = await storageHelper.getData('logo');
    console.log('email', email);
    if (email && rest_id) {
      setLoginTab(2);
    }
    if (_logo) {
      setLogo(_logo);
    }
    setLoaded(true);
  };

  const onSubmit = () => {
    // checkDevice();
  };

  const onCompleted = async pin => {
    //     props.navigation.navigate('TestingPOS');
    // return
    let email = await storageHelper.getData('email');
    let rest_id = await storageHelper.getData('rest_id');

    console.log('email', email);
    if (email && rest_id) {
      let r = await dispatch(
        userAction.loginWithPin({
          email: email,
          passcode: pin,
          restaurant_id: rest_id,
          type: 'pos',
        }),
      );
      if (r && r.status) {
        // let {onSubmit} = this.props;
        //  helpers.resetForm();
        // showSnackbar('Sign successfully.');
        showToast(r.message, 'success');
        // checkDevice();

        //let data = r.data;
        // console.log('srsss', data);
        // let password = await stringHelper.encrypt(values.password);
        // console.log('password', password);

        //  await storageHelper.storeData('email',values.email);

        // Store the credentials
        // await Keychain.setGenericPassword(values.email, password);
        // onSubmitSuccess && onSubmitSuccess(values)
        // this.props.dispatch(UserActions.setProperty('userData', data));
        // this.props.dispatch(UserActions.setFavLocation(data.location_id));

        // StorageService.storeData(AppConfig.STORAGE_USER_KEY, data).then((_) => {

        // });

        // onSubmit && onSubmit(values);

        // this.props.dispatch(
        //   AlertActions.showAlert(
        //     AlertActions.type.ALERT,
        //     's',
        //     r.message,
        //     'Success',
        //     {
        //       text: 'OK',
        //       onPress: () => {
        //         onSubmit && onSubmit(values, helpers);
        //       },
        //     },
        //   ),
        // );
      }
    } else {
      showToast(
        'Account not found! Please login with email and password',
        'error',
      );
    }

    //  let epassword = await stringHelper.encrypt(credentials.password);
    // console.log('wwwwwww d',store)
    // let r = await store.dispatch(
    //   userAction.login(
    //     {
    //       email: credentials.username,
    //       password: password,
    //     },
    //     false,
    //     false,
    //   ),
    // );
  };

  const checkDevice = async () => {
    if (!userData) {
      return;
    }
    console.log('checkDevice', userData);
    storageHelper.storeData('logo', userData?.restaurant_theme?.logo);

    // console.log('checkDevice....',userData.restaurant.id, 'pos', deviceId)
    let r = await dispatch(
      userAction.getDeviceDetail(userData.restaurant.id, 'pos', deviceId),
    );
    if (r) {
      if (r.status) {
        props.navigation.replace('HomeNav');
      } else {
        props.navigation.replace('DeviceSetup');
      }
    }
    //  props.navigation.replace('HomeNav');
    //  props.navigation.replace('DeviceSetup');
  };
  if (!loaded) {
    return <SplashView />;
  }
  return (
    <ImageBackground
      style={{
        flex: 1,
      }}
      onLayout={e => {
        // if (!isPortrait) {
        //   setBH(e.nativeEvent.layout.height);
        //   console.log('isPortrait');
        // }
        if (!initH) {
          setBH(e.nativeEvent.layout.height);
          initH = true;
          // console.log('init');
        }
        // console.log('body',
        //   e.nativeEvent.layout,
        //   theme.screenHeight,
        //   theme.screenHeight / 725,
        // );
      }}
      resizeMode="cover"
      source={require('../../assets/loginbg.png')}>
      <View
        style={{
          // flex: 1,
          backgroundColor: themeData.loginBg,
          alignItems: 'center',
          justifyContent: 'center',
          height: bH,
        }}>
        <View
          style={{
            flexDirection: 'row',
            transform: [
              {scale: bH < 516 ? bH / 516 : 516 / bH},
              // {translateY: (bH - contentH) / 2},
            ],
          }}>
          <View
            style={{
              width: 250,
              // height: bH - 150,

              marginRight: -25,
              zIndex: 1,
            }}>
            <Time />
            <View
              style={{
                backgroundColor: '#fff',
                width: '100%',
                height: height - 220,
                borderRadius: 8,
                paddingHorizontal: 20,
                // marginRight: -16,
                // zIndex: 1,
              }}>
              <ProgressImage
                style={{
                  width: 180,
                  height: 180,
                  alignSelf: 'center',
                  marginTop: 10,
                }}
                imageStyle={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="contain"
                source={logo ? {uri: logo} : require('../../assets/icon.png')}
              />

              <Text color="#18171D">Welcome to</Text>
              <Text bold size={32} color={theme.colors.primaryColor}>
                Our POS{'\n'}System
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: theme.colors.primaryColor,
              width: 310,
              height: height - 150,
              borderRadius: 8,
            }}>
            <View
              style={{
                //  backgroundColor: 'red',
                height: height - 140,
                marginTop: 0,
                transform: [
                  {scale: 0.87},
                  // {translateY: (bH - contentH) / 2},
                ],
              }}>
              <View
                style={{
                  paddingHorizontal: 45,
                  // paddingTop: 20,
                  // marginBottom:15
                }}>
                <LoginForm
                  formikRef={loginFormikRef}
                  onSubmitSuccess={onSubmit}
                />
              </View>

              <PinKeyBoard
                style={
                  {
                    // marginTop: 15,
                    // marginBottom:15
                  }
                }
                scale={0.9}
                onCompleted={onCompleted}
              />

              <Button
                onPress={() => {
                  if (loginFormikRef.current) {
                    loginFormikRef.current.handleSubmit();
                  }
                }}
                noShadow
                color={'#18171D'}
                backgroundColor="#F4F4F6"
                // mt={30}
                ml={45}
                mr={45}
                borderRadius={4}>
                Login
              </Button>
            </View>
          </View>
        </View>
        <Image
          style={{
            width: 125,
            position: 'absolute',
            top: 10,
            left: 10,
          }}
          resizeMode="contain"
          source={require('../../assets/EaterliLogo.png')}
        />
      </View>
    </ImageBackground>
  );
  return (
    <Container
      onLayout={e => {
        // if (!isPortrait) {
        //   setBH(e.nativeEvent.layout.height);
        //   console.log('isPortrait');
        // }
        if (!initH) {
          setBH(e.nativeEvent.layout.height);
          initH = true;
          // console.log('init');
        }
        // console.log('body',
        //   e.nativeEvent.layout,
        //   theme.screenHeight,
        //   theme.screenHeight / 725,
        // );
      }}
      scroll
      style={
        {
          // backgroundColor: 'red',
        }
      }
      contentContainerStyle={
        {
          // alignItems: 'center',
          // paddingVertical: 25,
          // paddingHorizontal: 25,
          // flex: 1,
        }
      }>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          height: bH,
        }}>
        <View
          style={{
            // backgroundColor: 'yellow',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: getPercentValue(width, 35),
              height: getPercentValue(width, 30),
              resizeMode: 'contain',
              // backgroundColor: 'red',
              marginBottom: 21,
            }}
            source={require('../../assets/images/logo.png')}
          />
        </View>
        <View
          style={{
            // backgroundColor: 'blue',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: theme.colors.primaryColor,
              width: getPercentValue(width, 40),
              height: getPercentValue(width, 40),
              borderRadius: getPercentValue(width, 35),
              // alignItems: 'center',

              justifyContent: 'center',
              paddingHorizontal: getPercentValue(width, 4),
            }}>
            {loginTab == 1 ? (
              <>
                <View
                  style={{
                    transform: [
                      {scale: getPercentValue(width, 40) / 350},
                      // {translateY: (bH - contentH) / 2},
                    ],
                  }}>
                  <Text
                    style={{alignSelf: 'center'}}
                    mb={35}
                    size={20}
                    bold
                    color="#ffffffaa">
                    USER LOGIN
                  </Text>

                  <LoginForm onSubmitSuccess={onSubmit} />
                </View>
              </>
            ) : (
              <>
                <PinKeyBoard
                  scale={getPercentValue(width, 40) / 450}
                  onCompleted={onCompleted}
                />
              </>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 25,
              transform: [
                {scale: getPercentValue(width, 40) / 350},
                // {translateY: 0},
              ],
            }}>
            <Button
              onPress={() => {
                setLoginTab(1);
              }}
              noShadow
              backgroundColor={loginTab == 1 ? '#828282' : '#D9D9D9'}
              color={loginTab == 1 ? '#FFFFFF' : '#8F8F8F'}
              style={{
                borderRadius: 0,
                borderTopLeftRadius: 30,
                borderBottomLeftRadius: 30,
              }}>
              USER LOGIN
            </Button>
            <Button
              onPress={() => {
                setLoginTab(2);
              }}
              noShadow
              backgroundColor={loginTab == 2 ? '#828282' : '#D9D9D9'}
              color={loginTab == 2 ? '#FFFFFF' : '#8F8F8F'}
              style={{
                borderRadius: 0,
                borderTopRightRadius: 30,
                borderBottomRightRadius: 30,
              }}>
              PIN LOGIN
            </Button>
          </View>
        </View>
      </View>
    </Container>
  );
}

function Time() {
  let themeData = useTheme();
  let [time, setTime] = useState(moment());
  useEffect(() => {
    let interval = setInterval(() => {
      setTime(moment());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <Text ml={-16} align="center" medium size={38} color={themeData.textColor}>
      {time.format('h:mm A')}
    </Text>
  );
}
