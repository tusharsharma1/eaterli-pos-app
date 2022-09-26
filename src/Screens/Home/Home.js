import React, {PureComponent} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Text} from '../../components/Text';
import {Button} from '../../components/Button';
import appAction from '../../redux/actions/app.action';

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
  const value = useSelector(s => s.app.value);
  const dispatch = useDispatch();

  const scanPress = () => {
  //  props.navigation.navigate('ScanQR');
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          // backgroundColor: 'red',
          alignItems: 'center',
          paddingVertical: 25,
          paddingHorizontal: 25,
        }}>
        <Text size={24} medium>
         Eaterli
        </Text>
       
      </View>
    </>
  );
}
