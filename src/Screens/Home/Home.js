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
  // const {height, width, isPortrait} = useWindowDimensions();
  const scanPress = () => {
    //  props.navigation.navigate('ScanQR');
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
          <Image
            style={{
              width: 300,
              height: 82,
              resizeMode: 'contain',
              // backgroundColor:'red'
              marginBottom: 21,
            }}
            source={require('../../assets/images/logo.png')}
          />
          <View
            style={{
              backgroundColor: theme.colors.primaryColor,
              width: 500,
              height: 500,
              borderRadius: 300,
              // alignItems: 'center',

              justifyContent: 'center',
              paddingHorizontal: 80,
            }}>
            <Text
              style={{alignSelf: 'center'}}
              mb={35}
              size={20}
              bold
              color="#ffffffaa">
              USER LOGIN
            </Text>

            <LoginForm />

            {/* <TextInput
              textInputProps={{
                // onChangeText: props.handleChange('card_number'),
                //onBlur: props.handleBlur('card_number'),
                //  value: props.values.card_number,
                //keyboardType: 'numeric',
                // returnKeyType: 'next',
                placeholder: 'Email',
                // onSubmitEditing: () => this.name_on_cardInput.focus(),
              }}
            />
            <TextInput
              textInputProps={{
                // onChangeText: props.handleChange('card_number'),
                //onBlur: props.handleBlur('card_number'),
                //  value: props.values.card_number,
                //keyboardType: 'numeric',
                // returnKeyType: 'next',
                placeholder: 'Password',
                // onSubmitEditing: () => this.name_on_cardInput.focus(),
              }}
            />
            <Button width={200} style={{alignSelf: 'center'}}>
              LOGIN
            </Button> */}
          </View>

          {/* <Text size={24} medium>
         Eaterli
        </Text> */}
        </View>
      </Container>
    </>
  );
}
