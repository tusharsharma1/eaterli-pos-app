//import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-toast-message';
import appAction from '../redux/actions/app.action';
// import {ToastAndroid } from 'react-native'
// import AlertActions from '../redux/actions/alert.action';
// import AppActions from '../redux/actions/app.action';
import store from '../redux/store';
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
