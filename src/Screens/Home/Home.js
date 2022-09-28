import React, {PureComponent} from 'react';
import {TouchableOpacity, Image, PixelRatio, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Text from '../../components/Text';
import Button from '../../components/Button';
import appAction from '../../redux/actions/app.action';
import theme from '../../theme';
import TextInput from '../../components/Controls/TextInput';
import Container from '../../components/Container';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import LoginForm from '../../forms/LoginForm';
import useState from '../../hooks/useState';
import * as Keychain from 'react-native-keychain';
import userAction from '../../redux/actions/user.action';
// import Carousel, {Pagination} from 'react-native-snap-carousel';
// import {connect} from 'react-redux';
// import {checkVersion} from 'react-native-check-version';
// import BottomDots from '../../components/BottomDots';
// import Container from '../../components/Container';
// import Text from '../../components/Text';
// import AppLoader from '../components/AppLoader';
// import {fcmService} from '../firebase/FCMService';
// import ImageHelper from '../helpers/image.helper';
// import firebase from '../firebase/config';
// import FirebaseService from '../firebase/user.firebase.service';
// import {loginFromKeyChain} from '../helpers/user.helper';
// import UserActions from '../redux/actions/user.action';
// import Screens from '../screens';
// import StorageService from '../services/storage.service';
// import theme from '../../theme';

export default function Home(props) {
  const dispatch = useDispatch();
  const logoutPress = async () => {
    // await this.props.dispatch(userAction.logoutFromServer());

    await Keychain.resetGenericPassword();

    props.navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
    // dispatch(userAction.logout());
    // console.log(this.props.navigation.reset, this.props.dispatch,Keychain.resetGenericPassword);

    // setTimeout(() => {

    // }, 100);
  };

  return (
    <>
      <Container scroll style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            // backgroundColor: 'red',
            alignItems: 'center',
            paddingVertical: 25,
            paddingHorizontal: 25,
          }}>
          <Text>Home</Text>
          <Button onPress={logoutPress}>Logout</Button>
        </View>
      </Container>
    </>
  );
}
