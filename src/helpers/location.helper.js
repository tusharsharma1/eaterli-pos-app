//import Snackbar from 'react-native-snackbar';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
export function requestLocationPermission() {
  return new Promise(async (res, rej) => {
    let result = false;
    if (Platform.OS === 'ios') {
      result = await requestIOSPermission().catch(rej);
    } else {
      result = await requestAndroidPermission().catch(rej);
    }

    res(result);
  });
}

export function requestIOSPermission() {
  return new Promise((res, rej) => {
    Geolocation.requestAuthorization('always').then(result => {
      // console.log(result);
      res(result == 'granted');
    });
  });
}

export function requestAndroidPermission() {
  return new Promise(async (res, rej) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      res(granted === PermissionsAndroid.RESULTS.GRANTED);
    } catch (err) {
      rej(err);
    }
  });
}

export function getCurrentPosition() {
  return new Promise(async (res, rej) => {
    let granted = await requestLocationPermission().catch(rej);
    if (granted) {
      Geolocation.getCurrentPosition(
        position => {
          res({position, granted});
        },
        error => {
          rej(error);
        },
        {
          enableHighAccuracy: true,
          // timeout: 20000,
          // maximumAge: 10000,
        },
      );
    } else {
      res({position: null, granted});
    }
  });
}

export function watchPosition(cb) {
  return new Promise(async (res, rej) => {
    let granted = await requestLocationPermission().catch(rej);
    if (granted) {
      let watchId = Geolocation.watchPosition(
        cb,
        error => {
          rej(error);
        },
        {
          enableHighAccuracy: true,
          interval: 2000,
          distanceFilter: 10,
          // timeout: 20000,
          // maximumAge: 10000,
        },
      );

      res(watchId);
    } else {
      res(null);
    }
  });
}

export function clearWatch(watchId) {
  Geolocation.clearWatch(watchId);
}
