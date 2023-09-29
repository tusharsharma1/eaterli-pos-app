import React, {useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {useDispatch} from 'react-redux';
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
let contentH = 725;
let initH = false;
export default function Login(props) {
  // const value = useSelector(s => s.app.value);
  const dispatch = useDispatch();
  const {height, width, isPortrait} = useWindowDimensions();
  const [loaded, setLoaded] = useState(false);
  const [loginTab, setLoginTab] = useState(1);
  const [bH, setBH] = useState(height);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let email = await storageHelper.getData('email');
    let rest_id = await storageHelper.getData('rest_id');

    console.log('email', email);
    if (email && rest_id) {
      setLoginTab(2);
    }
    setLoaded(true);
  };

  const onSubmit = () => {
    props.navigation.replace('HomeNav');
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
        }),
      );
      if (r && r.status) {
        // let {onSubmit} = this.props;
        //  helpers.resetForm();
        // showSnackbar('Sign successfully.');
        showToast(r.message, 'success');
        props.navigation.replace('HomeNav');
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
  if (!loaded) {
    return <SplashView />;
  }

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
