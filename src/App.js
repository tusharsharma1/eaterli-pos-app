import React, {useEffect} from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AppProgess from './components/AppProgess';
import RequestPermissions from './components/RequestPermissions';
import ToastContainer from './components/ToastContainer';
import Navigator from './Navigator';
import theme from './theme';
import AlertBox from './components/AlertBox';
import PrintersModal from './Screens/components/PrintersModal';
import {fcmService} from './firebase/FCMService';
import {useDispatch} from 'react-redux';
import userAction from './redux/actions/user.action';
import { getUniqueId } from 'react-native-device-info';
import useTheme from './hooks/useTheme';

const App = () => {
  const dispatch = useDispatch();
  const themeData = useTheme();
  useEffect(() => {
    initApp();
  }, []);
  const initApp = async () => {
    let deviceId = await getUniqueId();
    dispatch(userAction.set({deviceId:`${deviceId}`}));

    fcmService.getToken(token => {
      console.log('[FCMService]  device token', token);
      dispatch(userAction.set({deviceToken: token}));
    });
  };
  return (
    <>
      <StatusBar
        backgroundColor={themeData.appBg}
        translucent={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <Navigator />

          <RequestPermissions />

          {/* <NoInternet /> */}
        </SafeAreaView>
      </KeyboardAvoidingView>
      <AlertBox />
      <AppProgess />
      <PrintersModal />
      <ToastContainer />
    </>
  );
};

export default App;
