//import Snackbar from 'react-native-snackbar';
import * as Keychain from 'react-native-keychain';
import userAction from '../redux/actions/user.action';

import store from '../redux/store';
import stringHelper from './string.helper';
import { getCurrentPosition } from './location.helper';
import { convertDistance, getPreciseDistance } from 'geolib';
export async function loginFromKeyChain() {
  let credentials = await Keychain.getGenericPassword();
  console.log('wwwww credentials', credentials);

  if (credentials) {
    let password = await stringHelper.decrypt(credentials.password);
    //  console.log('wwwwwww d',credentials.password,password)
    //  let epassword = await stringHelper.encrypt(credentials.password);
    // console.log('wwwwwww d',store)
    let r = await store.dispatch(
      userAction.login(
        {
          email: credentials.username,
          password: password,
        },
        false,
        false,
      ),
    );
    return r;
  }
  return false;
}

export async function getNearRestaurantLocation() {
  let {userData} = store.getState().user;
  if (userData) {
    let {locations, restaurant} = userData;
    let start = {latitude: 0, longitude: 0};
    console.log('[home]');
    let l = await getCurrentPosition().catch(e => {
      console.log('distL CurrentPosition error', e);
    });
    console.log('[home] position', l);
    if (l && l.position) {
      start = {
        latitude: l.position.coords.latitude,
        longitude: l.position.coords.longitude,
      };
    }
    console.log('[home] start', start);
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
    console.log('[home] loc', distL);

    if (distL) {
      store.dispatch(
        userAction.set({
          selectedLocation: distL.id,
        }),
      );
    }
    return distL;
  }

  return null;
}
