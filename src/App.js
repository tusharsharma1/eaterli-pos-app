import React from 'react';

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

const App = () => {
  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.secondaryColor}
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
      <PrintersModal/>
      <ToastContainer />
    </>
  );
};

export default App;


