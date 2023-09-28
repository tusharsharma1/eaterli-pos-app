//import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-toast-message';
import appAction from '../redux/actions/app.action';
// import {ToastAndroid } from 'react-native'
// import AlertActions from '../redux/actions/alert.action';
// import AppActions from '../redux/actions/app.action';
import store from '../redux/store';
import SimpleToast from 'react-native-simple-toast';
export function simpleToast(text, duration = SimpleToast.SHORT) {
  SimpleToast.show(text, duration);
}
export function showToast(text, type = 'success', text1 = '', duration = 2000) {
  // setTimeout(() => {
  //     Snackbar.show({
  //         text,
  //         duration,
  //         action: {
  //             text: 'close',
  //             textColor: 'red',
  //             onPress: () => { /* Do something. */ },
  //         },
  //     });
  // }, 50)

  Toast.show({
    type: type,
    position: 'top',
    text1: text1,
    text2: text,
    visibilityTime: duration,
    autoHide: true,
    // topOffset: 30,
    // bottomOffset: 40,
    onShow: () => {},
    onHide: () => {}, // called when Toast hides (if `autoHide` was set to `true`)
    onPress: () => {},
    props: {}, // any custom props passed to the Toast component
  });
}

export function apiErrorHandler(error) {
  store.dispatch(appAction.hideProgress());
  // store.dispatch(
  //   AlertActions.showAlert(
  //     AlertActions.type.ALERT,
  //     'e',
  //     <>
  //       Something went wrong.{'\n'}
  //       <Text style={{color: 'gray'}}>{error.message}</Text>
  //     </>,
  //     'Error',
  //   ),
  // );
  showToast(error.message, 'error');
  // Toast.show(error.message,Toast.LONG);
}

export function apiMessageHandler(res, showAlert = true) {
  if (res.tokenInvalid) {
    showToast('Session Expired.', 'error');
    // store.dispatch(
    //   AlertActions.showAlert(
    //     AlertActions.type.ALERT,
    //     'i',
    //     'Session Expired.',
    //     'Message',
    //     {
    //       text: 'OK',
    //       onPress: () => {
    //         // store.dispatch(UserActions.sessionExpired());
    //       },
    //     },
    //   ),
    // );
  } else {
    if (showAlert) {
      showToast(res.message, 'error');
      // store.dispatch(
      //   AlertActions.showAlert(AlertActions.type.ALERT, 'i', res.message),
      // );
    }
  }
  // Toast.show(message,Toast.LONG);
}

export function sleep(delay = 1000) {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, delay);
  });
}

export function formatPrice(price) {
  return `$${price}`;
}
export function formatGridData(_data, numColumns) {
  let data = [..._data];
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
  while (
    numberOfElementsLastRow !== numColumns &&
    numberOfElementsLastRow !== 0
  ) {
    data.push({empty: true});
    numberOfElementsLastRow++;
  }

  return data;
}

export function getNewHeight(newWidth, oriWidth, oriHeight) {
  return (newWidth * oriHeight) / oriWidth;
}

export function getPercentValue(value, per) {
  return (value * per) / 100;
}


export function create_UUID() {
  var dt = new Date().getTime();
  // let pettern = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  let pettern = "xxxxxxyxxxxxxyxxxx";

  var uuid = pettern.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

export function dateToTimeFormat(date) {
  let date_now = new Date();
  // console.log('timeData --',date, date_now,date.getTime() , date_now.getTime());
  // if (date.getTime() <= date_now.getTime()) {
  //   return false;
  // }
  // get total seconds between the times
  let delta = Math.abs(date - date_now) / 1000;

  // calculate (and subtract) whole days
  let days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  let hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  let minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  // what's left is seconds
  let seconds = delta % 60;

  return {
    days: Math.ceil(days),//.toString().padStart(2, '0'),
    hours: Math.ceil(hours),//.toString().padStart(2, '0'),
    minutes: Math.ceil(minutes),//.toString().padStart(2, '0'),
    seconds: parseInt(seconds),//.toString().padStart(2, '0'),
  };
}