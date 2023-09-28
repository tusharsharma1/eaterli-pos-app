import 'react-native-reanimated';
import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
import App from './src/App';
import store from './src/redux/store';
import {MenuProvider} from 'react-native-popup-menu';
import Text from './src/components/Text';

React.store = store;
LogBox.ignoreAllLogs();
function MainApp() {
  return (
    <Provider store={store}>
        {/* <Text>AA</Text> */}
      <MenuProvider>
        <App />
      </MenuProvider>
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => MainApp);


// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
