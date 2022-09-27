//import Snackbar from 'react-native-snackbar';
import * as Keychain from 'react-native-keychain';
import UserActions from '../redux/actions/user.action';
import store from '../redux/store';
import stringHelper from './string.helper';
export async function loginFromKeyChain() {
  let credentials = await Keychain.getGenericPassword();
  console.log('wwwww credentials', credentials);

  if (credentials) {
    let password = await stringHelper.decrypt(credentials.password);
    //  console.log('wwwwwww d',credentials.password,password)
    //  let epassword = await stringHelper.encrypt(credentials.password);
    // console.log('wwwwwww d',credentials.password,epassword)
    let r = await store.dispatch(
      UserActions.login(
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

export function getScreenName(data) {
  let screenName = '';
  switch (data) {
    case 'home':
      screenName = 'HomeS';
  }
  return screenName;
}

export function getPersonalInfo() {
  let {userData} = store.getState().user;
  let [fname, ...rest] = userData.name.split(' ');

  return {
    first_name: fname,
    last_name: rest.join(' '),

    phone: userData.phone,

    profile_pic: userData.profile_pic,
  };
}
export function getIdCard() {
  let {idCard} = store.getState().user;

  if (idCard) {
    return {
      front: idCard.front,
      back: idCard.back,
    };
  }
  return {};
}

export function isStep1Completed() {
  let {userData} = store.getState().user;
  let {name, phone, profile_pic} = userData;

  return name && phone && profile_pic;
}
export function getInsuranceStatus() {
  let {insuranceCards} = store.getState().user;
  //let {name,phone,profile_pic} = userData;
  if (!insuranceCards.length) {
    return '';
  }
  let status = '1';
  let hold = insuranceCards.some(r => r.is_approved == '2');
  if (hold) {
    status = '2';
  } else {
    let review = insuranceCards.some(r => r.is_approved == '0');
    if (review) {
      status = '0';
    }
  }
  return status;
}
