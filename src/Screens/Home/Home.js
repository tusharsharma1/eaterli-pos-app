import {convertDistance, getPreciseDistance} from 'geolib';
import React, {useEffect, useState} from 'react';
import {NativeModules, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AppLoader from '../../components/AppLoader';
import Button from '../../components/Button';
import Container from '../../components/Container';
import ProgressImage from '../../components/react-native-image-progress';
import Text from '../../components/Text';
import {PRODUCT_MENU_TYPE} from '../../constants/order.constant';
import {getCurrentPosition} from '../../helpers/location.helper';
import orderAction from '../../redux/actions/order.action';
import userAction from '../../redux/actions/user.action';
import {resetReduxState} from '../../redux/reducers';
import theme from '../../theme';
import POSModule from '../../helpers/pos.helper';
export default function Home(props) {
  const [loaded, setLoaded] = useState(true);
  const [nearByLocation, setNearByLocation] = useState(null);
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
      console.log('distL l',l);
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
     
      distL = distL.sort((a, b) => a.dist - b.dist)[0];
      console.log('distL',start, distL);
      dispatch(
        userAction.set({
          selectedLocation: distL.id
        }),
      );
      setNearByLocation(distL);
      // console.log(distL);

      await dispatch(
        userAction.getMobileBuilder(userData.restaurant.id, false),
      );
    }

    // setLoaded(true);
  };

  const logoutPress = async () => {
    // await this.props.dispatch(userAction.logoutFromServer());

    // await Keychain.resetGenericPassword();

    props.navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });

    dispatch(resetReduxState());
    // dispatch(userAction.logout());
    // console.log(this.props.navigation.reset, this.props.dispatch,Keychain.resetGenericPassword);

    // setTimeout(() => {

    // }, 100);
  };
  let nearByAddress =
    nearByLocation &&
    [
      nearByLocation.street,
      nearByLocation.zip_code,
      nearByLocation.city,
      nearByLocation.state,
      nearByLocation.country,
    ]
      .filter(Boolean)
      .join(', ');

  let name = userData.restaurant_theme?.name ?? userData.restaurant?.name ?? '';
  let logo = userData.restaurant_theme?.logo ?? '';
  return (
    <>
      <Container style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            // backgroundColor: 'red',
            alignItems: 'center',
            paddingVertical: 25,
            paddingHorizontal: 25,
          }}>
          <Text align="center" size={30} bold mb={20}>
            Welcome To Eaterli
          </Text>
          {loaded ? (
            <>
              {!!nearByLocation && (
                <Text align="center" size={20} medium>
                  It looks like you're at {nearByLocation.name}{' '}
                  {nearByAddress ? <>({nearByAddress})</> : ''}
                </Text>
              )}
              <Text
                align="center"
                color={theme.colors.secondaryColor}
                size={38}
                mb={18}
                mt={35}
                bold>
                {name}
              </Text>
              {!!logo && (
                <ProgressImage
                  source={{uri: logo}}
                  resizeMode="contain"
                  style={{
                    width: 350,
                    height: 260,
                    // borderRadius: theme.wp(26) / 2,
                    // borderWidth: 1,
                    //borderColor: theme.colors.borderColor,

                    //  backgroundColor:'red'
                  }}
                  imageStyle={{
                    width: '100%',
                    height: '100%',
                    // width: 60,
                    resizeMode: 'contain',
                    // height: theme.screenWidth / numColumns - 100,
                    // height:
                    //   theme.screenWidth / numColumns -
                    //   2 * theme.wp(2) * numColumns -
                    //   theme.hp(5),
                    // backgroundColor: 'red',
                    // - (vheight * (10 / 100)), // theme.hp(10),
                    flex: 1,
                  }}
                  // renderIndicator={(progress, inde) => {
                  //   console.log(progress, inde);
                  //   return (
                  //     <>
                  //       <Text
                  //         style={{
                  //           fontSize: 8,
                  //           fontFamily: theme.fonts.regular,
                  //           width: '100%',
                  //           height: '100%',
                  //        }}>
                  //         Loading...{progress}
                  //       </Text>
                  //     </>
                  //   );
                  // }}
                />
              )}

              <View
                style={{
                  // width:150,
                  // height:100,
                  // backgroundColor:'red',
                  marginTop: 20,
                  flexDirection: 'row',
                }}>
                <Button
                  // style={{}}
                  // backgroundColor="#00000000"
                  noShadow
                  // bold
                  // color="#212121"
                  mr={10}
                  onPress={() => {
                    dispatch(
                      orderAction.set({
                        productMenuType: PRODUCT_MENU_TYPE.catering.id,
                      }),
                    );
                    props.navigation.navigate('ProductMenu');
                  }}>
                  Catering Menu
                </Button>
                <Button
                  // style={{}}
                  // backgroundColor="#00000000"
                  noShadow
                  // bold
                  // color="#212121"
                  // mr={10}
                  onPress={() => {
                    dispatch(
                      orderAction.set({
                        productMenuType: PRODUCT_MENU_TYPE.restuarant.id,
                      }),
                    );
                    props.navigation.navigate('ProductMenu');
                  }}>
                  Restaurant Menu
                </Button>
              </View>
              <View
                style={{
                  // width:150,
                  // height:100,
                  // backgroundColor:'red',
                  marginTop: 10,
                  flexDirection: 'row',
                }}>
                <Button
                  // style={{}}
                  // backgroundColor="#00000000"
                  noShadow
                  // bold
                  // color="#212121"
                  mr={10}
                  onPress={() => {
                   POSModule.doOpenCashBox();
                  }}>
                  Open Cashbox
                </Button>
                <Button
                  // style={{}}
                  // backgroundColor="#00000000"
                  noShadow
                  // bold
                  // color="#212121"
                  // mr={10}
                  onPress={() => {
                    POSModule.testPrint({id:22,name:"aakash",active:true},(res)=>{
                      console.log('[testPrint]',res)
                      alert(JSON.stringify(res))
                    });
                    
                  }}>
                 Test Print
                </Button>
              </View>


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
                {!!nearByLocation && (
                  <Button
                    // style={{}}
                    backgroundColor={theme.colors.primaryColor}
                    // noShadow
                    // bold
                    // color="#212121"
                    // onPress={logoutPress}
                  >
                    Proceed with {nearByLocation.name}
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
