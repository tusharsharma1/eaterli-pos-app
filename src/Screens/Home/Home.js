import React, {PureComponent, useEffect} from 'react';
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
import AppLoader from '../../components/AppLoader';
import {convertDistance, getPreciseDistance} from 'geolib';
import {getCurrentPosition} from '../../helpers/location.helper';

export default function Home(props) {
  const loaded = useState(false);
  const nearByLocation = useState(null);
  const dispatch = useDispatch();
  const userData = useSelector(s => s.user.userData);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (userData) {
      let {locations} = userData;
      let start = {latitude: 0, longitude: 0};
      let l = await getCurrentPosition();

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
      console.log(start, distL);
      distL = distL.sort((a, b) => a.dist - b.dist)[0];
      nearByLocation.set(distL);
      // console.log(distL);
    }

    loaded.set(true);
  };

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
  let nearByAddress =
    nearByLocation.value &&
    [
      nearByLocation.value.street,
      nearByLocation.value.zip_code,
      nearByLocation.value.city,
      nearByLocation.value.state,
      nearByLocation.value.country,
    ]
      .filter(Boolean)
      .join(', ');
  return (
    <>
      <Container style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            // backgroundColor: 'red',
            // alignItems: 'center',
            paddingVertical: 25,
            paddingHorizontal: 25,
          }}>
          <Text align="center" size={30} bold mb={20}>
            Welcome To Eaterli
          </Text>
          {loaded.value ? (
            <>
              {!!nearByLocation.value && (
                <Text align="center" size={20} medium>
                  It looks like you're at {nearByLocation.value.name}{' '}
                  {nearByAddress ? <>({nearByAddress})</> : ''}
                </Text>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                }}>
                <Button
                  // style={{}}
                  // backgroundColor="#00000000"
                  noShadow
                  // bold
                  // color="#212121"
                  mr={10}
                  // onPress={logoutPress}
                >
                  Change Location
                </Button>
                {!!nearByLocation.value && (
                  <Button
                    // style={{}}
                    backgroundColor={theme.colors.primaryColor}
                    // noShadow
                    // bold
                    // color="#212121"
                    // onPress={logoutPress}
                  >
                    Proceed with {nearByLocation.value.name}
                  </Button>
                )}
              </View>
            </>
          ) : (
            <AppLoader message={'Loading'} />
          )}

          <Button
            style={{
              position: 'absolute',
              top: 10,
              right: 20,
            }}
            backgroundColor="#00000000"
            noShadow
            bold
            color="#212121"
            onPress={logoutPress}>
            Logout
          </Button>
        </View>
      </Container>
    </>
  );
}
