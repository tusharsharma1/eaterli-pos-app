import {convertDistance, getPreciseDistance} from 'geolib';
import React, {memo, useEffect, useState} from 'react';
import {FlatList, NativeModules, TouchableOpacity, View} from 'react-native';
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
import Header from '../../components/Header';
import useProducts from '../../hooks/useProducts';
import _ from 'lodash';
import CategoryGrid from '../components/CategoryGrid';
import MenuItemGrid from '../components/MenuItemGrid';
import {getPercentValue} from '../../helpers/app.helpers';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import CartView from '../components/CartView';
export default function Home(props) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const userData = useSelector(s => s.user.userData);
  let {width} = useWindowDimensions();
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (userData) {
      let {locations, restaurant} = userData;
      let start = {latitude: 0, longitude: 0};
      let l = await getCurrentPosition();
      console.log('distL l', l);
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
      console.log('distL', start, distL);
      dispatch(
        userAction.set({
          selectedLocation: distL.id,
        }),
      );
      // setNearByLocation(distL);
      // console.log('Promise',Promise.allSettled);

      // await dispatch(
      //   userAction.getMobileBuilder(userData.restaurant.id, false),
      // );
      // console.time('prom');
     
      // await dispatch(userAction.getVariations(restaurant.id, false));
      // console.timeLog('prom', 2);
    
      if (distL) {
        // dispatch(userAction.set({selectedLocation: location.id}));
        await Promise.all([
          dispatch(userAction.getVariations(restaurant.id, false)),
          dispatch(userAction.getMenus(distL.id, false)),
          dispatch(userAction.getAddons(distL.id, '', false)),
        ]);

        // await dispatch(userAction.getMenus(distL.id, false));

        // console.timeLog('prom', 3);
        // await dispatch(userAction.getAddons(distL.id, '', false));
      }
      // console.timeEnd('prom');
      
    }

    setLoaded(true);
  };
  //

  return (
    <>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <Header title={'Eaterli POS'} />
          {loaded && (
            <Container style={{flex: 1}}>
              <CategoryGrid />
              <MenuItemGrid />
            </Container>
          )}
        </View>
        <View
          style={{
            width: getPercentValue(width, 30),
            backgroundColor: '#ddd',
          }}>
          <CartView />
        </View>
        {!loaded && <AppLoader message={'Loading'} />}
      </View>
    </>
  );
}
