//import Snackbar from 'react-native-snackbar';
import * as Keychain from 'react-native-keychain';
import userAction from '../redux/actions/user.action';

import store from '../redux/store';
import stringHelper from './string.helper';
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
