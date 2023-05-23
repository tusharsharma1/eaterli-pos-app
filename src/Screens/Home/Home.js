import {convertDistance, getPreciseDistance} from 'geolib';
import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AppLoader from '../../components/AppLoader';
import Container from '../../components/Container';
import Header from '../../components/Header';
import {getPercentValue} from '../../helpers/app.helpers';
import {getCurrentPosition} from '../../helpers/location.helper';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import userAction from '../../redux/actions/user.action';
import CartView from '../components/CartView';
import CategoryGrid from '../components/CategoryGrid';
import MenuItemGrid from '../components/MenuItemGrid';
import Button from '../../components/Button';
import Text from '../../components/Text';
export default function Home(props) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [logs, setLogs] = useState([]);
  const userData = useSelector(s => s.user.userData);
  let {width} = useWindowDimensions();
  useEffect(() => {
    setLogs([]);
    loadData();
  }, []);

  const loadData = async () => {
    if (userData) {
      let {locations, restaurant} = userData;
      let start = {latitude: 0, longitude: 0};
      setLogs(_logs => [..._logs, 'fetching location....']);
      let l = await getCurrentPosition().catch(e => {
        console.log('distL CurrentPosition error', e);
        setLogs(_logs => [..._logs, `getCurrentPosition Error`]);
        alert(e.message);
      });
      setLogs(_logs => [..._logs, `fetched location ${JSON.stringify(l)}`]);
      // console.log('distL l', l);
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
      // console.log('distL', distL);
      distL = distL.sort((a, b) => a.dist - b.dist)[0];
      //  console.log('distL', start, distL);
      setLogs(_logs => [..._logs, `set  location ${distL?.id}`]);

      // setNearByLocation(distL);
      // console.log('Promise',Promise.allSettled);

      // await dispatch(
      //   userAction.getMobileBuilder(userData.restaurant.id, false),
      // );
      // console.time('prom');

      // await dispatch(userAction.getVariations(restaurant.id, false));
      // console.timeLog('prom', 2);

      if (distL) {
        dispatch(
          userAction.set({
            selectedLocation: distL.id,
          }),
        );
        setLogs(_logs => [..._logs, `Calling Apis..`]);

        // dispatch(userAction.set({selectedLocation: location.id}));
        await Promise.all([
          dispatch(userAction.getMenuTitle(restaurant.id, false)),
          dispatch(userAction.getVariations(restaurant.id, false)),
          dispatch(userAction.getMenus(distL.id, false)),
          dispatch(userAction.getAddons(distL.id, '', false)),
        ]);
        setLogs(_logs => [..._logs, `Calling Apis done`]);
        // await dispatch(userAction.getMenus(distL.id, false));

        // console.timeLog('prom', 3);
        // await dispatch(userAction.getAddons(distL.id, '', false));
      }
      // console.timeEnd('prom');
    }
    setLogs(_logs => [..._logs, `End`]);
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

        {/* <ScrollView
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 350,
            height: 200,
            backgroundColor: '#fff',
            borderWidth: 2,
            borderColor: 'red',
          }}>
          <Button
            onPress={() => {
              props.navigation.navigate('ProductMenu');
            }}>
            s
          </Button>
          <Text>{logs.join('\n')}</Text>
        </ScrollView> */}
      </View>
    </>
  );
}
