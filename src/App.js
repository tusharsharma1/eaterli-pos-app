import React from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AppProgess from './components/AppProgess';
import RequestPermissions from './components/RequestPermissions';
import Navigator from './Navigator';
import theme from './theme';

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

          <AppProgess />

          <RequestPermissions/>

          {/* <NoInternet /> */}
          {/* <AlertBox /> */}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

export default App;
