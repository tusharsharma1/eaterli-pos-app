import 'react-native-reanimated';
import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
import App from './src/App';
import store from './src/redux/store';
React.store = store;
LogBox.ignoreAllLogs();
function MainApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => MainApp);
