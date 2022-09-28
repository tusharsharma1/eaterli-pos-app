import 'react-native-reanimated';
import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
import App from './src/App';
import store from './src/redux/store';

function MainApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => MainApp);
